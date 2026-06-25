import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Save, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RegistrasiAnggota = () => {
  const { addAnggota } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    jenisKelamin: 'L',
    tglMasuk: new Date().toISOString().split('T')[0],
    sbu: 'MAB',
    simpananPokok: 0,
    simpananWajib: 0
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAnggota(formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/anggota/laporan/profil');
    }, 2000);
  };

  return (
    <div className="page-content">
      <h2 className="page-title mb-4">Registrasi Anggota Baru</h2>
      
      {showSuccess && (
        <div className="alert-success">
          <CheckCircle size={20} />
          <span>Anggota berhasil didaftarkan! Mengalihkan ke halaman profil...</span>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input 
                type="text" 
                name="nama"
                className="form-control" 
                value={formData.nama}
                onChange={handleChange}
                required 
                placeholder="Masukkan nama lengkap"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Tanggal Masuk</label>
              <input 
                type="date" 
                name="tglMasuk"
                className="form-control" 
                value={formData.tglMasuk}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Alamat Lengkap</label>
              <textarea 
                name="alamat"
                className="form-control" 
                value={formData.alamat}
                onChange={handleChange}
                required 
                rows="3"
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jenis Kelamin</label>
              <select 
                name="jenisKelamin"
                className="form-control" 
                value={formData.jenisKelamin}
                onChange={handleChange}
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">SBU (Strategic Business Unit)</label>
              <select 
                name="sbu"
                className="form-control" 
                value={formData.sbu}
                onChange={handleChange}
              >
                <option value="MAB">MAB</option>
                <option value="HLJ">HLJ</option>
                <option value="NPA">NPA</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Simpanan Pokok Awal</label>
              <input 
                type="number" 
                name="simpananPokok"
                className="form-control" 
                value={formData.simpananPokok}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Simpanan Wajib Awal</label>
              <input 
                type="number" 
                name="simpananWajib"
                className="form-control" 
                value={formData.simpananWajib}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-actions mt-4">
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Simpan Data Anggota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
