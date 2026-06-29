import client from './client';
import { ApiResponse, AuthData } from '../types';

export async function loginApi(email: string, password: string) {
  const { data } = await client.post<ApiResponse<AuthData>>('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function registerApi(email: string, name: string, password: string) {
  const { data } = await client.post<ApiResponse<AuthData>>('/auth/register', {
    email,
    name,
    password,
  });
  return data;
}
