export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Kontak</h1>
      <div className="max-w-lg space-y-4">
        <div>
          <h2 className="font-semibold">Alamat</h2>
          <p className="text-muted-foreground">
            Desa Tulungrejo, Kecamatan Wates, Kabupaten Blitar, Jawa Timur
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Email</h2>
          <p className="text-muted-foreground">email@tulungrejo.id</p>
        </div>
      </div>
    </div>
  );
}
