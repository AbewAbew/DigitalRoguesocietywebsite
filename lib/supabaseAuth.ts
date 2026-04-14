import { AdminSession, AdminUser } from '../types';
import { getSupabaseSetupMessage, isSupabaseConfigured } from './blogApi';

type AuthUserResponse = {
  id: string;
  email: string | null;
  email_confirmed_at?: string | null;
};

type AuthSessionResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  user?: AuthUserResponse | null;
  msg?: string;
};

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const ADMIN_EMAILS_TABLE = 'admin_emails';
const SESSION_STORAGE_KEY = 'drseg-admin-session';

const ensureSupabaseConfig = (): void => {
  if (!isSupabaseConfigured()) {
    throw new Error(getSupabaseSetupMessage());
  }
};

const mapAuthUser = (user: AuthUserResponse | null | undefined): AdminUser => {
  if (!user?.id || !user.email) {
    throw new Error('Supabase did not return a valid user.');
  }

  return {
    id: user.id,
    email: user.email,
    emailConfirmedAt: user.email_confirmed_at ?? null,
  };
};

const toSession = (payload: AuthSessionResponse): AdminSession => {
  if (!payload.access_token || !payload.refresh_token || !payload.user) {
    throw new Error('Supabase did not return an active session.');
  }

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt:
      payload.expires_at ??
      Math.floor(Date.now() / 1000) + (payload.expires_in ?? 3600),
    user: mapAuthUser(payload.user),
  };
};

const readStoredSession = (): AdminSession | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as AdminSession;

    if (!parsed?.accessToken || !parsed?.refreshToken || !parsed?.user?.email) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const persistAdminSession = (session: AdminSession): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearAdminSession = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
};

const getErrorMessage = async (response: Response): Promise<string> => {
  const clone = response.clone();

  try {
    const body = await response.json();

    if (typeof body?.msg === 'string') {
      return body.msg;
    }

    if (typeof body?.message === 'string') {
      return body.message;
    }

    if (typeof body?.error_description === 'string') {
      return body.error_description;
    }

    if (typeof body?.error === 'string') {
      return body.error;
    }
  } catch {
    const rawText = await clone.text();
    if (rawText) {
      return rawText;
    }
  }

  return `Supabase auth request failed with status ${response.status}.`;
};

const authFetch = async <T>(
  path: string,
  init: RequestInit = {},
  accessToken?: string,
): Promise<T> => {
  ensureSupabaseConfig();

  const headers = new Headers(init.headers);
  headers.set('apikey', SUPABASE_ANON_KEY);

  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  } else {
    headers.set('Authorization', `Bearer ${SUPABASE_ANON_KEY}`);
  }

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const signInAdminWithEmail = async (
  email: string,
  password: string,
): Promise<AdminSession> => {
  const payload = await authFetch<AuthSessionResponse>(
    '/auth/v1/token?grant_type=password',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );

  const session = toSession(payload);
  persistAdminSession(session);
  return session;
};

export const signUpAdminWithEmail = async (
  email: string,
  password: string,
): Promise<{ session: AdminSession | null; needsEmailConfirmation: boolean; message: string }> => {
  const payload = await authFetch<AuthSessionResponse>(
    '/auth/v1/signup',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );

  if (payload.access_token && payload.refresh_token && payload.user) {
    const session = toSession(payload);
    persistAdminSession(session);
    return {
      session,
      needsEmailConfirmation: false,
      message: 'Admin account created and signed in.',
    };
  }

  return {
    session: null,
    needsEmailConfirmation: true,
    message:
      payload.msg ||
      'Check your email for the confirmation link, then return here and sign in.',
  };
};

export const fetchAuthenticatedAdmin = async (accessToken: string): Promise<AdminUser> => {
  const payload = await authFetch<AuthUserResponse>('/auth/v1/user', {}, accessToken);
  return mapAuthUser(payload);
};

export const refreshAdminSession = async (refreshToken: string): Promise<AdminSession> => {
  const payload = await authFetch<AuthSessionResponse>(
    '/auth/v1/token?grant_type=refresh_token',
    {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    },
  );

  const session = toSession(payload);
  persistAdminSession(session);
  return session;
};

export const restoreAdminSession = async (): Promise<AdminSession | null> => {
  const storedSession = readStoredSession();

  if (!storedSession) {
    return null;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);

  try {
    if (storedSession.expiresAt <= nowInSeconds + 60) {
      return await refreshAdminSession(storedSession.refreshToken);
    }

    const user = await fetchAuthenticatedAdmin(storedSession.accessToken);
    const hydratedSession = { ...storedSession, user };
    persistAdminSession(hydratedSession);
    return hydratedSession;
  } catch {
    try {
      return await refreshAdminSession(storedSession.refreshToken);
    } catch {
      clearAdminSession();
      return null;
    }
  }
};

export const signOutAdmin = async (accessToken: string): Promise<void> => {
  try {
    await authFetch('/auth/v1/logout', { method: 'POST' }, accessToken);
  } finally {
    clearAdminSession();
  }
};

export const checkAdminAllowlist = async (accessToken: string, email: string): Promise<boolean> => {
  const search = new URLSearchParams({
    select: 'email',
    email: `eq.${email}`,
    limit: '1',
  });

  const rows = await authFetch<Array<{ email: string }>>(
    `/rest/v1/${ADMIN_EMAILS_TABLE}?${search.toString()}`,
    {},
    accessToken,
  );

  return rows.length > 0;
};
