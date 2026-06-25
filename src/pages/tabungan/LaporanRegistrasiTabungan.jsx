import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Pencil, Trash2, FileSpreadsheet, X, Save } from 'lucide-react';
import * as XLSX from 'xlsx';

const BANKS = ['Mandiri', 'BCA', 'BRI', 'BNI', 'BSI', 'Lainnya'];
const STATUS_OPTIONS = ['Aktif', 'Tidak Aktif'];

const fmtIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(val) || 0);

export const LaporanRegistrasiTabungan = () => {
  const { data, addTabungan, updateTabungan, deleteTabungan } = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState({ anggotaId: '', noRekening: '', bank: 'Mandiri', status: 'Aktif' });
  const [search, setSearch] = useState('');

  const activeAnggota = data.anggota.filter(a => a.status === 'Aktif');

  const dataList = data.tabungan
    .map(t => {
      const anggota = data.anggota.find(a => a.id === t.anggotaId);
      const totalSaldo = Number(t.saldoPokok || 0) + Number(t.saldoWajib || 0) + Number(t.saldoSukarela || 0);
      return {
        ...t,
        namaAnggota: anggota ? `${anggota.nama} (${anggota.sbu})` : '-',
        totalSaldo
      };
    })
    .filter(t =>
      t.namaAnggota.toLowerCase().includes(search.toLowerCase()) ||
      t.noRekening.toLowerCase().includes(search.toLowerCase()) ||
      (t.bank || '').toLowerCase().includes(search.toLowerCase())
    );

const openEdit = (row) => {
    setEditingId(row.id);
    setForm({ anggotaId: row.anggotaId, noRekening: row.noRekening, bank: row.bank || 'Mandiri', status: row.status });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateTabungan(editingId, { noRekening: form.noRekening, bank: form.bank, status: form.status });
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    deleteTabungan(id);
    setConfirmDeleteId(null);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dataList.map((t, i) => ({
      No: i + 1,
      'No Rekening': t.noRekening,
      Bank: t.bank || '-',
      'Nama Anggota': t.namaAnggota,
      'Saldo': t.totalSaldo,
      'Status': t.status
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrasi Tabungan');
    XLSX.writeFile(wb, 'laporan_registrasi_tabungan.xlsx');
  };

  return (
    <div className="page-content">
      <h2 className="page-title mb-4">Laporan Registrasi Tabungan</h2>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Cari nama, no rekening, bank..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '320px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={exportToExcel}>
            <FileSpreadsheet size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>No</th>
              <th>No Rekening</th>
              <th>Bank</th>
              <th>Nama Anggota</th>
              <th>Saldo</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataList.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Belum ada data tabungan.</td></tr>
            ) : dataList.map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td>
                <td><strong>{t.noRekening}</strong></td>
                <td>{t.bank || '-'}</td>
                <td>{t.namaAnggota}</td>
                <td>{fmtIDR(t.totalSaldo)}</td>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                    background: t.status === 'Aktif' ? '#d1fae5' : '#fee2e2',
                    color: t.status === 'Aktif' ? '#065f46' : '#991b1b'
                  }}>{t.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button className="btn-icon btn-edit" onClick={() => openEdit(t)} title="Edit">
                      <Pencil size={15} />
                    </button>
                    <button className="btn-icon btn-delete" onClick={() => setConfirmDeleteId(t.id)} title="Hapus">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Rekening Tabungan</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <label className="form-label">Bank</label>
                <select className="form-control" value={form.bank} onChange={e => setForm({ ...form, bank: e.target.value })} required>
                  {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Nomor Rekening</label>
                <input type="text" className="form-control" value={form.noRekening} onChange={e => setForm({ ...form, noRekening: e.target.value })} required placeholder="Masukkan nomor rekening" />
              </div>
              {editingId && (
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
              <div className="form-actions mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary"><Save size={16} /> Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Konfirmasi Hapus */}
      {confirmDeleteId && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal-box" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#dc2626' }}>⚠️ Konfirmasi Hapus</h3>
              <button className="btn-icon" onClick={() => setConfirmDeleteId(null)}><X size={18} /></button>
            </div>
            <p style={{ margin: '16px 0', color: 'var(--text-main)' }}>
              Apakah Anda yakin ingin menghapus rekening ini? <br />
              <strong>Seluruh riwayat transaksi tabungan terkait juga akan ikut terhapus!</strong>
            </p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>Batal</button>
              <button className="btn" style={{ background: '#dc2626', color: 'white' }} onClick={() => handleDelete(confirmDeleteId)}>
                <Trash2 size={16} /> Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
