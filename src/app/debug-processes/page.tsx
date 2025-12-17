'use client';

import { useState } from 'react';
import { readExcelFile, normalizeSevenData, extractProcessNumber } from '@/lib/excelUtils';
import { FileUpload } from '@/components/FileUpload';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function DebugProcessesPage() {
  const [data7, setData7] = useState<any>(null);
  const [dataSr, setDataSr] = useState<any>(null);

  const handleFile7Select = async (file: File | null) => {
    if (file) {
      try {
        const excelData = await readExcelFile(file);
        setData7(excelData);
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
      } catch (err) {
        console.error('Erro:', err);
      }
    } else {
      setDataSr(null);
    }
  };

  const sheetData7 = data7 ? (Object.values(data7.sheets)[0] as any[]) : null;
  const sheetDataSr = dataSr ? (Object.values(dataSr.sheets)[0] as any[]) : null;

  // Normalizar e extrair processos
  const processos7 = sheetData7
    ? normalizeSevenData(sheetData7).map((row) => ({
        processo_normalizado: row.processo_normalizado,
        numero_processo_original: row['Número Processo'],
        conteudo: String(row['Conteúdo'] || '').substring(0, 50),
        nome_encontrado: row['Nome Encontrado'],
      }))
    : [];

  const processosSr = sheetDataSr
    ? normalizeSevenData(sheetDataSr).map((row) => ({
        processo_normalizado: row.processo_normalizado,
        numero_processo_original: row['Número Processo'],
        conteudo: String(row['Conteúdo'] || '').substring(0, 50),
      }))
    : [];

  // Criar sets para fácil lookup
  const set7 = new Set(processos7.map((p) => p.processo_normalizado).filter(Boolean));
  const setSr = new Set(processosSr.map((p) => p.processo_normalizado).filter(Boolean));

  // Encontrar matches
  const matches = Array.from(set7).filter((p) => setSr.has(p));
  const only7 = Array.from(set7).filter((p) => !setSr.has(p));
  const onlySr = Array.from(setSr).filter((p) => !set7.has(p));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 block">
          ← Voltar
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">🔍 Debug - Extração de Processos</h1>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <FileUpload label="Arquivo Seven iPrazos" onFileSelect={handleFile7Select} />
          </div>
          <div>
            <FileUpload label="Arquivo Lig Contato" onFileSelect={handleFileSrSelect} />
          </div>
        </div>

        {data7 && dataSr && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border border-blue-200 bg-blue-50 p-4">
                <p className="text-xs text-blue-700 font-medium">Seven Total</p>
                <p className="text-2xl font-bold text-blue-900">{processos7.length}</p>
              </Card>
              <Card className="border border-orange-200 bg-orange-50 p-4">
                <p className="text-xs text-orange-700 font-medium">Lig Contato Total</p>
                <p className="text-2xl font-bold text-orange-900">{processosSr.length}</p>
              </Card>
              <Card className="border border-green-200 bg-green-50 p-4">
                <p className="text-xs text-green-700 font-medium">Matches</p>
                <p className="text-2xl font-bold text-green-900">{matches.length}</p>
              </Card>
              <Card className="border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-700 font-medium">Taxa</p>
                <p className="text-2xl font-bold text-gray-900">
                  {matches.length > 0 ? ((matches.length / processos7.length) * 100).toFixed(1) : 0}%
                </p>
              </Card>
            </div>

            {/* Matches Found */}
            {matches.length > 0 && (
              <Card className="border border-green-300 bg-green-50 p-4">
                <h2 className="text-sm font-semibold text-green-900 mb-3">✅ Processos Encontrados ({matches.length})</h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {matches.slice(0, 20).map((processo) => (
                    <div key={processo} className="text-xs font-mono text-green-800 p-2 bg-white rounded">
                      {processo}
                    </div>
                  ))}
                  {matches.length > 20 && (
                    <p className="text-xs text-green-700 italic">... e mais {matches.length - 20}</p>
                  )}
                </div>
              </Card>
            )}

            {/* Seven iPrazos Processes */}
            <Card className="border border-blue-300 overflow-hidden">
              <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
                <h2 className="text-sm font-semibold text-blue-900">
                  Processos SEVEN IPRAZOS ({processos7.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-blue-200 bg-blue-50">
                      <th className="px-4 py-2 text-left text-blue-700 font-semibold">Normalizado</th>
                      <th className="px-4 py-2 text-left text-blue-700 font-semibold">Original</th>
                      <th className="px-4 py-2 text-left text-blue-700 font-semibold">Nome Encontrado</th>
                      <th className="px-4 py-2 text-left text-blue-700 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processos7.map((row, idx) => {
                      const isMatch = row.processo_normalizado && set7.has(row.processo_normalizado) && setSr.has(row.processo_normalizado);
                      return (
                        <tr
                          key={idx}
                          className={`border-b border-blue-100 ${
                            isMatch ? 'bg-green-100' : row.processo_normalizado ? 'hover:bg-blue-50' : 'bg-red-50'
                          }`}
                        >
                          <td className="px-4 py-2 text-blue-900 font-mono">
                            {row.processo_normalizado || '❌ NULL'}
                          </td>
                          <td className="px-4 py-2 text-gray-700 max-w-xs truncate">
                            {row.numero_processo_original || '-'}
                          </td>
                          <td className="px-4 py-2 text-gray-700 max-w-xs truncate">
                            {row.nome_encontrado || '-'}
                          </td>
                          <td className="px-4 py-2 text-xs font-semibold">
                            {isMatch ? (
                              <span className="text-green-700">✅ MATCH</span>
                            ) : row.processo_normalizado ? (
                              <span className="text-blue-700">🔵 ONLY SEVEN</span>
                            ) : (
                              <span className="text-red-700">❌ ERROR</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Lig Contato Processes */}
            <Card className="border border-orange-300 overflow-hidden">
              <div className="bg-orange-50 border-b border-orange-200 px-6 py-3">
                <h2 className="text-sm font-semibold text-orange-900">
                  Processos LIG CONTATO ({processosSr.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-orange-200 bg-orange-50">
                      <th className="px-4 py-2 text-left text-orange-700 font-semibold">Normalizado</th>
                      <th className="px-4 py-2 text-left text-orange-700 font-semibold">Original</th>
                      <th className="px-4 py-2 text-left text-orange-700 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processosSr.map((row, idx) => {
                      const isMatch = row.processo_normalizado && setSr.has(row.processo_normalizado) && set7.has(row.processo_normalizado);
                      return (
                        <tr
                          key={idx}
                          className={`border-b border-orange-100 ${
                            isMatch ? 'bg-green-100' : row.processo_normalizado ? 'hover:bg-orange-50' : 'bg-red-50'
                          }`}
                        >
                          <td className="px-4 py-2 text-orange-900 font-mono">
                            {row.processo_normalizado || '❌ NULL'}
                          </td>
                          <td className="px-4 py-2 text-gray-700 max-w-xs truncate">
                            {row.numero_processo_original || '-'}
                          </td>
                          <td className="px-4 py-2 text-xs font-semibold">
                            {isMatch ? (
                              <span className="text-green-700">✅ MATCH</span>
                            ) : row.processo_normalizado ? (
                              <span className="text-orange-700">🟠 ONLY SERUR</span>
                            ) : (
                              <span className="text-red-700">❌ ERROR</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Analysis */}
            <Card className="border border-gray-300 p-4 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">📊 Análise</h2>
              <div className="space-y-2 text-xs text-gray-700">
                <p>✅ Processos com MATCH: <span className="font-semibold text-green-700">{matches.length}</span></p>
                <p>🔵 Apenas no Seven: <span className="font-semibold text-blue-700">{only7.length}</span></p>
                <p>🟠 Apenas no Serur: <span className="font-semibold text-orange-700">{onlySr.length}</span></p>
                <p>❌ Seven sem processo extraído: <span className="font-semibold text-red-700">
                  {processos7.filter((p) => !p.processo_normalizado).length}
                </span></p>
                <p>❌ Serur sem processo extraído: <span className="font-semibold text-red-700">
                  {processosSr.filter((p) => !p.processo_normalizado).length}
                </span></p>
              </div>
            </Card>
          </div>
        )}

        {!(data7 && dataSr) && (
          <Card className="border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Carregue ambos os arquivos para ver a análise de processos</p>
          </Card>
        )}
      </div>
    </div>
  );
}
