import { SetMetadata } from '@nestjs/common';
import { ROLE, ROLES_KEY } from 'src/model/role.model';

export const Roles = (...roles: ROLE[]) => SetMetadata(ROLES_KEY, roles);