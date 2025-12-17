'use client';

import { useState } from 'react';
import { readExcelFile } from '@/lib/excelUtils';
import { FileUpload } from '@/components/FileUpload';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function DebugPage() {
  const [data, setData] = useState<any>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>('');

  const handleFileSelect = async (file: File | null) => {
    if (file) {
      try {
        const excelData = await readExcelFile(file);
        setData(excelData);
        const firstSheet = Object.keys(excelData.sheets)[0];
        setSelectedSheet(firstSheet);
      } catch (err) {
        console.error('Erro:', err);
      }
    } else {
      setData(null);
    }
  };

  const sheetData = data && selectedSheet ? data.sheets[selectedSheet] : null;
  const headers = data && selectedSheet ? data.headers[selectedSheet] : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 block">
          ← Voltar
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">🔍 Debug - Visualizar Dados do Excel</h1>

        <div className="mb-8 max-w-xl">
          <FileUpload label="Carregue seu arquivo Seven" onFileSelect={handleFileSelect} />
        </div>

        {data && (
          <div className="space-y-6">
            {/* Sheet Selector */}
            <Card className="border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Abas disponíveis:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(data.sheets).map((sheetName) => (
                  <button
                    key={sheetName}
                    onClick={() => setSelectedSheet(sheetName)}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      selectedSheet === sheetName
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {sheetName}
                  </button>
                ))}
              </div>
            </Card>

            {/* Headers */}
            <Card className="border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Colunas encontradas:</p>
              <div className="space-y-2">
                {headers.map((header: string, idx: number) => (
                  <div key={idx} className="text-xs text-gray-700 p-2 bg-gray-50 rounded">
                    <span className="font-mono font-semibold">[{idx}]</span> {header}
                  </div>
                ))}
              </div>
            </Card>

            {/* Raw Data */}
            <Card className="border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  Dados Brutos ({sheetData?.length} linhas)
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {headers.map((header: string) => (
                        <th
                          key={header}
                          className="px-4 py-2 text-left text-gray-700 font-semibold whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheetData?.slice(0, 20).map((row: any, rowIdx: number) => (
                      <tr key={rowIdx} className="border-b border-gray-100 hover:bg-blue-50">
                        {headers.map((header: string) => (
                          <td
                            key={`${rowIdx}-${header}`}
                            className="px-4 py-2 text-gray-700 max-w-xs truncate"
                            title={String(row[header] || '')}
                          >
                            {row[header] !== undefined && row[header] !== null
                              ? String(row[header]).substring(0, 100)
                              : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sheetData && sheetData.length > 20 && (
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-xs text-gray-600">
                  Mostrando 20 de {sheetData.length} linhas
                </div>
              )}
            </Card>

            {/* JSON Raw Data */}
            <Card className="border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">JSON (primeira linha):</p>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(sheetData?.[0], null, 2)}
              </pre>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
