import { prisma } from "@/lib/prisma";
import CatalogClient from "@/components/CatalogClient";

export const dynamic = "force-dynamic";

type ProductRow = Awaited<ReturnType<typeof prisma.product.findMany>>[number];

export default async function Home() {
  let products: ProductRow[] = [];
  let waNumber = "6281200000000";
  try {
    products = await prisma.product.findMany({ where: { isActive: true }, orderBy: [{ unggulan: "desc" }, { createdAt: "desc" }] });
    const setting = await prisma.setting.findUnique({ where: { key: "wa_number" } });
    if (setting?.value) waNumber = setting.value;
  } catch {
    // DB may not be set up yet; show setup hint in client
  }
  return <CatalogClient initialProducts={products} waNumber={waNumber} />;
}