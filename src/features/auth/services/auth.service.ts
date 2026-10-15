import { httpClient } from '../../common/http';
import { AuthResponse, LoginPayload, RegisterPayload } from '../domain/auth.types';

export const AuthService = {
  login: (payload: LoginPayload) => httpClient<AuthResponse>('/auth/login', { method: 'POST', data: payload }),
  register: (payload: RegisterPayload) => httpClient<AuthResponse>('/auth/register', { method: 'POST', data: payload }),
};