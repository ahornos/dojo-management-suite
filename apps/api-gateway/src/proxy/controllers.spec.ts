/**
 * @file controllers.spec.ts
 * @description Unit tests for the three proxying controllers: URLs come from `ConfigService`
 * and the original URL is forwarded to the right downstream service.
 */

import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { ProxyService } from './proxy.service';
import { AuthController } from '../auth/auth.controller';
import { AcademicController } from '../academic/academic.controller';
import { FinancialController } from '../financial/financial.controller';

describe('Gateway proxy controllers', () => {
  const proxy = { forwardRequest: jest.fn().mockResolvedValue({ proxied: true }) };
  const settings: Record<string, string> = {
    AUTH_SERVICE_URL: 'http://auth.internal:3000',
    ACADEMIC_SERVICE_URL: 'http://academic.internal:3000',
    FINANCIAL_SERVICE_URL: 'http://financial.internal:3000',
  };

  /**
   * Compiles a controller with the mocked proxy and configuration.
   *
   * @param {new (...args: never[]) => T} controller - Controller class.
   * @returns {Promise<T>} Controller instance.
   */
  const build = async <T>(controller: new (...args: never[]) => T): Promise<T> => {
    const module = await Test.createTestingModule({
      controllers: [controller],
      providers: [
        { provide: ProxyService, useValue: proxy },
        { provide: ConfigService, useValue: { get: (key: string) => settings[key] } },
      ],
    }).compile();
    return module.get(controller);
  };

  const req = (originalUrl: string) => ({ originalUrl }) as unknown as Request;

  beforeEach(() => jest.clearAllMocks());

  it('AuthController forwards every route to AUTH_SERVICE_URL keeping the original URL', async () => {
    const controller = await build(AuthController);
    const request = req('/api/auth/users/1');

    const calls: Array<() => Promise<unknown>> = [
      () => controller.login(request),
      () => controller.register(request),
      () => controller.createUser(request),
      () => controller.findAllUsers(request),
      () => controller.updateUser(request),
      () => controller.removeUser(request),
      () => controller.proxyAll(request),
    ];
    for (const call of calls) await expect(call()).resolves.toEqual({ proxied: true });

    expect(proxy.forwardRequest).toHaveBeenCalledTimes(calls.length);
    for (const [url, forwarded] of proxy.forwardRequest.mock.calls) {
      expect(url).toBe('http://auth.internal:3000/api/auth/users/1');
      expect(forwarded).toBe(request);
    }
  });

  it('AcademicController rewrites /api/academic to /api for the academic-service', async () => {
    const controller = await build(AcademicController);

    await controller.proxyDisciplines(req('/api/academic/disciplines?x=1'));
    await controller.proxyStudents(req('/api/academic/students/9'));
    await controller.proxyAttendances(req('/api/academic/attendances'));
    await controller.proxyGraduations(req('/api/academic/graduations'));

    expect(proxy.forwardRequest.mock.calls.map(([url]) => url)).toEqual([
      'http://academic.internal:3000/api/disciplines?x=1',
      'http://academic.internal:3000/api/students/9',
      'http://academic.internal:3000/api/attendances',
      'http://academic.internal:3000/api/graduations',
    ]);
  });

  it('FinancialController forwards every financial route to FINANCIAL_SERVICE_URL', async () => {
    const controller = await build(FinancialController);

    await controller.proxyCash(req('/api/financial/cash/sessions'));
    await controller.proxyFees(req('/api/financial/fees'));
    await controller.proxyRemittances(req('/api/financial/remittances/batches'));
    await controller.proxyDiscounts(req('/api/financial/discounts'));

    expect(proxy.forwardRequest.mock.calls.map(([url]) => url)).toEqual([
      'http://financial.internal:3000/api/financial/cash/sessions',
      'http://financial.internal:3000/api/financial/fees',
      'http://financial.internal:3000/api/financial/remittances/batches',
      'http://financial.internal:3000/api/financial/discounts',
    ]);
  });

  it('falls back to the default URLs when nothing is configured', async () => {
    for (const key of Object.keys(settings)) delete settings[key];
    const controller = await build(AuthController);

    await controller.login(req('/api/auth/login'));

    expect(proxy.forwardRequest.mock.calls[0][0]).toBe('http://auth-service:3000/api/auth/login');
  });
});
