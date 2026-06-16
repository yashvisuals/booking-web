export type AuthUser = { email: string; role: 'PROVIDER' | 'CUSTOMER' };

export const getToken = () => localStorage.getItem('token');
export const setToken = (t: string) => localStorage.setItem('token', t);
export const clearToken = () => localStorage.removeItem('token');

/** Read the email + role out of the JWT payload (no verification needed client-side). */
export function decodeToken(token: string | null): AuthUser | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { email: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}
