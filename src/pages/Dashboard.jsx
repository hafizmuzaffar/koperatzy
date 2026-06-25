import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Users, Landmark, Calendar, TrendingUp } from 'lucide-react';
import './Dashboard.css';

export const Dashboard = () => {
  const { data } = useContext(AppContext);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Calculate stats based on date
  const stats = useMemo(() => {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    eDate.setHours(23, 59, 59, 999);

    const filteredAnggota = data.anggota.filter(a => {
      const d = new Date(a.tglMasuk || Date.now());
      return d >= sDate && d <= eDate;
    });

    const filteredPinjaman = data.transaksiPinjaman.filter(t => {
      const d = new Date(t.tgl);
      return t.jenis === 'Pencairan' && d >= sDate && d <= eDate;
    });

    const totalPembiayaan = filteredPinjaman.reduce((sum, p) => sum + Number(p.nominal), 0);

    const uniqueMembersWithPencairan = new Set(
      filteredPinjaman.map(t => {
         const pinjaman = data.pinjaman.find(p => p.id === t.pinjamanId);
         return pinjaman ? pinjaman.anggotaId : null;
      }).filter(Boolean)
    ).size;

    return {
      jmlAnggotaBaru: filteredAnggota.length,
      jmlAnggotaPencairan: uniqueMembersWithPencairan,
      totalAnggotaAktif: data.anggota.filter(a => a.status === 'Aktif').length,
      jmlPembiayaan: totalPembiayaan,
      trxCount: filteredPinjaman.length
    };
  }, [data, startDate, endDate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="page-content">
      <div className="dashboard-header-block glass">
        <div>
          <h2 className="page-title" style={{ color: 'black' }}>Dashboard</h2>
          <p className="opacity-80" style={{ color: 'var(--text-main)' }}>Ringkasan performa Koperasi Lumbung Artha Sejahtera.</p>
        </div>
        
        <div className="date-filter">
          <div className="filter-group">
            <Calendar size={18} style={{ color: 'var(--text-main)' }} />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="date-input" />
          </div>
          <span style={{ color: 'var(--text-main)' }}>s/d</span>
          <div className="filter-group">
            <Calendar size={18} style={{ color: 'var(--text-main)' }} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="date-input" />
          </div>
        </div>
      </div>

      <div className="grid-4 mt-4">
        <div className="stat-card">
          <div className="stat-icon bg-primary-light text-white"><Users size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Total Anggota Aktif</p>
            <h3 className="stat-value">{stats.totalAnggotaAktif}</h3>
            <p className="stat-desc text-success">+{stats.jmlAnggotaBaru} di rentang tanggal ini</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-accent text-primary-dark"><Landmark size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Total Pembiayaan (Pencairan)</p>
            <h3 className="stat-value">{formatCurrency(stats.jmlPembiayaan)}</h3>
            <p className="stat-desc">{stats.trxCount} transaksi di rentang tanggal ini</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#8E44AD', color: 'white' }}><Users size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Anggota Cairkan Pinjaman</p>
            <h3 className="stat-value">{stats.jmlAnggotaPencairan} <span style={{fontSize:'0.9rem', fontWeight:'normal'}}>Orang</span></h3>
            <p className="stat-desc">Di rentang tanggal ini</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-success text-white"><TrendingUp size={24} /></div>
          <div className="stat-content">
            <p className="stat-label">Status Kas</p>
            <h3 className="stat-value">Aman</h3>
            <p className="stat-desc">Sistem berjalan optimal</p>
          </div>
        </div>
      </div>
    </div>
  );
};
