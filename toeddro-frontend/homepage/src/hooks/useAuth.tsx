// SANDBOX: no auth. Always signed out.
import { createContext, useContext, type ReactNode } from "react";

type AuthCtx = { user: null; session: null; loading: boolean; signOut: () => Promise<void> };
const Ctx = createContext<AuthCtx>({ user: null, session: null, loading: false, signOut: async () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <Ctx.Provider value={{ user: null, session: null, loading: false, signOut: async () => {} }}>
    {children}
  </Ctx.Provider>
);
export const useAuth = () => useContext(Ctx);
