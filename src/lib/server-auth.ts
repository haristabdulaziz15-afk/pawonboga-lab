import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user as { id: string; role: Role; name?: string | null; email?: string | null } | undefined;
}

export function canManageProducts(role?: Role) {
  return role === Role.ADMIN || role === Role.PENGELOLA_TOKO;
}
