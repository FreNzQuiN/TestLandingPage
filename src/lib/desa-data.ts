import type { VillageProfile } from "./types";

export const VILLAGE_PROFILE: VillageProfile = {
  name: "Desa Tulungrejo",
  kecamatan: "Wates",
  kabupaten: "Blitar",
  provinsi: "Jawa Timur",
  visi: "TODO: isi visi desa",
  misi: ["TODO: isi misi 1", "TODO: isi misi 2"],
  administrasi: [
    { label: "Jumlah KK", value: "TODO" },
    { label: "Jumlah Penduduk", value: "TODO" },
    { label: "Luas Wilayah", value: "TODO" },
    { label: "Koordinat", value: "TODO" },
    { label: "Topografi", value: "TODO" },
    { label: "Mata Pencaharian Utama", value: "TODO" },
    { label: "Sarana Pendidikan", value: "TODO" },
    { label: "Sarana Kesehatan", value: "TODO" },
  ],
  batasWilayah: {
    utara: "TODO",
    selatan: "TODO",
    timur: "TODO",
    barat: "TODO",
  },
  sejarah: "TODO: isi sejarah desa",
};

export const VILLAGE_OFFICIALS = [
  { name: "TODO", position: "Kepala Desa", photo: null },
  { name: "TODO", position: "Sekretaris Desa", photo: null },
  { name: "TODO", position: "Kaur Tata Usaha", photo: null },
  { name: "TODO", position: "Kaur Keuangan", photo: null },
  { name: "TODO", position: "Kaur Perencanaan", photo: null },
  { name: "TODO", position: "Kasi Pemerintahan", photo: null },
  { name: "TODO", position: "Kasi Pelayanan", photo: null },
  { name: "TODO", position: "Kasi Kesejahteraan", photo: null },
] as const;

export const HEAD_MESSAGE = {
  name: "TODO: nama kades",
  title: "Kepala Desa Tulungrejo",
  message: "TODO: sambutan kades",
} as const;

export const CONTACT_INFO = {
  address: "Desa Tulungrejo, Kecamatan Wates, Kabupaten Blitar, Jawa Timur",
  phone: "085791371559",
  email: "tulungrejo.gandusari.pemdes@gmail.com",
  jamKerja: "Senin-Jumat 08:00-16:00",
  jamLibur: "Sabtu-Minggu",
  socialMedia: [
    { platform: "Facebook", url: "#" },
    { platform: "YouTube", url: "#" },
  ],
  coordinates: [-8.08, 112.22] as [number, number],
} as const;
