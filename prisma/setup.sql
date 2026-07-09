-- ============================================================
-- Desa Tulungrejo — Schema + Seed Data
-- Paste ini ke TiDB Cloud SQL Editor, jalankan sekali saja.
-- ============================================================

-- Drop tables jika sudah ada (顺序: foreign keys first)
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS land_plots;
DROP TABLE IF EXISTS users;

-- ============================================================
-- 1. SCHEMA
-- ============================================================

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('kepala_desa', 'pamong_pajak', 'jurnalis') NOT NULL DEFAULT 'pamong_pajak',
  assigned_blok VARCHAR(50) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
);

CREATE TABLE land_plots (
  id INT NOT NULL AUTO_INCREMENT,
  nop VARCHAR(50) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  owner_nik VARCHAR(20) DEFAULT NULL,
  address VARCHAR(255) NOT NULL,
  village_name VARCHAR(255) NOT NULL DEFAULT 'Tulungrejo',
  kecamatan VARCHAR(255) NOT NULL DEFAULT 'Wates',
  blok VARCHAR(50) NOT NULL,
  land_area DECIMAL(10, 2) DEFAULT NULL,
  building_area DECIMAL(10, 2) DEFAULT NULL,
  njop_land DECIMAL(15, 2) DEFAULT NULL,
  njop_building DECIMAL(15, 2) DEFAULT NULL,
  pbb_amount DECIMAL(15, 2) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY land_plots_nop_unique (nop),
  INDEX land_plots_blok_idx (blok),
  INDEX land_plots_owner_nik_idx (owner_nik)
);

CREATE TABLE payments (
  id INT NOT NULL AUTO_INCREMENT,
  land_plot_id INT NOT NULL,
  year INT NOT NULL,
  month INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'belum_lunas',
  payment_date DATETIME DEFAULT NULL,
  marked_by INT DEFAULT NULL,
  notes VARCHAR(255) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY payments_land_plot_id_year_month_unique (land_plot_id, year, month),
  INDEX payments_status_idx (status),
  INDEX payments_year_month_status_idx (year, month, status),
  INDEX payments_year_month_idx (year, month)
);

-- ============================================================
-- 2. SEED DATA
-- ============================================================

-- Password: password123 (semua user)
SET @pwd = '$2b$10$M9/5GcYmHFJQNJKZOLcaU.ORfsc2P9SDdn9arJR7udh.NHIfZNFmq';

-- Users
INSERT INTO users (id, email, password_hash, name, role, assigned_blok) VALUES
(1, 'kades@tulungrejo.id',    @pwd, 'Kades Tulungrejo', 'kepala_desa',  NULL),
(2, 'pamong1@tulungrejo.id',  @pwd, 'Pamong Blok 1',    'pamong_pajak', 'Blok 1'),
(3, 'pamong2@tulungrejo.id',  @pwd, 'Pamong Blok 2',    'pamong_pajak', 'Blok 2'),
(4, 'jurnalis@tulungrejo.id', @pwd, 'Jurnalis Desa',     'jurnalis',     NULL);

-- Land Plots (20 plot, 5 blok)
INSERT INTO land_plots (id, nop, owner_name, owner_nik, address, blok, land_area, building_area, njop_land, njop_building, pbb_amount) VALUES
(1,  '35050100010001', 'Warga 1',  '3505010000000001', 'Jl. Desa Tulungrejo No. 1',  'Blok 1', 120.50, 65.00, 32000000.00, 18000000.00, 250000.00),
(2,  '35050100010002', 'Warga 2',  '3505010000000002', 'Jl. Desa Tulungrejo No. 2',  'Blok 2',  85.00, 45.00, 22000000.00, 12000000.00, 180000.00),
(3,  '35050100010003', 'Warga 3',  '3505010000000003', 'Jl. Desa Tulungrejo No. 3',  'Blok 3', 150.00, 80.00, 45000000.00, 25000000.00, 350000.00),
(4,  '35050100010004', 'Warga 4',  '3505010000000004', 'Jl. Desa Tulungrejo No. 4',  'Blok 4',  95.00, 50.00, 28000000.00, 15000000.00, 210000.00),
(5,  '35050100010005', 'Warga 5',  '3505010000000005', 'Jl. Desa Tulungrejo No. 5',  'Blok 5', 110.00, 60.00, 35000000.00, 20000000.00, 280000.00),
(6,  '35050100010006', 'Warga 6',  '3505010000000006', 'Jl. Desa Tulungrejo No. 6',  'Blok 1',  75.00, 35.00, 18000000.00,  9000000.00, 140000.00),
(7,  '35050100010007', 'Warga 7',  '3505010000000007', 'Jl. Desa Tulungrejo No. 7',  'Blok 2', 130.00, 70.00, 40000000.00, 22000000.00, 320000.00),
(8,  '35050100010008', 'Warga 8',  '3505010000000008', 'Jl. Desa Tulungrejo No. 8',  'Blok 3',  60.00, 30.00, 15000000.00,  8000000.00, 120000.00),
(9,  '35050100010009', 'Warga 9',  '3505010000000009', 'Jl. Desa Tulungrejo No. 9',  'Blok 4', 140.00, 75.00, 42000000.00, 24000000.00, 340000.00),
(10, '35050100010010', 'Warga 10', '3505010000000010', 'Jl. Desa Tulungrejo No. 10', 'Blok 5', 100.00, 55.00, 30000000.00, 16000000.00, 240000.00),
(11, '35050100010011', 'Warga 11', '3505010000000011', 'Jl. Desa Tulungrejo No. 11', 'Blok 1',  90.00, 48.00, 26000000.00, 14000000.00, 200000.00),
(12, '35050100010012', 'Warga 12', '3505010000000012', 'Jl. Desa Tulungrejo No. 12', 'Blok 2', 160.00, 85.00, 48000000.00, 28000000.00, 380000.00),
(13, '35050100010013', 'Warga 13', '3505010000000013', 'Jl. Desa Tulungrejo No. 13', 'Blok 3',  70.00, 38.00, 20000000.00, 10000000.00, 160000.00),
(14, '35050100010014', 'Warga 14', '3505010000000014', 'Jl. Desa Tulungrejo No. 14', 'Blok 4', 125.00, 68.00, 38000000.00, 21000000.00, 300000.00),
(15, '35050100010015', 'Warga 15', '3505010000000015', 'Jl. Desa Tulungrejo No. 15', 'Blok 5',  80.00, 42.00, 24000000.00, 13000000.00, 190000.00),
(16, '35050100010016', 'Warga 16', '3505010000000016', 'Jl. Desa Tulungrejo No. 16', 'Blok 1', 105.00, 58.00, 33000000.00, 19000000.00, 270000.00),
(17, '35050100010017', 'Warga 17', '3505010000000017', 'Jl. Desa Tulungrejo No. 17', 'Blok 2',  55.00, 28.00, 14000000.00,  7000000.00, 110000.00),
(18, '35050100010018', 'Warga 18', '3505010000000018', 'Jl. Desa Tulungrejo No. 18', 'Blok 3', 145.00, 78.00, 44000000.00, 26000000.00, 360000.00),
(19, '35050100010019', 'Warga 19', '3505010000000019', 'Jl. Desa Tulungrejo No. 19', 'Blok 4',  88.00, 46.00, 25000000.00, 13500000.00, 195000.00),
(20, '35050100010020', 'Warga 20', '3505010000000020', 'Jl. Desa Tulungrejo No. 20', 'Blok 5', 115.00, 62.00, 36000000.00, 21000000.00, 290000.00);

-- Payments (Juli 2026 — 12 lunas, 8 belum_lunas)
INSERT INTO payments (land_plot_id, year, month, status, payment_date, marked_by) VALUES
-- Blok 1: 3 lunas, 1 belum
(1,  2026, 7, 'lunas',      '2026-07-05 10:00:00', 2),
(6,  2026, 7, 'lunas',      '2026-07-06 14:30:00', 2),
(11, 2026, 7, 'lunas',      '2026-07-07 09:15:00', 2),
(16, 2026, 7, 'belum_lunas', NULL, NULL),
-- Blok 2: 2 lunas, 2 belum
(2,  2026, 7, 'lunas',      '2026-07-04 11:00:00', 3),
(12, 2026, 7, 'lunas',      '2026-07-08 16:00:00', 3),
(7,  2026, 7, 'belum_lunas', NULL, NULL),
(17, 2026, 7, 'belum_lunas', NULL, NULL),
-- Blok 3: 3 lunas, 2 belum
(3,  2026, 7, 'lunas',      '2026-07-03 08:45:00', 2),
(8,  2026, 7, 'lunas',      '2026-07-05 13:20:00', 2),
(13, 2026, 7, 'lunas',      '2026-07-09 10:00:00', 2),
(18, 2026, 7, 'belum_lunas', NULL, NULL),
-- Blok 4: 2 lunas, 2 belum
(4,  2026, 7, 'lunas',      '2026-07-06 15:00:00', 3),
(14, 2026, 7, 'lunas',      '2026-07-07 11:30:00', 3),
(9,  2026, 7, 'belum_lunas', NULL, NULL),
(19, 2026, 7, 'belum_lunas', NULL, NULL),
-- Blok 5: 2 lunas, 1 belum
(5,  2026, 7, 'lunas',      '2026-07-04 09:00:00', 2),
(10, 2026, 7, 'lunas',      '2026-07-08 14:00:00', 2),
(15, 2026, 7, 'belum_lunas', NULL, NULL),
(20, 2026, 7, 'belum_lunas', NULL, NULL);

-- ============================================================
-- Verifikasi
-- ============================================================
SELECT 'users' AS tbl, COUNT(*) AS cnt FROM users
UNION ALL
SELECT 'land_plots', COUNT(*) FROM land_plots
UNION ALL
SELECT 'payments', COUNT(*) FROM payments;
