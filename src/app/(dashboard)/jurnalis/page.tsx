import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function JurnalisPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Jurnalis</h1>
        <p className="text-muted-foreground">Manajemen artikel desa</p>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Fitur manajemen artikel akan tersedia setelah integrasi Decap CMS.
        </p>
      </div>
    </div>
  );
}
