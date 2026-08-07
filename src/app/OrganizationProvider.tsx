import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { organizations } from '../data/organizations';

type OrganizationContextValue = {
  organization: (typeof organizations)[number];
  organizations: typeof organizations;
  setOrganizationId: (id: string) => void;
};

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [organizationId, setOrganizationId] = useState(organizations[0].id);
  const organization = organizations.find((item) => item.id === organizationId) ?? organizations[0];
  const value = useMemo(() => ({ organization, organizations, setOrganizationId }), [organization]);
  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) throw new Error('OrganizationProvider is missing');
  return context;
}
