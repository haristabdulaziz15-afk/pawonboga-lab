import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!role) redirect("/login?callbackUrl=/dashboard");
  if (role !== "ADMIN" && role !== "PENGELOLA_TOKO") redirect("/unauthorized");
  return <DashboardClient />;
}
