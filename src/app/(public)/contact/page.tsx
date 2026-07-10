import { CONTACT_INFO } from "@/lib/desa-data";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicContactMap } from "@/components/map/dynamic-contact-map";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <h1 className="text-3xl font-bold">Kontak</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4">
              <div>
                <h2 className="font-semibold mb-1">Alamat</h2>
                <p className="text-sm text-muted-foreground">
                  {CONTACT_INFO.address}
                </p>
              </div>
              <div>
                <h2 className="font-semibold mb-1">Telepon</h2>
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
              <div>
                <h2 className="font-semibold mb-1">Email</h2>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div>
                <h2 className="font-semibold mb-1">Jam Kerja</h2>
                <p className="text-sm text-muted-foreground">
                  {CONTACT_INFO.jamKerja}
                </p>
                <p className="text-sm text-muted-foreground">
                  {CONTACT_INFO.jamLibur} libur
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="h-[400px] rounded-lg overflow-hidden border">
          <DynamicContactMap center={CONTACT_INFO.coordinates} />
        </div>
      </div>
    </div>
  );
}
