import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Save, CheckCircle } from 'lucide-react';

const formatRibuan = (val) => {
  if (!val) return '';
  const num = val.toString().replace(/[^0-9]/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const parseRibuan = (val) => {
  if (!val) return '';
  return val.toString().replace(/[^0-9]/g, '');
};

const INITIAL_FORM = {
  nama: '',
  alamat: '',
  jenisKelamin: 'L',
  tglMasuk: new Date().toISOString().split('T')[0],
  sbu: 'MAB',
  simpananPokok: 0,
  simpananWajib: 0
};

export const RegistrasiAnggota = () => {
  const { addAnggota } = useContext(AppContext);
  
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAnggota(formData);
    setFormData(INITIAL_FORM);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="page-content">
      <h2 className="page-title mb-4">Registrasi Anggota Baru</h2>
      
      {showSuccess && (
        <div className="alert-success">
          <CheckCircle size={20} />
          <span>Anggota berhasil didaftarkan! Formulir telah dikosongkan, Anda bisa mendaftarkan anggota baru.</span>
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
                type="text" 
                name="simpananPokok"
                className="form-control" 
                value={formatRibuan(formData.simpananPokok)}
                onChange={(e) => setFormData({ ...formData, simpananPokok: parseRibuan(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Simpanan Wajib Awal</label>
              <input 
                type="text" 
                name="simpananWajib"
                className="form-control" 
                value={formatRibuan(formData.simpananWajib)}
                onChange={(e) => setFormData({ ...formData, simpananWajib: parseRibuan(e.target.value) })}
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
