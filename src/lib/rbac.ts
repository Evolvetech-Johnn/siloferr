import type { Session } from "next-auth";

export type Role =
  | "ADMIN"
  | "EXECUTIVE"
  | "SUPER_ADMIN"
  | "SALES"
  | "ANALYST";

export function requireRole(
  session: Session | null,
  roles: readonly Role[],
): session is Session {
  const role = session?.user?.role as Role | undefined;
  return !!role && roles.includes(role);
}

