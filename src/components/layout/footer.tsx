import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-sm mb-2">{SITE_NAME}</h3>
            <p className="text-sm text-muted-foreground">
              Kecamatan Wates, Kabupaten Blitar
              <br />
              Jawa Timur, Indonesia
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Tautan</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <Link href="/articles" className="hover:text-foreground">
                  Artikel
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-foreground">
                  Profil
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Kontak</h3>
            <p className="text-sm text-muted-foreground">email@tulungrejo.id</p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_NAME}. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
