import { VILLAGE_OFFICIALS } from "@/lib/desa-data";
import { Card, CardContent } from "@/components/ui/card";

function OfficialAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-muted text-xl font-semibold">
      {initials}
    </div>
  );
}

export default function StructurePage() {
  const kades = VILLAGE_OFFICIALS.find((o) => o.position === "Kepala Desa");
  const others = VILLAGE_OFFICIALS.filter((o) => o.position !== "Kepala Desa");

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <h1 className="text-3xl font-bold">Struktur Organisasi</h1>

      {kades && (
        <section>
          <Card>
            <CardContent className="flex items-center gap-6">
              <OfficialAvatar name={kades.name} />
              <div>
                <p className="text-lg font-semibold">{kades.name}</p>
                <p className="text-muted-foreground">{kades.position}</p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {others.map((official) => (
          <Card key={official.position}>
            <CardContent className="flex items-center gap-4">
              <OfficialAvatar name={official.name} />
              <div>
                <p className="font-semibold">{official.name}</p>
                <p className="text-sm text-muted-foreground">
                  {official.position}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
