/**
 * @file students.controller.spec.ts
 * @description Unit tests for StudentsController: pure delegation, with the authenticated user injected
 * through `@CurrentUser()` instead of the raw request.
 */

import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthenticatedUser, Role } from '@dms/shared-types';

describe('StudentsController', () => {
  const service = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({ id: 's1' }),
    create: jest.fn().mockResolvedValue({ id: 's1' }),
    updateProfile: jest.fn().mockResolvedValue({ id: 's1' }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };
  const controller = new StudentsController(service as unknown as StudentsService);
  const user: AuthenticatedUser = { userId: 'u1', email: 'a@dojo.test', roles: [Role.ADMIN_STAFF] };

  beforeEach(() => jest.clearAllMocks());

  it('lists students', async () => {
    await expect(controller.findAll()).resolves.toEqual([]);
  });

  it('passes the authenticated user to findOne', async () => {
    await controller.findOne('s1', user);

    expect(service.findOne).toHaveBeenCalledWith('s1', user);
  });

  it('passes the DTO and the actor to create (status history audit)', async () => {
    const dto = { isMinor: false } as CreateStudentDto;

    await controller.create(dto, user);

    expect(service.create).toHaveBeenCalledWith(dto, user);
  });

  it('passes the typed update DTO and the actor to updateProfile', async () => {
    const dto = { statusReason: 'moved' } as UpdateStudentDto;

    await controller.update('s1', dto, user);

    expect(service.updateProfile).toHaveBeenCalledWith('s1', dto, user);
  });

  it('removes a student', async () => {
    await controller.remove('s1');

    expect(service.remove).toHaveBeenCalledWith('s1');
  });
});
