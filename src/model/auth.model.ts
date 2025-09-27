import { ROLE } from './role.model';

export interface JWTPayload {
  userId: string;
  role: ROLE;
}

export interface AuthTokenType {
  refreshToken: string;
  accessToken: string;
}
