import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Save, Search } from 'lucide-react';

const formatRibuan = (val) => {
  if (!val) return '';
  const num = val.toString().replace(/[^0-9]/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const parseRibuan = (val) => {
  if (!val) return '';
  return val.toString().replace(/[^0-9]/g, '');
};

// ── Searchable dropdown component ──────────────────────────────────────────────
const SearchableSelect = ({ options, value, onChange, placeholder = 'Cari...' }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        className="form-control"
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', userSelect: 'none' }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ color: selected ? 'inherit' : 'var(--text-muted)' }}>
          {selected ? selected.label : placeholder}
        </span>
        <Search size={16} color="var(--text-muted)" />
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 999,
          background: 'var(--bg-card)', border: '1.5px solid var(--primary)',
          borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          marginTop: '4px', overflow: 'hidden'
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid var(--border)' }}>
            <input
              autoFocus
              type="text"
              className="form-control"
              placeholder="Ketik nama anggota..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ margin: 0, fontSize: '0.9rem' }}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tidak ditemukan</div>
            ) : filtered.map(o => (
              <div
                key={o.value}
                style={{
                  padding: '10px 16px', cursor: 'pointer', fontSize: '0.9rem',
                  background: o.value === value ? 'var(--primary-light)' : 'transparent',
                  color: o.value === value ? 'var(--primary)' : 'inherit',
                  fontWeight: o.value === value ? 600 : 400,
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = o.value === value ? 'var(--primary-light)' : 'var(--bg-secondary)'}
                onMouseLeave={e => e.currentTarget.style.background = o.value === value ? 'var(--primary-light)' : 'transparent'}
                onClick={() => { onChange(o.value); setQuery(''); setOpen(false); }}
              >
                {o.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
// ──────────────────────────────────────────────────────────────────────────────

export const TransaksiTabungan = ({ jenis }) => {
  const { data, addTransaksiTabungan } = useContext(AppContext);
  const [tabunganId, setTabunganId] = useState('');
  const [jenisSimpanan, setJenisSimpanan] = useState('Simpanan Sukarela');
  const [nominal, setNominal] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const activeTabungan = data.tabungan.filter(t => t.status === 'Aktif');

  // Build searchable options
  const tabunganOptions = activeTabungan.map(t => {
    const ang = data.anggota.find(a => a.id === t.anggotaId);
    const label = jenis === 'Penarikan'
      ? `${ang?.nama || '-'} (${ang?.sbu}) — ${t.noRekening} | Saldo Sukarela: Rp ${Number(t.saldoSukarela || 0).toLocaleString('id-ID')}`
      : `${ang?.nama || '-'} (${ang?.sbu}) — ${t.noRekening}`;
    return { value: t.id, label };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tabunganId) return;
    
    if (jenis === 'Penarikan') {
      const tab = activeTabungan.find(t => t.id === tabunganId);
      if (tab && Number(nominal) > tab.saldoSukarela) {
        alert(`Saldo Sukarela tidak mencukupi! Saldo: Rp ${Number(tab.saldoSukarela).toLocaleString('id-ID')}`);
        return;
      }
    }

    if (Number(nominal) < 10000) {
      alert("Minimal transaksi Rp 10.000");
      return;
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
              <SearchableSelect
                options={tabunganOptions}
                value={tabunganId}
                onChange={setTabunganId}
                placeholder="Cari nama anggota / rekening..."
              />
              {!tabunganId && <input type="text" required style={{ opacity: 0, height: 0, position: 'absolute' }} tabIndex={-1} />}
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
              <input type="text" className="form-control" value={formatRibuan(nominal)} onChange={(e) => setNominal(parseRibuan(e.target.value))} required />
            </div>
          </div>
          <div className="form-actions mt-4"><button type="submit" className="btn btn-primary"><Save size={18} /> Simpan Transaksi</button></div>
        </form>
      </div>
    </div>
  );
};
