import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { CONTACT_INFO } from "@/lib/desa-data";

const FOOTER_LINKS = [
  { label: "Artikel", href: "/articles" },
  { label: "Profil", href: "/profile" },
  { label: "Struktur", href: "/structure" },
  { label: "Kontak", href: "/contact" },
];

export function Footer() {
  const tahun = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-sm mb-2">{SITE_NAME}</h3>
            <p className="text-sm text-muted-foreground">
              {CONTACT_INFO.address}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Tautan</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Kontak</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="hover:text-foreground"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-foreground"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>{CONTACT_INFO.jamKerja}</li>
              <li className="text-xs">{CONTACT_INFO.jamLibur}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Media Sosial</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {CONTACT_INFO.socialMedia.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.platform} ${SITE_NAME}`}
                    className="hover:text-foreground"
                  >
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
          &copy; {tahun} Pemerintah Desa Tulungrejo
        </div>
      </div>
    </footer>
  );
}
