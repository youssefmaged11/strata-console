import { createContext, useContext, useState, type ReactNode } from 'react';
import { people } from '../data/people';
import type { Person } from '../types';

type SessionContextValue = {
  user: Person;
  setUser: (user: Person) => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(people[0]);
  return <SessionContext.Provider value={{ user, setUser }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('SessionProvider is missing');
  return context;
}
