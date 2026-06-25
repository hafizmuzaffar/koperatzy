-- CreateTable
CREATE TABLE "Anggota" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "jenisKelamin" TEXT NOT NULL,
    "sbu" TEXT NOT NULL,
    "tglMasuk" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Aktif'
);

-- CreateTable
CREATE TABLE "Tabungan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "anggotaId" TEXT NOT NULL,
    "noRekening" TEXT NOT NULL,
    "saldo" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "tglBuka" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tabungan_anggotaId_fkey" FOREIGN KEY ("anggotaId") REFERENCES "Anggota" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TransaksiTabungan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tabunganId" TEXT NOT NULL,
    "tgl" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jenis" TEXT NOT NULL,
    "keterangan" TEXT,
    "nominal" REAL NOT NULL,
    CONSTRAINT "TransaksiTabungan_tabunganId_fkey" FOREIGN KEY ("tabunganId") REFERENCES "Tabungan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pinjaman" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "anggotaId" TEXT NOT NULL,
    "tglPengajuan" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nominalPinjaman" REAL NOT NULL,
    "tenorBulan" INTEGER NOT NULL,
    "tujuan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pengajuan',
    CONSTRAINT "Pinjaman_anggotaId_fkey" FOREIGN KEY ("anggotaId") REFERENCES "Anggota" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TransaksiPinjaman" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pinjamanId" TEXT NOT NULL,
    "tgl" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jenis" TEXT NOT NULL,
    "nominal" REAL NOT NULL,
    CONSTRAINT "TransaksiPinjaman_pinjamanId_fkey" FOREIGN KEY ("pinjamanId") REFERENCES "Pinjaman" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tabungan_noRekening_key" ON "Tabungan"("noRekening");
