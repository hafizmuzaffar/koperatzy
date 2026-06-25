import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';

import { RegistrasiAnggota } from './pages/anggota/RegistrasiAnggota';
import { AnggotaKeluar } from './pages/anggota/AnggotaKeluar';
import { ApproveAnggotaKeluar } from './pages/anggota/ApproveAnggotaKeluar';
import { LaporanRegistrasiAnggota } from './pages/anggota/LaporanRegistrasiAnggota';

import { RegistrasiTabungan } from './pages/tabungan/RegistrasiTabungan';
import { TransaksiTabungan } from './pages/tabungan/TransaksiTabungan';
import { PindahBuku } from './pages/tabungan/PindahBuku';
import { LaporanRegistrasiTabungan } from './pages/tabungan/LaporanRegistrasiTabungan';

import { PengajuanPinjaman } from './pages/pinjaman/PengajuanPinjaman';
import { TransaksiPinjamanAction } from './pages/pinjaman/TransaksiPinjamanAction';
import { FormAngsuran } from './pages/pinjaman/FormAngsuran';
import { ApprovePinjaman } from './pages/pinjaman/ApprovePinjaman';
import { TransaksiPelunasan } from './pages/pinjaman/TransaksiPelunasan';

import { 
  LapAnggotaKeluar, LapSaldoAnggota, LapRekapAnggota,
  LapRegistrasiTabungan, LapSaldoTabungan, LapTransaksiTabungan,
  LapPindahBuku, LapStatementTabungan, LapRekapTabungan,
  LapPengajuanPinjaman, LapPencairanPinjaman,
  LapKartuAngsuran, LapPelunasanPinjaman, LapSaldoPinjaman, LapRekapPinjaman
} from './pages/Reports';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Anggota */}
            <Route path="anggota/registrasi" element={<RegistrasiAnggota />} />
            <Route path="anggota/transaksi/keluar" element={<AnggotaKeluar />} />
            <Route path="anggota/transaksi/approve-keluar" element={<ApproveAnggotaKeluar />} />
            <Route path="anggota/daftar-keluar" element={<LapAnggotaKeluar />} />
            <Route path="anggota/laporan/registrasi" element={<LaporanRegistrasiAnggota />} />
            <Route path="anggota/laporan/saldo" element={<LapSaldoAnggota />} />
            <Route path="anggota/laporan/profil" element={<LaporanRegistrasiAnggota />} />
            <Route path="anggota/laporan/keluar" element={<LapAnggotaKeluar />} />
            <Route path="anggota/laporan/rekap" element={<LapRekapAnggota />} />
            
            {/* Tabungan */}
            <Route path="tabungan/registrasi" element={<RegistrasiTabungan />} />
            <Route path="tabungan/transaksi/setoran" element={<TransaksiTabungan jenis="Setoran" />} />
            <Route path="tabungan/transaksi/penarikan" element={<TransaksiTabungan jenis="Penarikan" />} />
            <Route path="tabungan/transaksi/pindah-buku" element={<PindahBuku />} />
            <Route path="tabungan/laporan/registrasi" element={<LaporanRegistrasiTabungan />} />
            <Route path="tabungan/laporan/setoran" element={<LapTransaksiTabungan jenis="Setoran" />} />
            <Route path="tabungan/laporan/penarikan" element={<LapTransaksiTabungan jenis="Penarikan" />} />
            <Route path="tabungan/laporan/pindah-buku" element={<LapPindahBuku />} />
            <Route path="tabungan/laporan/saldo" element={<LapSaldoTabungan />} />
            <Route path="tabungan/laporan/statement" element={<LapStatementTabungan />} />
            <Route path="tabungan/laporan/rekap" element={<LapRekapTabungan />} />

            {/* Pinjaman */}
            <Route path="pinjaman/pengajuan" element={<PengajuanPinjaman />} />
            <Route path="pinjaman/registrasi" element={<ApprovePinjaman />} />
            <Route path="pinjaman/transaksi/pencairan" element={<TransaksiPinjamanAction action="Pencairan" />} />
            <Route path="pinjaman/transaksi/angsuran" element={<FormAngsuran />} />
            <Route path="pinjaman/transaksi/pelunasan" element={<TransaksiPelunasan />} />
            <Route path="pinjaman/laporan/pengajuan" element={<LapPengajuanPinjaman />} />
            <Route path="pinjaman/laporan/pencairan" element={<LapPencairanPinjaman />} />
            <Route path="pinjaman/laporan/saldo" element={<LapSaldoPinjaman />} />
            <Route path="pinjaman/laporan/angsuran" element={<LapKartuAngsuran />} />
            <Route path="pinjaman/laporan/pelunasan" element={<LapPelunasanPinjaman />} />
            <Route path="pinjaman/laporan/rekap" element={<LapRekapPinjaman />} />
            
            <Route path="*" element={<div className="page-content">Halaman tidak ditemukan.</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
