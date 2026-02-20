export type AuthUser = {
  id: string;
  email?: string;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  user: AuthUser;
};

type AuthChangeEvent = "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED";
type AuthChangeCallback = (event: AuthChangeEvent, session: AuthSession | null) => void;

type OAuthOptions = {
  provider: "google";
  options?: {
    redirectTo?: string;
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const STORAGE_KEY = "thumbnail_ai.auth.session";
const listeners = new Set<AuthChangeCallback>();

const nowInSeconds = () => Math.floor(Date.now() / 1000);

const emit = (event: AuthChangeEvent, session: AuthSession | null) => {
  listeners.forEach((listener) => listener(event, session));
};

const getStoredSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const setStoredSession = (session: AuthSession | null) => {
  if (typeof window === "undefined") return;

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const normalizeSession = (data: {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}): AuthSession => ({
  ...data,
  expires_at: nowInSeconds() + data.expires_in,
});

const refreshSession = async (refreshToken: string): Promise<AuthSession | null> => {
  if (!isConfigured) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey!,
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: AuthUser;
  };

  const session = normalizeSession(data);
  setStoredSession(session);
  emit("TOKEN_REFRESHED", session);
  return session;
};

const validateSessionUser = async (accessToken: string): Promise<boolean> => {
  if (!isConfigured) return false;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.ok;
};

const getSessionFromHash = (): AuthSession | null => {
  if (typeof window === "undefined") return null;
  if (!window.location.hash) return null;

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");
  const tokenType = hashParams.get("token_type");
  const expiresIn = hashParams.get("expires_in");

  if (!accessToken || !refreshToken || !tokenType || !expiresIn) {
    return null;
  }

  const payload = JSON.parse(atob(accessToken.split(".")[1])) as {
    sub: string;
    email?: string;
  };

  const session: AuthSession = {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: tokenType,
    expires_in: Number(expiresIn),
    expires_at: nowInSeconds() + Number(expiresIn),
    user: {
      id: payload.sub,
      email: payload.email,
    },
  };

  setStoredSession(session);
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  emit("SIGNED_IN", session);

  return session;
};

export const supabase = {
  auth: {
    signInWithOAuth: async ({ provider, options }: OAuthOptions) => {
      if (!isConfigured) {
        return { data: null, error: new Error("Missing Supabase environment variables.") };
      }

      if (typeof window === "undefined") {
        return { data: null, error: new Error("OAuth login is only available in the browser.") };
      }

      const redirectTo = options?.redirectTo ?? `${window.location.origin}/auth/callback`;
      const authorizeUrl = new URL(`${supabaseUrl}/auth/v1/authorize`);
      authorizeUrl.searchParams.set("provider", provider);
      authorizeUrl.searchParams.set("redirect_to", redirectTo);
      authorizeUrl.searchParams.set("prompt", "select_account");

      window.location.href = authorizeUrl.toString();
      return { data: null, error: null };
    },

    exchangeCodeForSession: async (_code: string) => {
      if (!isConfigured) {
        return { data: { session: null }, error: new Error("Missing Supabase environment variables.") };
      }

      const session = getSessionFromHash();
      if (!session) {
        return {
          data: { session: null },
          error: new Error("OAuth callback token not found. Please retry login."),
        };
      }

      return { data: { session }, error: null };
    },

    getSession: async () => {
      if (!isConfigured) {
        return { data: { session: null }, error: new Error("Missing Supabase environment variables.") };
      }

      const sessionFromHash = getSessionFromHash();
      if (sessionFromHash) {
        return { data: { session: sessionFromHash }, error: null };
      }

      const session = getStoredSession();

      if (!session) {
        return { data: { session: null }, error: null };
      }

      if (session.expires_at > nowInSeconds() + 30) {
        const isValid = await validateSessionUser(session.access_token);
        if (!isValid) {
          setStoredSession(null);
          emit("SIGNED_OUT", null);
          return { data: { session: null }, error: null };
        }
        return { data: { session }, error: null };
      }

      const refreshed = await refreshSession(session.refresh_token);
      if (!refreshed) {
        setStoredSession(null);
        emit("SIGNED_OUT", null);
        return { data: { session: null }, error: null };
      }
      return { data: { session: refreshed }, error: null };
    },

    onAuthStateChange: (callback: AuthChangeCallback) => {
      listeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => listeners.delete(callback),
          },
        },
      };
    },

    signOut: async () => {
      if (!isConfigured) {
        return { error: new Error("Missing Supabase environment variables.") };
      }

      const session = getStoredSession();

      if (session) {
        await fetch(`${supabaseUrl}/auth/v1/logout`, {
          method: "POST",
          headers: {
            apikey: supabaseAnonKey!,
            Authorization: `Bearer ${session.access_token}`,
          },
        });
      }

      setStoredSession(null);
      emit("SIGNED_OUT", null);

      return { error: null };
    },
  },
};
