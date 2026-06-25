import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { GenericReport } from '../components/GenericReport';

// Utility formatter
const fmtIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(val) || 0);
const fmtDate = (val) => val ? new Date(val).toLocaleDateString('id-ID') : '-';

// Anggota Reports
export const LapRegistrasiAnggota = () => {
  const { data } = useContext(AppContext);
  const cols = [
    { header: 'ID Anggota', key: 'id' },
    { header: 'Nama', key: 'nama' },
    { header: 'SBU', key: 'sbu' },
    { header: 'Tgl Daftar', key: 'tglMasuk' },
  ];
  const activeAnggota = data.anggota.filter(a => a.status !== 'Keluar');
  return <GenericReport title="Laporan Registrasi Anggota" columns={cols} dataList={activeAnggota.map(a => ({...a, nama: `${a.nama} (${a.sbu})`}))} />;
};

export const LapAnggotaKeluar = () => {
  const { data } = useContext(AppContext);
  const cols = [
    { header: 'ID Anggota', key: 'id' },
    { header: 'Nama', key: 'nama' },
    { header: 'Alasan Keluar', key: 'alasanKeluar' },
    { header: 'Tgl Keluar', key: 'tglKeluar', render: fmtDate },
  ];
  return <GenericReport title="Laporan Anggota Keluar" columns={cols} dataList={data.anggota.filter(a => a.status === 'Keluar').map(a => ({...a, nama: `${a.nama} (${a.sbu})`}))} />;
};

export const LapSaldoAnggota = () => {
  const { data } = useContext(AppContext);
  const activeAnggota = data.anggota.filter(a => a.status !== 'Keluar');
  const dataList = activeAnggota.map(a => {
    // Ambil dari tabungan yang dimiliki anggota ini
    const tabAnggota = data.tabungan.filter(t => t.anggotaId === a.id);
    const pokok = tabAnggota.reduce((sum, t) => sum + Number(t.saldoPokok || 0), 0);
    const wajib = tabAnggota.reduce((sum, t) => sum + Number(t.saldoWajib || 0), 0);
    const sukarela = tabAnggota.reduce((sum, t) => sum + Number(t.saldoSukarela || 0), 0);
    return { ...a, nama: `${a.nama} (${a.sbu})`, pokok, wajib, sukarela, total: pokok + wajib + sukarela };
  });
  const cols = [
    { header: 'Nama', key: 'nama' },
    { header: 'Simpanan Pokok', key: 'pokok', render: fmtIDR },
    { header: 'Simpanan Wajib', key: 'wajib', render: fmtIDR },
    { header: 'Simpanan Sukarela', key: 'sukarela', render: fmtIDR },
    { header: 'Total Saldo', key: 'total', render: fmtIDR }
  ];
  return <GenericReport title="Laporan Saldo Simpanan Anggota" columns={cols} dataList={dataList} />;
};

export const LapRekapAnggota = () => LapSaldoAnggota();

// Tabungan Reports
export const LapRegistrasiTabungan = () => {
  const { data } = useContext(AppContext);
  const dataList = data.tabungan.map(t => {
    const ang = data.anggota.find(a => a.id === t.anggotaId);
    const totalSaldo = Number(t.saldoPokok || 0) + Number(t.saldoWajib || 0) + Number(t.saldoSukarela || 0);
    return { ...t, namaAnggota: ang ? `${ang.nama} (${ang.sbu})` : '-', totalSaldo };
  });
  const cols = [
    { header: 'No Rekening', key: 'noRekening' },
    { header: 'Nama Anggota', key: 'namaAnggota' },
    { header: 'Status', key: 'status' },
    { header: 'Saldo', key: 'totalSaldo', render: fmtIDR },
  ];
  return <GenericReport title="Laporan Registrasi Rekening" columns={cols} dataList={dataList} />;
};

export const LapSaldoTabungan = () => {
  const { data } = useContext(AppContext);
  const dataList = data.tabungan.map(t => {
    const ang = data.anggota.find(a => a.id === t.anggotaId);
    const totalSaldo = Number(t.saldoPokok || 0) + Number(t.saldoWajib || 0) + Number(t.saldoSukarela || 0);
    return { ...t, namaAnggota: ang ? `${ang.nama} (${ang.sbu})` : '-', totalSaldo };
  });
  const cols = [
    { header: 'No Rekening', key: 'noRekening' },
    { header: 'Nama Anggota', key: 'namaAnggota' },
    { header: 'Saldo Pokok', key: 'saldoPokok', render: fmtIDR },
    { header: 'Saldo Wajib', key: 'saldoWajib', render: fmtIDR },
    { header: 'Saldo Sukarela', key: 'saldoSukarela', render: fmtIDR },
    { header: 'Total Saldo', key: 'totalSaldo', render: fmtIDR },
  ];
  return <GenericReport title="Laporan Saldo Tabungan" columns={cols} dataList={dataList} />;
};

export const LapTransaksiTabungan = ({ jenis }) => {
  const { data } = useContext(AppContext);
  const dataList = data.transaksiTabungan.filter(t => t.jenis === jenis).map(t => {
    const tab = data.tabungan.find(tb => tb.id === t.tabunganId);
    const ang = data.anggota.find(a => a.id === tab?.anggotaId);
    return { ...t, noRekening: tab?.noRekening || '-', namaAnggota: ang ? `${ang.nama} (${ang.sbu})` : '-' };
  });
  const cols = [
    { header: 'Tanggal', key: 'tgl', render: fmtDate },
    { header: 'No Rekening', key: 'noRekening' },
    { header: 'Nama Anggota', key: 'namaAnggota' },
    { header: 'Jenis Simpanan', key: 'jenisSimpanan' },
    { header: 'Nominal', key: 'nominal', render: fmtIDR },
  ];
  return <GenericReport title={`Laporan Transaksi ${jenis} Tabungan`} columns={cols} dataList={dataList} />;
};

export const LapPindahBuku = () => {
  const { data } = useContext(AppContext);
  const dataList = data.transaksiTabungan.filter(t => t.jenis.includes('Pindah Buku')).map(t => {
    const tab = data.tabungan.find(tb => tb.id === t.tabunganId);
    const ang = data.anggota.find(a => a.id === tab?.anggotaId);
    return { ...t, noRekening: tab?.noRekening || '-', namaAnggota: ang ? `${ang.nama} (${ang.sbu})` : '-' };
  });
  const cols = [
    { header: 'Tanggal', key: 'tgl', render: fmtDate },
    { header: 'Jenis', key: 'jenis' },
    { header: 'No Rekening', key: 'noRekening' },
    { header: 'Keterangan', key: 'keterangan' },
    { header: 'Nominal', key: 'nominal', render: fmtIDR }
  ];
  return <GenericReport title="Laporan Pindah Buku Tabungan" columns={cols} dataList={dataList} />;
};

export const LapStatementTabungan = () => {
  const { data } = useContext(AppContext);
  const dataList = data.transaksiTabungan.map(t => {
    const tab = data.tabungan.find(tb => tb.id === t.tabunganId);
    const ang = data.anggota.find(a => a.id === tab?.anggotaId);
    return { ...t, noRekening: tab?.noRekening || '-', namaAnggota: ang ? `${ang.nama} (${ang.sbu})` : '-' };
  });
  const cols = [
    { header: 'Tanggal', key: 'tgl', render: fmtDate },
    { header: 'No Rekening', key: 'noRekening' },
    { header: 'Nama Anggota', key: 'namaAnggota' },
    { header: 'Jenis', key: 'jenis' },
    { header: 'Jenis Simpanan', key: 'jenisSimpanan' },
    { header: 'Nominal', key: 'nominal', render: fmtIDR },
    { header: 'Keterangan', key: 'keterangan' },
  ];
  return <GenericReport title="Laporan Statement Tabungan" columns={cols} dataList={dataList} />;
};

export const LapRekapTabungan = () => {
  const { data } = useContext(AppContext);
  const dataList = data.tabungan.map(t => {
    const ang = data.anggota.find(a => a.id === t.anggotaId);
    const totalSaldo = Number(t.saldoPokok || 0) + Number(t.saldoWajib || 0) + Number(t.saldoSukarela || 0);
    // Hitung total penarikan dari transaksi rekening ini
    const trx = data.transaksiTabungan.filter(trx => trx.tabunganId === t.id);
    const totalPenarikan = trx
      .filter(trx => trx.jenis === 'Penarikan' || trx.jenis === 'Pindah Buku Keluar')
      .reduce((sum, trx) => sum + Number(trx.nominal), 0);
    return { 
      ...t, 
      namaAnggota: ang ? `${ang.nama} (${ang.sbu})` : '-',
      totalSaldo,
      totalPenarikan
    };
  });

  const cols = [
    { header: 'No Rekening', key: 'noRekening' },
    { header: 'Nama Anggota', key: 'namaAnggota' },
    { header: 'Saldo Pokok', key: 'saldoPokok', render: fmtIDR },
    { header: 'Saldo Wajib', key: 'saldoWajib', render: fmtIDR },
    { header: 'Saldo Sukarela', key: 'saldoSukarela', render: fmtIDR },
    { header: 'Penarikan', key: 'totalPenarikan', render: fmtIDR },
    { header: 'Total Saldo', key: 'totalSaldo', render: fmtIDR },
  ];
  return <GenericReport title="Laporan Rekap Tabungan" columns={cols} dataList={dataList} />;
};

// Pinjaman Reports
export const LapPengajuanPinjaman = () => {
  const { data } = useContext(AppContext);
  const dataList = data.pinjaman.map(p => {
    const ang = data.anggota.find(a => a.id === p.anggotaId);
    return { ...p, namaAnggota: ang ? `${ang.nama} (${ang.sbu})` : '-' };
  });
  const cols = [
    { header: 'Tgl Pengajuan', key: 'tglPengajuan', render: fmtDate },
    { header: 'Nama Anggota', key: 'namaAnggota' },
    { header: 'Nominal', key: 'nominalPinjaman', render: fmtIDR },
    { header: 'Tenor', key: 'tenorBulan', render: (val) => `${val} Bln` },
    { header: 'Status', key: 'status' },
  ];
  return <GenericReport title="Laporan Pengajuan Pinjaman" columns={cols} dataList={dataList} />;
};

export const LapPencairanPinjaman = () => {
  const { data } = useContext(AppContext);
  const dataList = data.transaksiPinjaman.filter(t => t.jenis === 'Pencairan').map(t => {
     const p = data.pinjaman.find(pj => pj.id === t.pinjamanId);
     const ang = data.anggota.find(a => a.id === p?.anggotaId);
     return { ...t, namaAnggota: ang ? `${ang.nama} (${ang.sbu})` : '-' };
  });
  const cols = [
    { header: 'Tgl Pencairan', key: 'tgl', render: fmtDate },
    { header: 'Nama Anggota', key: 'namaAnggota' },
    { header: 'Nominal', key: 'nominal', render: fmtIDR }
  ];
  return <GenericReport title="Laporan Pencairan Pinjaman" columns={cols} dataList={dataList} />;
};

export const LapKartuAngsuran = () => {
  const { data } = useContext(AppContext);
  const dataList = data.transaksiPinjaman.filter(t => t.jenis === 'Angsuran').map(t => {
     const p = data.pinjaman.find(pj => pj.id === t.pinjamanId);
     const ang = data.anggota.find(a => a.id === p?.anggotaId);
     return { ...t, namaAnggota: ang ? `${ang.nama} (${ang.sbu})` : '-' };
  });
  const cols = [
    { header: 'Tgl Angsuran', key: 'tgl', render: fmtDate },
    { header: 'Nama Anggota', key: 'namaAnggota' },
    { header: 'Nominal', key: 'nominal', render: fmtIDR }
  ];
  return <GenericReport title="Laporan Kartu Angsuran" columns={cols} dataList={dataList} />;
};

export const LapPelunasanPinjaman = () => {
  const { data } = useContext(AppContext);
  const dataList = data.transaksiPinjaman.filter(t => t.jenis === 'Pelunasan').map(t => {
     const p = data.pinjaman.find(pj => pj.id === t.pinjamanId);
     const ang = data.anggota.find(a => a.id === p?.anggotaId);
     return { ...t, namaAnggota: ang ? `${ang.nama} (${ang.sbu})` : '-' };
  });
  const cols = [
    { header: 'Tgl Pelunasan', key: 'tgl', render: fmtDate },
    { header: 'Nama Anggota', key: 'namaAnggota' },
    { header: 'Nominal Pelunasan', key: 'nominal', render: fmtIDR }
  ];
  return <GenericReport title="Laporan Pelunasan Pinjaman" columns={cols} dataList={dataList} />;
};

export const LapSaldoPinjaman = () => {
  const { data } = useContext(AppContext);
  const dataList = data.pinjaman.filter(p => p.status === 'Aktif').map(p => {
    const ang = data.anggota.find(a => a.id === p.anggotaId);
    
    const nominal = Number(p.nominalPinjaman);
    const tenor = Number(p.tenorBulan);
    const bunga = nominal * 0.02; 
    const angsuranPerBulan = Math.round(bunga + (nominal / tenor));

    const existingTrx = data.transaksiPinjaman.filter(t => t.pinjamanId === p.id && t.jenis === 'Angsuran');
    const jumlahDibayar = existingTrx.length;
    
    const sisaBulan = tenor - jumlahDibayar;
    const sisaAngsuran = sisaBulan * angsuranPerBulan;

    return { 
      ...p, 
      namaAnggota: ang ? `${ang.nama} (${ang.sbu})` : '-',
      sisaBulan,
      sisaAngsuran
    };
  });

  const cols = [
    { header: 'No Pinjaman', key: 'id', render: (val) => val.substring(0,8) },
    { header: 'Nama Anggota', key: 'namaAnggota' },
    { header: 'Plafon', key: 'nominalPinjaman', render: fmtIDR },
    { header: 'Tenor', key: 'tenorBulan', render: (val) => `${val} Bln` },
    { header: 'Sisa Tenor', key: 'sisaBulan', render: (val) => `${val} Bln` },
    { header: 'Sisa Saldo', key: 'sisaAngsuran', render: fmtIDR }
  ];
  return <GenericReport title="Laporan Saldo Pinjaman" columns={cols} dataList={dataList} />;
};

export const LapRekapPinjaman = () => LapSaldoPinjaman();
