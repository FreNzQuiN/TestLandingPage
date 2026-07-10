import { getAllArticles } from "@/lib/mdx";
import { VILLAGE_PROFILE, HEAD_MESSAGE } from "@/lib/desa-data";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold">
      {initials}
    </div>
  );
}

export default function HomePage() {
  const articles = getAllArticles().slice(0, 6);
  const adminItems = VILLAGE_PROFILE.administrasi.filter(
    (a) =>
      a.label === "Jumlah KK" ||
      a.label === "Jumlah Penduduk" ||
      a.label === "Luas Wilayah",
  );

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-950 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Selamat Datang di Desa Tulungrejo
          </h1>
          <p className="text-emerald-100 text-lg">
            Kecamatan {VILLAGE_PROFILE.kecamatan}, Kabupaten{" "}
            {VILLAGE_PROFILE.kabupaten}, {VILLAGE_PROFILE.provinsi}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        <section>
          <h2 className="text-2xl font-bold mb-6">Sambutan Kepala Desa</h2>
          <Card>
            <CardContent className="flex gap-6">
              <InitialsAvatar name={HEAD_MESSAGE.name} />
              <div className="space-y-2">
                <p className="font-semibold">{HEAD_MESSAGE.name}</p>
                <p className="text-sm text-muted-foreground">
                  {HEAD_MESSAGE.title}
                </p>
                <p className="text-sm leading-relaxed">
                  {HEAD_MESSAGE.message}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Tentang Desa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {VILLAGE_PROFILE.name} adalah desa yang terletak di Kecamatan{" "}
                {VILLAGE_PROFILE.kecamatan}, Kabupaten{" "}
                {VILLAGE_PROFILE.kabupaten}, {VILLAGE_PROFILE.provinsi}.
              </p>
              <p>
                Desa ini memiliki potensi pertanian dan perkebunan yang luas
                serta didukung oleh masyarakat yang gotong royong dan
                berperilaku toleran.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {adminItems.map((item) => (
                <Card key={item.label}>
                  <CardContent className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-lg font-semibold">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Artikel Terbaru</h2>
            <Link
              href="/articles"
              className="text-sm text-primary hover:underline"
            >
              Lihat Semua
            </Link>
          </div>
          {articles.length === 0 ? (
            <p className="text-muted-foreground">Belum ada artikel.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="rounded-lg border bg-card p-6 hover:shadow-sm transition-shadow"
                >
                  <p className="text-xs text-muted-foreground mb-2">
                    {article.category}
                  </p>
                  <h3 className="font-semibold mb-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
