import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export const GenericReport = ({ title, columns, dataList }) => {
  const exportToExcel = () => {
    const exportData = dataList.map((row, index) => {
      let obj = { 'No': index + 1 };
      columns.forEach(col => { obj[col.header] = row[col.key]; });
      return obj;
    });
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(workbook, `Laporan_${title.replace(/[^a-z0-9]/gi, '_')}.xlsx`);
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="page-title">{title}</h2>
        <button className="btn btn-success" onClick={exportToExcel} disabled={dataList.length === 0}>
          <FileSpreadsheet size={18} /> Export Excel
        </button>
      </div>
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                {columns.map((c, i) => <th key={i}>{c.header}</th>)}
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 ? dataList.map((row, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  {columns.map((c, i) => <td key={i}>{c.render ? c.render(row[c.key], row) : row[c.key]}</td>)}
                </tr>
              )) : (
                <tr>
                  <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    Tidak ada data
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
