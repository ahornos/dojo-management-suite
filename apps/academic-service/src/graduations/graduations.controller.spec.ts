/**
 * @file graduations.controller.spec.ts
 * @description Unit tests for GraduationsController. The controller only routes: role-based branching
 * lives in GraduationsService (see `graduations.service.spec.ts`).
 */

import { AuthenticatedUser, Role } from '@dms/shared-types';
import { GraduationsController } from './graduations.controller';
import { GraduationsService } from './graduations.service';

describe('GraduationsController', () => {
  let controller: GraduationsController;
  let service: jest.Mocked<
    Pick<GraduationsService, 'graduateOrPropose' | 'evaluateGraduationEligibility' | 'rollbackGraduation'>
  >;

  const params = { studentProfileId: 'student-1' };
  const user: AuthenticatedUser = { userId: 'user-1', email: 'u@dojo.com', roles: [Role.INSTRUCTOR] };

  beforeEach(() => {
    service = {
      graduateOrPropose: jest.fn().mockResolvedValue({ status: 'PENDING' }),
      evaluateGraduationEligibility: jest.fn().mockResolvedValue({ eligibility: {} }),
      rollbackGraduation: jest.fn().mockResolvedValue({ id: 'rank-1' }),
    };
    controller = new GraduationsController(service as unknown as GraduationsService);
  });

  it('delegates graduation/proposal to the service with the authenticated user and DTO', async () => {
    const dto = { proposedBeltId: 'belt-2' };

    await expect(controller.graduateStudent(params, dto, user)).resolves.toEqual({ status: 'PENDING' });

    expect(service.graduateOrPropose).toHaveBeenCalledWith('student-1', user, dto);
  });

  it('delegates eligibility checks to the service', async () => {
    await controller.checkEligibility(params);

    expect(service.evaluateGraduationEligibility).toHaveBeenCalledWith('student-1');
  });

  it('delegates rollbacks to the service', async () => {
    await controller.rollbackGraduation(params);

    expect(service.rollbackGraduation).toHaveBeenCalledWith('student-1');
  });
});
