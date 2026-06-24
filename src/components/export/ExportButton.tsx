'use client';
import React from 'react';
import { useMBA } from '@/context/MBAContext';
import { exportAllToExcel } from '@/lib/export/exportToExcel';

export default function ExportButton() {
  const { state } = useMBA();

  const handleExport = () => {
    try {
      exportAllToExcel(state);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-3 py-1.5 text-base font-medium rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5"
    >
      <span>📥</span> Export XLSX
    </button>
  );
}
