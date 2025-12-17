'use client';

import { useState } from 'react';
import { readExcelFile } from '@/lib/excelUtils';
import { FileUpload } from '@/components/FileUpload';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function DebugViewerPage() {
  const [data7, setData7] = useState<any>(null);
  const [dataSr, setDataSr] = useState<any>(null);
  const [selectedSheet7, setSelectedSheet7] = useState<string>('');
  const [selectedSheetSr, setSelectedSheetSr] = useState<string>('');

  const handleFile7Select = async (file: File | null) => {
    if (file) {
      try {
        const excelData = await readExcelFile(file);
        setData7(excelData);
        const firstSheet = Object.keys(excelData.sheets)[0];
        setSelectedSheet7(firstSheet);
      } catch (err) {
        console.error('Erro:', err);
      }
    } else {
      setData7(null);
    }
  };

  const handleFileSrSelect = async (file: File | null) => {
    if (file) {
      try {
        const excelData = await readExcelFile(file);
        setDataSr(excelData);
        const firstSheet = Object.keys(excelData.sheets)[0];
        setSelectedSheetSr(firstSheet);
      } catch (err) {
        console.error('Erro:', err);
      }
    } else {
      setDataSr(null);
    }
  };

  const sheetData7 = data7 && selectedSheet7 ? data7.sheets[selectedSheet7] : null;
  const headers7 = data7 && selectedSheet7 ? data7.headers[selectedSheet7] : [];

  const sheetDataSr = dataSr && selectedSheetSr ? dataSr.sheets[selectedSheetSr] : null;
  const headersSr = dataSr && selectedSheetSr ? dataSr.headers[selectedSheetSr] : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 block">
          ← Voltar
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">📊 Visualizar Dados - Seven iPrazos vs Lig Contato</h1>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <FileUpload label="Carregue arquivo Seven iPrazos" onFileSelect={handleFile7Select} />
          </div>
          <div>
            <FileUpload label="Carregue arquivo Lig Contato" onFileSelect={handleFileSrSelect} />
          </div>
        </div>

        {/* Seven Data */}
        {data7 && (
          <div className="mb-12 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">📄 SEVEN IPRAZOS - Estrutura</h2>

            {/* Sheet Selector */}
            <Card className="border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Abas disponíveis:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(data7.sheets).map((sheetName) => (
                  <button
                    key={sheetName}
                    onClick={() => setSelectedSheet7(sheetName)}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      selectedSheet7 === sheetName
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
            <Card className="border border-blue-200 p-4 bg-blue-50">
              <p className="text-sm font-semibold text-blue-900 mb-3">✅ Colunas encontradas ({headers7.length}):</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {headers7.map((header: string, idx: number) => (
                  <div key={idx} className="text-xs text-blue-900 p-2 bg-white rounded border border-blue-200">
                    <span className="font-mono font-semibold text-blue-600">[{idx}]</span> {header}
                  </div>
                ))}
              </div>
            </Card>

            {/* Raw Data */}
            <Card className="border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  Dados Brutos ({sheetData7?.length} linhas)
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {headers7.map((header: string) => (
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
                    {sheetData7?.slice(0, 5).map((row: any, rowIdx: number) => (
                      <tr key={rowIdx} className="border-b border-gray-100 hover:bg-blue-50">
                        {headers7.map((header: string) => (
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

              {sheetData7 && sheetData7.length > 5 && (
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-xs text-gray-600">
                  Mostrando 5 de {sheetData7.length} linhas
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Lig Contato Data */}
        {dataSr && (
          <div className="mb-12 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">📄 LIG CONTATO - Estrutura</h2>

            {/* Sheet Selector */}
            <Card className="border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Abas disponíveis:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(dataSr.sheets).map((sheetName) => (
                  <button
                    key={sheetName}
                    onClick={() => setSelectedSheetSr(sheetName)}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      selectedSheetSr === sheetName
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {sheetName}
                  </button>
                ))}
              </div>
            </Card>

            {/* Headers */}
            <Card className="border border-orange-200 p-4 bg-orange-50">
              <p className="text-sm font-semibold text-orange-900 mb-3">✅ Colunas encontradas ({headersSr.length}):</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {headersSr.map((header: string, idx: number) => (
                  <div key={idx} className="text-xs text-orange-900 p-2 bg-white rounded border border-orange-200">
                    <span className="font-mono font-semibold text-orange-600">[{idx}]</span> {header}
                  </div>
                ))}
              </div>
            </Card>

            {/* Raw Data */}
            <Card className="border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  Dados Brutos ({sheetDataSr?.length} linhas)
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {headersSr.map((header: string) => (
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
                    {sheetDataSr?.slice(0, 5).map((row: any, rowIdx: number) => (
                      <tr key={rowIdx} className="border-b border-gray-100 hover:bg-orange-50">
                        {headersSr.map((header: string) => (
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

              {sheetDataSr && sheetDataSr.length > 5 && (
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-xs text-gray-600">
                  Mostrando 5 de {sheetDataSr.length} linhas
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!data7 && !dataSr && (
          <Card className="border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Carregue os arquivos acima para visualizar a estrutura de dados</p>
          </Card>
        )}
      </div>
    </div>
  );
}
