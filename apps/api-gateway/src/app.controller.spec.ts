/**
 * @file app.controller.spec.ts
 * @description Unit tests for the gateway health endpoint (AppController + AppService).
 */

import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-10T12:00:00.000Z'));
    const module = await Test.createTestingModule({ controllers: [AppController], providers: [AppService] }).compile();
    controller = module.get(AppController);
  });

  afterEach(() => jest.useRealTimers());

  it('reports the gateway as healthy with a deterministic timestamp', () => {
    expect(controller.getHealth()).toEqual({ service: 'API Gateway', status: 'OK', timestamp: '2026-10-10T12:00:00.000Z' });
  });
});
