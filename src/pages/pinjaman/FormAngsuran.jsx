import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Calendar } from 'lucide-react';

const fmtIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(val) || 0);
const formatDate = (dateObj) => dateObj.toISOString().split('T')[0];

export const FormAngsuran = () => {
  const { data, addTransaksiPinjaman, updateStatusPinjaman } = useContext(AppContext);
  const [pinjamanId, setPinjamanId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Hanya pinjaman yang statusnya Aktif (sudah cair)
  const targetPinjaman = data.pinjaman.filter(p => p.status === 'Aktif');

  // Cari pinjaman yang sedang dipilih
  const selectedPinjaman = targetPinjaman.find(p => p.id === pinjamanId);
  const ang = selectedPinjaman ? data.anggota.find(a => a.id === selectedPinjaman.anggotaId) : null;

  // Hitungan angsuran
  let cicilanList = [];
  let angsuranPerBulan = 0;
  
  if (selectedPinjaman) {
    const nominal = Number(selectedPinjaman.nominalPinjaman);
    const tenor = Number(selectedPinjaman.tenorBulan);
    
    // Sesuai permintaan: (Nominal Pinjaman - 98%) + (Nominal Pinjaman / Tenor)
    // Nominal - 98% sama dengan 2% dari Nominal
    const bunga = nominal * 0.02; 
    angsuranPerBulan = Math.round(bunga + (nominal / tenor));

    // Cek transaksi angsuran yang sudah dibayar
    const existingTrx = data.transaksiPinjaman.filter(t => t.pinjamanId === pinjamanId && t.jenis === 'Angsuran');
    const jumlahDibayar = existingTrx.length;

    // Tanggal cair (asumsi dari tgl pencairan atau tgl pengajuan)
    const tglMulai = new Date(selectedPinjaman.tglPengajuan || Date.now());

    for (let i = 1; i <= tenor; i++) {
      const jatuhTempo = new Date(tglMulai);
      jatuhTempo.setMonth(jatuhTempo.getMonth() + i);

      cicilanList.push({
        ke: i,
        jumlah: angsuranPerBulan,
        jatuhTempo: formatDate(jatuhTempo),
        status: i <= jumlahDibayar ? 'sudah dibayar' : 'belum dibayar'
      });
    }
  }

  const handleBayar = () => {
    if (!selectedPinjaman) return;

    addTransaksiPinjaman({ 
      pinjamanId, 
      jenis: 'Angsuran', 
      nominal: angsuranPerBulan 
    });

    const existingTrx = data.transaksiPinjaman.filter(t => t.pinjamanId === pinjamanId && t.jenis === 'Angsuran');
    const jumlahDibayarLama = existingTrx.length;
    
    // Jika ini adalah angsuran terakhir
    if (jumlahDibayarLama + 1 >= Number(selectedPinjaman.tenorBulan)) {
      updateStatusPinjaman(pinjamanId, 'Lunas');
      setPinjamanId(''); // Reset selection if lunas
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="page-content">
      <h2 className="page-title mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Calendar size={24} color="var(--primary)" /> Angsuran
      </h2>

      {showSuccess && (
        <div className="alert-success mb-4">
          <span>Pembayaran angsuran berhasil disimpan!</span>
        </div>
      )}

      {/* Card Pilih Pinjaman */}
      <div className="card mb-4">
        <div className="form-group mb-0">
          <label className="form-label" style={{ color: 'var(--text-muted)' }}>Pilih Pinjaman</label>
          <select 
            className="form-control" 
            value={pinjamanId} 
            onChange={(e) => setPinjamanId(e.target.value)} 
            required
            style={{ fontWeight: pinjamanId ? '600' : '400' }}
          >
            <option value="">-- Pilih Pinjaman --</option>
            {targetPinjaman.map(p => {
               const a = data.anggota.find(a => a.id === p.anggotaId);
               return (
                 <option key={p.id} value={p.id}>
                   {a?.nama} - Rp {Number(p.nominalPinjaman).toLocaleString('id-ID')}
                 </option>
               );
            })}
          </select>
        </div>
      </div>

      {/* Detail Angsuran Card */}
      {selectedPinjaman && (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px' }}>
              Angsuran Pinjaman - {ang?.nama}
            </h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Nominal: {fmtIDR(selectedPinjaman.nominalPinjaman)} | Jangka Waktu: {selectedPinjaman.tenorBulan} bulan
            </div>
          </div>
          
          <table className="data-table" style={{ width: '100%' }}>
            <thead style={{ background: '#1B365D', color: '#fff' }}>
              <tr>
                <th style={{ color: '#fff', padding: '12px 24px' }}>Ke</th>
                <th style={{ color: '#fff', padding: '12px 24px' }}>Jumlah</th>
                <th style={{ color: '#fff', padding: '12px 24px' }}>Jatuh Tempo</th>
                <th style={{ color: '#fff', padding: '12px 24px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {cicilanList.map((c) => (
                <tr key={c.ke}>
                  <td style={{ padding: '16px 24px' }}>{c.ke}</td>
                  <td style={{ padding: '16px 24px' }}>{fmtIDR(c.jumlah)}</td>
                  <td style={{ padding: '16px 24px' }}>{c.jatuhTempo}</td>
                  <td style={{ padding: '16px 24px' }}>
                    {c.status === 'sudah dibayar' ? (
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, 
                        background: '#d1fae5', color: '#065f46' 
                      }}>
                        sudah dibayar
                      </span>
                    ) : (
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, 
                        background: '#FEF3C7', color: '#92400E' 
                      }}>
                        belum dibayar
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: '20px 24px' }}>
            <button 
              className="btn btn-success" 
              style={{ background: '#22c55e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              onClick={handleBayar}
            >
              Bayar Angsuran
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
