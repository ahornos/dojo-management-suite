import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import type { Request } from 'express';
import { ProxyService } from './proxy.service';

/**
 * @file proxy.service.spec.ts
 * @description Unit tests for the ProxyService. Verifies that request forwarding
 * and header propagation logic works as expected without needing external HTTP calls.
 */
describe('ProxyService', () => {
  let service: ProxyService;
  let httpService: HttpService;

  const mockHttpService = {
    request: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProxyService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<ProxyService>(ProxyService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should correctly propagate headers and forward the request', async () => {
    const targetUrl = 'http://internal-microservice:3000/api/test';
    const mockResponseData = { success: true };
    
    // Simulate successful Axios response
    mockHttpService.request.mockReturnValue(of({ data: mockResponseData }));

    // Mock incoming Express Request
    const mockRequest = {
      method: 'POST',
      headers: {
        authorization: 'Bearer token-123',
        'x-school-id': 'dojo-barcelona',
        'content-type': 'application/json',
      },
      ip: '192.168.1.100',
      socket: {},
      body: { someData: true },
      query: { filter: 'active' },
    } as unknown as Request;

    const result = await service.forwardRequest(targetUrl, mockRequest);

    expect(result).toEqual(mockResponseData);
    expect(httpService.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: targetUrl,
        headers: expect.objectContaining({
          authorization: 'Bearer token-123',
          'x-school-id': 'dojo-barcelona',
          'x-real-ip': '192.168.1.100',
        }),
        data: { someData: true },
        params: { filter: 'active' },
      }),
    );
  });
});