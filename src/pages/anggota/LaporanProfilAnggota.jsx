import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { FileSpreadsheet, UserCheck, UserX } from 'lucide-react';
import * as XLSX from 'xlsx';

export const LaporanProfilAnggota = () => {
  const { data } = useContext(AppContext);
  const anggotaList = data.anggota;

  const exportToExcel = () => {
    // Map data for export
    const exportData = anggotaList.map((a, index) => ({
      'No': index + 1,
      'ID Anggota': a.id,
      'Nama Lengkap': a.nama,
      'Jenis Kelamin': a.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      'Tahun Masuk': a.tahunMasuk,
      'SBU': a.sbu,
      'Alamat': a.alamat,
      'Status': a.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Profil Anggota");
    
    // Generate buffer and download
    XLSX.writeFile(workbook, "Laporan_Profil_Anggota.xlsx");
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="page-title">Laporan Profil Anggota</h2>
        <button className="btn btn-success" onClick={exportToExcel} disabled={anggotaList.length === 0}>
          <FileSpreadsheet size={18} />
          Export Excel
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Lengkap</th>
                <th>Jenis Kelamin</th>
                <th>Thn Masuk</th>
                <th>SBU</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {anggotaList.length > 0 ? (
                anggotaList.map((anggota) => (
                  <tr key={anggota.id}>
                    <td>{anggota.id.slice(-6)}</td>
                    <td style={{ fontWeight: 500 }}>{anggota.nama}</td>
                    <td>{anggota.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</td>
                    <td>{anggota.tahunMasuk}</td>
                    <td><span className="badge badge-outline">{anggota.sbu}</span></td>
                    <td>
                      {anggota.status === 'Aktif' ? (
                        <span className="badge badge-success"><UserCheck size={14} style={{marginRight: '4px'}} /> Aktif</span>
                      ) : (
                        <span className="badge badge-danger"><UserX size={14} style={{marginRight: '4px'}} /> Keluar</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    Belum ada data anggota.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
