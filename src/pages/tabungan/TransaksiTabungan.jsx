import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Save } from 'lucide-react';

export const TransaksiTabungan = ({ jenis }) => {
  const { data, addTransaksiTabungan } = useContext(AppContext);
  const [tabunganId, setTabunganId] = useState('');
  const [jenisSimpanan, setJenisSimpanan] = useState('Simpanan Sukarela');
  const [nominal, setNominal] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const activeTabungan = data.tabungan.filter(t => t.status === 'Aktif');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tabunganId) return;
    
    // Check balance for penarikan
    if (jenis === 'Penarikan') {
      const tab = activeTabungan.find(t => t.id === tabunganId);
      if (tab && Number(nominal) > tab.saldoSukarela) {
        alert(`Saldo Sukarela tidak mencukupi! Saldo: Rp ${tab.saldoSukarela.toLocaleString('id-ID')}`);
        return;
      }
    }

    addTransaksiTabungan({ tabunganId, jenis, jenisSimpanan: jenis === 'Setoran' ? jenisSimpanan : 'Simpanan Sukarela', nominal: Number(nominal) });
    setShowSuccess(true);
    setTabunganId(''); setNominal('');
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="page-content">
      <h2 className="page-title mb-4">Transaksi {jenis === 'Penarikan' ? 'Penarikan Tabungan Sukarela' : `Setoran Tabungan`}</h2>
      {showSuccess && <div className="alert-success mb-4"><span>Transaksi berhasil!</span></div>}
      <div className="card">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Pilih Rekening Tabungan</label>
              <select className="form-control" value={tabunganId} onChange={(e) => setTabunganId(e.target.value)} required>
                <option value="">-- Pilih Rekening --</option>
                {activeTabungan.map(t => {
                   const ang = data.anggota.find(a => a.id === t.anggotaId);
                   if (jenis === 'Penarikan') {
                      return <option key={t.id} value={t.id}>{t.noRekening} - {ang?.nama} ({ang?.sbu}) (Saldo Sukarela: Rp {t.saldoSukarela?.toLocaleString('id-ID')})</option>
                   }
                   return <option key={t.id} value={t.id}>{t.noRekening} - {ang?.nama} ({ang?.sbu})</option>
                })}
              </select>
            </div>

            {jenis === 'Setoran' && (
              <div className="form-group">
                <label className="form-label">Jenis Simpanan</label>
                <select className="form-control" value={jenisSimpanan} onChange={(e) => setJenisSimpanan(e.target.value)}>
                  <option value="Simpanan Pokok">Simpanan Pokok</option>
                  <option value="Simpanan Wajib">Simpanan Wajib</option>
                  <option value="Simpanan Sukarela">Simpanan Sukarela</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Nominal (Rp)</label>
              <input type="number" className="form-control" value={nominal} onChange={(e) => setNominal(e.target.value)} required min="10000" />
            </div>
          </div>
          <div className="form-actions mt-4"><button type="submit" className="btn btn-primary"><Save size={18} /> Simpan Transaksi</button></div>
        </form>
      </div>
    </div>
  );
};
