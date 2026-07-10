import { VILLAGE_PROFILE } from "@/lib/desa-data";
import { Card, CardContent } from "@/components/ui/card";

const ARROWS: Record<string, string> = {
  utara: "\u2191",
  selatan: "\u2193",
  timur: "\u2192",
  barat: "\u2190",
};

const DIRECTION_LABELS: Record<string, string> = {
  utara: "Utara",
  selatan: "Selatan",
  timur: "Timur",
  barat: "Barat",
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <h1 className="text-3xl font-bold">Profil Desa</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Visi</h2>
        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
          {VILLAGE_PROFILE.visi}
        </blockquote>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Misi</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          {VILLAGE_PROFILE.misi.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Data Administratif</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-3 pr-4 font-semibold">Komponen</th>
                <th className="py-3 font-semibold">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {VILLAGE_PROFILE.administrasi.map((item, i) => (
                <tr
                  key={item.label}
                  className={i % 2 === 1 ? "bg-muted/50" : ""}
                >
                  <td className="py-3 pr-4">{item.label}</td>
                  <td className="py-3">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Batas Wilayah</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            Object.entries(VILLAGE_PROFILE.batasWilayah) as [string, string][]
          ).map(([dir, value]) => (
            <Card key={dir}>
              <CardContent className="flex items-center gap-4">
                <span className="text-2xl text-primary">
                  {ARROWS[dir] ?? ""}
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {DIRECTION_LABELS[dir] ?? dir}
                  </p>
                  <p className="font-medium">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Sejarah</h2>
        <p className="text-muted-foreground leading-relaxed">
          {VILLAGE_PROFILE.sejarah}
        </p>
      </section>
    </div>
  );
}
