"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const roleMenus: Record<string, { label: string; href: string }[]> = {
  kepala_desa: [
    { label: "Dashboard", href: "/kepaladesa" },
    { label: "Peta", href: "/kepaladesa/map" },
  ],
  pamong_pajak: [{ label: "Dashboard", href: "/pamong" }],
  jurnalis: [{ label: "Dashboard", href: "/jurnalis" }],
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const role = user?.role ?? "";
  const menuItems = roleMenus[role] ?? [];

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm">Desa Tulungrejo</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {role === "kepala_desa"
            ? "Kepala Desa"
            : role === "pamong_pajak"
              ? "Pamong Pajak"
              : "Jurnalis"}
        </p>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block px-3 py-2 text-sm rounded-md transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground truncate mb-2">
          {user?.email}
        </p>
        <button
          onClick={signOut}
          className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}
