import type { ReactNode } from 'react';

/**
 * This layout component is now a simple pass-through.
 * All route protection has been removed to ensure smooth client-side navigation
 * within the admin panel after login.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
