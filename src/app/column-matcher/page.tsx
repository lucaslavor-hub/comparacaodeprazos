'use client';

import { useState } from 'react';
import { readExcelFile } from '@/lib/excelUtils';
import { FileUpload } from '@/components/FileUpload';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function ColumnMatcherPage() {
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

  const headers7 = data7 ? data7.headers[Object.keys(data7.sheets)[0]] : [];
  const headersSr = dataSr ? dataSr.headers[Object.keys(dataSr.sheets)[0]] : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 block">
          ← Voltar
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">🔄 Comparador de Colunas</h1>
        <p className="text-gray-600 mb-6">Carregue ambos os arquivos para identificar a coluna correta que contém o número do processo no Serur</p>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <FileUpload label="Arquivo Seven" onFileSelect={handleFile7Select} />
          </div>
          <div>
            <FileUpload label="Arquivo Serur" onFileSelect={handleFileSrSelect} />
          </div>
        </div>

        {data7 && dataSr && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seven Columns */}
            <Card className="border border-blue-300 overflow-hidden">
              <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
                <h2 className="text-sm font-semibold text-blue-900">
                  📄 SEVEN - Colunas ({headers7.length})
                </h2>
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {headers7.map((header: string, idx: number) => (
                  <div key={idx} className="text-xs text-blue-900 p-2 bg-blue-50 rounded border border-blue-200">
                    <span className="font-mono font-semibold text-blue-600">[{idx}]</span> 
                    <span className="ml-2">{header}</span>
                    {header.toLowerCase().includes('processo') && (
                      <span className="ml-2 text-green-600 font-bold">← PROCESSO?</span>
                    )}
                    {header.toLowerCase().includes('número') && (
                      <span className="ml-2 text-green-600 font-bold">← NÚMERO?</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Serur Columns */}
            <Card className="border border-orange-300 overflow-hidden">
              <div className="bg-orange-50 border-b border-orange-200 px-6 py-3">
                <h2 className="text-sm font-semibold text-orange-900">
                  📄 SERUR - Colunas ({headersSr.length})
                </h2>
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {headersSr.map((header: string, idx: number) => (
                  <div key={idx} className="text-xs text-orange-900 p-2 bg-orange-50 rounded border border-orange-200">
                    <span className="font-mono font-semibold text-orange-600">[{idx}]</span> 
                    <span className="ml-2">{header}</span>
                    {header.toLowerCase().includes('processo') && (
                      <span className="ml-2 text-green-600 font-bold">← PROCESSO?</span>
                    )}
                    {header.toLowerCase().includes('número') && (
                      <span className="ml-2 text-green-600 font-bold">← NÚMERO?</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {!(data7 && dataSr) && (
          <Card className="border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Carregue ambos os arquivos para comparar as estruturas</p>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8 border border-gray-300 p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">📋 O que fazer:</h3>
          <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
            <li>Procure pelas colunas que contêm o número do processo em ambos os arquivos</li>
            <li>Identifique o nome exato da coluna no Serur (pode ser diferente do Seven)</li>
            <li>Se encontrar diferenças, avise para que eu configure corretamente</li>
            <li>Exemplo: Seven tem "Número Processo", Serur pode ter apenas "Processo" ou outro nome</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
