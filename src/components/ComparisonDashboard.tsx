'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FileUpload } from '@/components/FileUpload';
import { ComparisonTable } from '@/components/ComparisonTable';
import { FilterNomeMulti } from '@/components/FilterNomeMulti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  readExcelFile,
  ExcelData,
  compareExcels,
  getNomeEncontradoOptions,
  filterSevenByNome,
  validateExcelColumns,
  ComparisonResult,
  exportResultsToExcel,
} from '@/lib/excelUtils';
import { AlertCircle, Loader2, Download } from 'lucide-react';

export function ComparisonDashboard() {
  const [file7, setFile7] = useState<File | null>(null);
  const [fileSr, setFileSr] = useState<File | null>(null);
  const [data7, setData7] = useState<ExcelData | null>(null);
  const [dataSr, setDataSr] = useState<ExcelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSeven, setLoadingSeven] = useState(false);
  const [error, setError] = useState<string>('');
  const [nomeFilter, setNomeFilter] = useState<string[]>([]);
  const [results, setResults] = useState<ComparisonResult[] | null>(null);
  const [nomeOptions, setNomeOptions] = useState<string[]>([]);

  const handleFile7Select = async (file: File | null) => {
    setFile7(file);
    setResults(null);
    setNomeFilter([]);
    if (file) {
      await loadFile(file, setData7, true);
    } else {
      setData7(null);
      setNomeOptions([]);
    }
  };

  const handleFileSrSelect = async (file: File | null) => {
    setFileSr(file);
    setResults(null);
    if (file) {
      await loadFile(file, setDataSr, false);
    } else {
      setDataSr(null);
    }
  };

  const loadFile = async (file: File, setData: (data: ExcelData | null) => void, isSeven: boolean) => {
    try {
      if (isSeven) {
        setLoadingSeven(true);
      } else {
        setLoading(true);
      }
      setError('');
      const excelData = await readExcelFile(file);
      
      // Validar colunas esperadas
      const firstSheet = Object.keys(excelData.sheets)[0];
      const headers = excelData.headers[firstSheet] || [];
      
      const requiredColumns = isSeven
        ? ['Número Processo', 'Conteúdo', 'Nome Encontrado']
        : ['Número do Processo'];
      
      const validation = validateExcelColumns(headers, requiredColumns);
      
      if (!validation.valid) {
        const fileType = isSeven ? 'Seven iPrazos (relatório)' : 'Lig Contato';
        setError(`❌ Arquivo ${fileType} inválido. Colunas faltando: ${validation.missingColumns.join(', ')}`);
        setData(null);
        return;
      }
      
      setData(excelData);

      if (isSeven) {
        const firstSheetData = Object.values(excelData.sheets)[0] || [];
        const options = getNomeEncontradoOptions(firstSheetData);
        setNomeOptions(options);
      }
    } catch (err) {
      setError(`❌ Erro ao carregar arquivo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      setData(null);
    } finally {
      if (isSeven) {
        setLoadingSeven(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleCompare = () => {
    if (!data7 || !dataSr) {
      setError('Carregue ambos os arquivos');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const seven7Sheet = Object.values(data7.sheets)[0] || [];
      const srSheet = Object.values(dataSr.sheets)[0] || [];

      const filtered7 = filterSevenByNome(seven7Sheet, nomeFilter);
      
      if (filtered7.length === 0 && nomeFilter.length > 0) {
        setError(`Nenhum processo encontrado para os nomes selecionados`);
        setResults([]);
        setLoading(false);
        return;
      }

      let comparisonResults = compareExcels(filtered7, srSheet);

      // Se há filtro ativo, remover resultados ONLY_SERUR
      // (processos que estão apenas no Serur não têm "Nome Encontrado")
      if (nomeFilter) {
        comparisonResults = comparisonResults.filter(
          (result) => result.status !== 'ONLY_SERUR'
        );
      }

      setResults(comparisonResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na comparação');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.svg"
                alt="Lig Contato"
                width={120}
                height={40}
                priority
                className="h-10 w-auto"
              />
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">Publicações</h1>
                <p className="text-sm text-gray-600">Sistema de Comparação de Prazos</p>
              </div>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Serur</p>
              <p className="font-medium text-gray-700">Advogados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-300 bg-red-50 p-4">
            <div className="flex items-center gap-3 text-red-900">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </Card>
        )}

        {/* File Upload Section */}
        <div className="mb-10">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">1. Carregue os arquivos</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FileUpload label="Seven iPrazos (relatório)" onFileSelect={handleFile7Select} selectedFile={file7} loading={loadingSeven} />
            <FileUpload label="Lig Contato" onFileSelect={handleFileSrSelect} selectedFile={fileSr} loading={loading} />
          </div>
        </div>

        {/* Filter Section */}
        {data7 && nomeOptions.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">2. Filtrar dados</h2>
            <FilterNomeMulti options={nomeOptions} value={nomeFilter} onChange={setNomeFilter} />
          </div>
        )}

        {/* Compare Button */}
        {data7 && dataSr && (
          <div className="mb-10">
            <Button
              onClick={handleCompare}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Comparando...
                </>
              ) : (
                '3. Comparar dados'
              )}
            </Button>
          </div>
        )}
        {/* Results Section */}
        {results && (
          <ComparisonTable 
            results={results}
            sevenTotal={data7 ? (Object.values(data7.sheets)[0] as any[]).length : 0}
            serurTotal={dataSr ? (Object.values(dataSr.sheets)[0] as any[]).length : 0}
            sevenFilteredTotal={nomeFilter && data7 ? filterSevenByNome(Object.values(data7.sheets)[0] as any[], nomeFilter).length : 0}
          />
        )}

        {/* Export Button */}
        {results && results.length > 0 && (
          <div className="mb-10 flex justify-end">
            <Button
              onClick={() => exportResultsToExcel(results, `comparacao-${new Date().toISOString().split('T')[0]}.xlsx`)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar para Excel
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!data7 && !dataSr && !loading && (
          <Card className="border border-gray-200 shadow-sm p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">Nenhum arquivo carregado</h3>
              <p className="text-xs text-gray-600">Comece carregando seus arquivos acima</p>
            </div>
          </Card>
        )}
      </div>

      {/* Footer Links */}
      <div className="border-t border-gray-200 bg-white py-6 mt-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              <p>© 2025 Serur Advogados. Todos os direitos reservados.</p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="/tutorial" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                📖 Tutorial
              </a>
              <a href="/debug-viewer" className="text-gray-600 hover:text-gray-700 hover:underline transition-colors">
                🔍 Visualizar
              </a>
              <a href="/debug-processes" className="text-gray-600 hover:text-gray-700 hover:underline transition-colors">
                🔎 Debug
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
