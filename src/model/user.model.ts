import { ROLE } from './role.model';

export interface UserType {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: ROLE;
  createAt: string;
  updateAt: string;
}
