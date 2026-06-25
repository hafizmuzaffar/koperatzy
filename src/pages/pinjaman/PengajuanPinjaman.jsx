import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Save, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fmtIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(val) || 0);
const fmtDate = (val) => val ? new Date(val).toLocaleDateString('id-ID') : '-';

export const PengajuanPinjaman = () => {
  const { data, addPengajuanPinjaman } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    anggotaId: '',
    nominalPinjaman: '',
    tenorBulan: '12',
    tujuan: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const activeAnggota = data.anggota.filter(a => a.status === 'Aktif');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.anggotaId) return;

    addPengajuanPinjaman(formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/pinjaman/laporan/pengajuan');
    }, 2000);
  };

  return (
    <div className="page-content">
      <h2 className="page-title mb-4">Pengajuan Pinjaman</h2>
      
      {showSuccess && (
        <div className="alert-success mb-4">
          <span>Pengajuan pinjaman berhasil disimpan!</span>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Pilih Anggota</label>
              <select 
                className="form-control" 
                value={formData.anggotaId}
                onChange={(e) => setFormData({ ...formData, anggotaId: e.target.value })}
                required
              >
                <option value="">-- Pilih Anggota --</option>
                {activeAnggota.map(a => (
                  <option key={a.id} value={a.id}>{a.nama} ({a.sbu})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nominal Pengajuan (Rp)</label>
              <input 
                type="number" 
                className="form-control" 
                value={formData.nominalPinjaman}
                onChange={(e) => setFormData({ ...formData, nominalPinjaman: e.target.value })}
                required 
                min="100000"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tenor (Bulan)</label>
              <select 
                className="form-control" 
                value={formData.tenorBulan}
                onChange={(e) => setFormData({ ...formData, tenorBulan: e.target.value })}
              >
                <option value="6">6 Bulan</option>
                <option value="12">12 Bulan</option>
                <option value="24">24 Bulan</option>
                <option value="36">36 Bulan</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tujuan Pinjaman</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.tujuan}
                onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })}
                required 
              />
            </div>
          </div>
          <div className="form-actions mt-4">
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> Ajukan Pinjaman
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Daftar Pengajuan */}
      <div className="card mt-4" style={{ padding: 0, overflowX: 'auto' }}>
        <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid var(--border)' }}>
          <h3 className="card-title" style={{ marginBottom: 0, borderBottom: 'none' }}>Daftar Pengajuan Pinjaman</h3>
        </div>
        <div className="table-container">
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Anggota</th>
                <th>Nominal</th>
                <th>Status</th>
                <th>Tanggal Pengajuan</th>
              </tr>
            </thead>
            <tbody>
              {data.pinjaman.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Belum ada data pengajuan pinjaman.</td></tr>
              ) : data.pinjaman.map((p, i) => {
                const ang = data.anggota.find(a => a.id === p.anggotaId);
                const isPending = p.status === 'Pengajuan';
                return (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td><strong>{ang?.nama || '-'}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({ang?.sbu})</span></td>
                    <td style={{ fontWeight: 600 }}>{fmtIDR(p.nominalPinjaman)}</td>
                    <td>
                      {isPending ? (
                        <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, background: '#FEF3C7', color: '#92400E', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> Pending
                        </span>
                      ) : (
                        <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, background: '#d1fae5', color: '#065f46', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={12} /> Disetujui
                        </span>
                      )}
                    </td>
                    <td>{fmtDate(p.tglPengajuan)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
