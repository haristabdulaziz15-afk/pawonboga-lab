import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminUsersClient from "@/components/AdminUsersClient";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!role) redirect("/login?callbackUrl=/admin/users");
  if (role !== "ADMIN") redirect("/unauthorized");
  return <AdminUsersClient />;
}
