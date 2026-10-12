/**
 * @file users-directory.client.spec.ts
 * @group unit
 * @description Unit tests for the academic-service client of the auth-service internal user directory:
 * request shape, batching, retry/backoff on transient failures, and error mapping.
 */
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@dms/shared-types';
import { AxiosError } from 'axios';
import { NEVER, of, throwError } from 'rxjs';
import {
  USER_DIRECTORY_BATCH_SIZE,
  USER_DIRECTORY_MAX_RETRIES,
  USER_DIRECTORY_TIMEOUT_MS,
  UsersDirectoryClient,
} from './users-directory.client';

/**
 * Builds an axios-like failure.
 *
 * @param {number | undefined} status - HTTP status, or `undefined` for a network error (no response).
 * @param {string} message - Upstream error code.
 * @returns {AxiosError} Error recognised by `axios.isAxiosError`.
 */
const axiosFailure = (status: number | undefined, message = 'boom'): AxiosError =>
  Object.assign(new Error(message), {
    isAxiosError: true,
    response: status === undefined ? undefined : { status, data: { message } },
  }) as AxiosError;

describe('UsersDirectoryClient', () => {

  beforeAll(() => {
    // Negative-path tests intentionally trigger the client's error log; keep the console clean.
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  let client: UsersDirectoryClient;
  const http = { post: jest.fn(), patch: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersDirectoryClient,
        { provide: HttpService, useValue: http },
        {
          provide: ConfigService,
          useValue: { getOrThrow: (key: string) => ({ AUTH_SERVICE_URL: 'http://auth:3000///', INTERNAL_API_KEY: 'k' })[key] },
        },
      ],
    }).compile();

    client = module.get(UsersDirectoryClient);
  });

  describe('findManyByIds', () => {
    it('de-duplicates ids, ignores nullish entries and sends one authenticated request', async () => {
      http.post.mockReturnValue(of({ data: [{ id: 'a' }, { id: 'b' }] }));

      const result = await client.findManyByIds(['a', 'b', 'a', null, undefined]);

      expect(http.post).toHaveBeenCalledTimes(1);
      expect(http.post).toHaveBeenCalledWith('http://auth:3000/api/internal/users/batch', { ids: ['a', 'b'] }, { headers: { 'x-internal-api-key': 'k' } });
      expect([...result.keys()]).toEqual(['a', 'b']);
    });

    it('returns an empty map without any HTTP call for an empty input', async () => {
      await expect(client.findManyByIds([null])).resolves.toEqual(new Map());
      expect(http.post).not.toHaveBeenCalled();
    });

    it('splits oversized lists into server-sized chunks', async () => {
      http.post.mockImplementation((_url: string, body: { ids: string[] }) => of({ data: body.ids.map((id) => ({ id })) }));
      const ids = Array.from({ length: USER_DIRECTORY_BATCH_SIZE + 1 }, (_v, i) => `id-${i}`);

      const result = await client.findManyByIds(ids);

      expect(http.post).toHaveBeenCalledTimes(2);
      expect(result.size).toBe(ids.length);
    });
  });

  describe('provision / updatePersonalData', () => {
    it('posts the provisioning request', async () => {
      http.post.mockReturnValue(of({ data: { id: 'u1' } }));

      await expect(client.provision({ email: 'a@b.co', role: Role.STUDENT })).resolves.toEqual({ id: 'u1' });
      expect(http.post.mock.calls[0][0]).toBe('http://auth:3000/api/internal/users/provision');
    });

    it('patches personal data and encodes the user id in the path', async () => {
      http.patch.mockReturnValue(of({ data: { id: 'u 1' } }));

      await client.updatePersonalData('u 1', { phone: '6' });

      expect(http.patch.mock.calls[0][0]).toBe('http://auth:3000/api/internal/users/u%201/personal-data');
    });
  });

  describe('resilience', () => {
    it('retries transient failures with backoff and eventually succeeds', async () => {
      http.post
        .mockReturnValueOnce(throwError(() => axiosFailure(undefined)))
        .mockReturnValueOnce(throwError(() => axiosFailure(503)))
        .mockReturnValueOnce(of({ data: [{ id: 'a' }] }));

      const result = await client.findManyByIds(['a']);

      expect(http.post).toHaveBeenCalledTimes(USER_DIRECTORY_MAX_RETRIES + 1);
      expect(result.has('a')).toBe(true);
    });

    it('gives up after the retry budget and reports service unavailability', async () => {
      http.post.mockReturnValue(throwError(() => axiosFailure(500)));

      await expect(client.findManyByIds(['a'])).rejects.toThrow(ServiceUnavailableException);
      expect(http.post).toHaveBeenCalledTimes(USER_DIRECTORY_MAX_RETRIES + 1);
    });

    it('aborts a hanging request after the timeout and retries it', async () => {
      jest.useFakeTimers();
      try {
        http.post.mockReturnValue(NEVER);

        const pending = client.findManyByIds(['a']);
        const assertion = expect(pending).rejects.toThrow(ServiceUnavailableException);
        await jest.advanceTimersByTimeAsync((USER_DIRECTORY_TIMEOUT_MS + 1000) * (USER_DIRECTORY_MAX_RETRIES + 1));

        await assertion;
        expect(http.post).toHaveBeenCalledTimes(USER_DIRECTORY_MAX_RETRIES + 1);
      } finally {
        jest.useRealTimers();
      }
    });

    it.each([
      [400, BadRequestException],
      [404, NotFoundException],
      [409, ConflictException],
    ])('does not retry a %s and maps it to the matching exception', async (status, expected) => {
      http.post.mockReturnValue(throwError(() => axiosFailure(status, 'UPSTREAM_CODE')));

      const call = client.provision({ email: 'a@b.co', role: Role.PARENT });

      await expect(call).rejects.toThrow(expected);
      await expect(call).rejects.toThrow('UPSTREAM_CODE');
      expect(http.post).toHaveBeenCalledTimes(1);
    });

    it.each([401, 403])('reports a %s (bad service credentials) as unavailability without retrying', async (status) => {
      http.post.mockReturnValue(throwError(() => axiosFailure(status)));

      await expect(client.provision({ email: 'a@b.co', role: Role.PARENT })).rejects.toThrow(ServiceUnavailableException);
      expect(http.post).toHaveBeenCalledTimes(1);
    });
  });
});
