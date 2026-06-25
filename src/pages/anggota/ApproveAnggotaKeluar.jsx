import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { CheckCircle, XCircle } from 'lucide-react';

export const ApproveAnggotaKeluar = () => {
  const { data, approveAnggotaKeluar, updateAnggotaStatus } = useContext(AppContext);
  const [showSuccess, setShowSuccess] = useState(false);

  const pendingAnggota = data.anggota.filter(a => a.status === 'Pending Keluar');

  const handleApprove = (id) => {
    approveAnggotaKeluar(id);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleReject = (id) => {
    updateAnggotaStatus(id, 'Aktif'); // Return to active if rejected
  };

  return (
    <div className="page-content">
      <h2 className="page-title mb-4">Approve Anggota Keluar</h2>
      
      {showSuccess && (
        <div className="alert-success mb-4">
          <CheckCircle size={20} />
          <span>Pengajuan keluar berhasil disetujui. Anggota dipindahkan ke Daftar Keluar.</span>
        </div>
      )}

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nama Anggota</th>
                <th>SBU</th>
                <th>Tanggal Masuk</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendingAnggota.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">Tidak ada pengajuan anggota keluar saat ini.</td>
                </tr>
              ) : (
                pendingAnggota.map(a => (
                  <tr key={a.id}>
                    <td>{a.nama}</td>
                    <td>{a.sbu}</td>
                    <td>{new Date(a.tglMasuk).toLocaleDateString('id-ID')}</td>
                    <td>
                      <button className="btn btn-sm" style={{backgroundColor: 'var(--primary-dark)', color: 'white', marginRight: '8px'}} onClick={() => handleApprove(a.id)}>
                        <CheckCircle size={14} style={{marginRight: '4px'}} /> Approve
                      </button>
                      <button className="btn btn-sm" style={{backgroundColor: 'var(--danger)', color: 'white'}} onClick={() => handleReject(a.id)}>
                        <XCircle size={14} style={{marginRight: '4px'}} /> Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
