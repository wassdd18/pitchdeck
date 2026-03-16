import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { account, ID } from '../lib/appwrite';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const current = await account.get();
        setUser(current);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      await account.createEmailPasswordSession(email, password);
      const current = await account.get();
      setUser(current);
      return current;
    } catch (err) {
      const msg = err?.message || 'Login failed';
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  }, []);

  const register = useCallback(async ({ email, password, name }) => {
    setLoading(true); setError(null);
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      const current = await account.get();
      setUser(current);
      return current;
    } catch (err) {
      const msg = err?.message || 'Registration failed';
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true); setError(null);
    try {
      await account.createRecovery(email, 'biconnect://reset-password');
    } catch (err) {
      const msg = err?.message || 'Failed to send recovery email';
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(async () => {
    try { await account.deleteSession('current'); }
    catch (e) { console.warn('Logout error:', e); }
    finally { setUser(null); }
  }, []);

  // ── Обновление имени и prefs ─────────────────────────
  const updateProfile = useCallback(async ({ name, prefs }) => {
    setLoading(true); setError(null);
    try {
      // Обновить имя если изменилось
      if (name && name !== user?.name) {
        await account.updateName(name);
      }
      // Обновить prefs если переданы
      if (prefs) {
        const merged = { ...(user?.prefs ?? {}), ...prefs };
        await account.updatePrefs(merged);
      }
      // Перечитать актуальный объект
      const current = await account.get();
      setUser(current);
      return current;
    } catch (err) {
      const msg = err?.message || 'Failed to update profile';
      setError(msg); throw new Error(msg);
    } finally { setLoading(false); }
  }, [user]);

  // ── Добавить / убрать кружок из "My Circles" ────────
  const toggleJoinedCircle = useCallback(async (circle) => {
    const current = user?.prefs?.joinedCircles ?? [];
    const exists  = current.find(c => c.id === circle.id);
    const updated = exists
      ? current.filter(c => c.id !== circle.id)
      : [...current, circle];

    await updateProfile({ prefs: { joinedCircles: updated } });
  }, [user, updateProfile]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      login, register, forgotPassword, logout,
      updateProfile, toggleJoinedCircle,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};