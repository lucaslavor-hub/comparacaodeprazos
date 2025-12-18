'use client';

import React, { useState } from 'react';
import { ComparisonResult } from '@/lib/excelUtils';
import { formatDate } from '@/lib/excelUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ContentModal } from '@/components/ContentModal';

// Helper para acessar coluna com fallback
function getCol(row: any, name: string): any {
  if (!row) return undefined;
  
  if (row && row.hasOwnProperty(name)) {
    return row[name];
  }
  // Tenta encontrar normalizado
  const normalized = String(name).trim().toLowerCase();
  for (const key in row || {}) {
    if (String(key).trim().toLowerCase() === normalized) {
      return row[key];
    }
  }
  
  // Se procura por "Conteúdo", tenta variações
  if (normalized === 'conteúdo') {
    for (const key in row || {}) {
      const keyLower = String(key).trim().toLowerCase();
      if (keyLower.includes('conteúdo') || keyLower.includes('conteudo')) {
        return row[key];
      }
    }
  }
  
  return undefined;
}

interface ComparisonTableProps {
  results: ComparisonResult[];
  sevenTotal?: number;
  serurTotal?: number;
  sevenFilteredTotal?: number;
}

export function ComparisonTable({ results, sevenTotal = 0, serurTotal = 0, sevenFilteredTotal = 0 }: ComparisonTableProps) {
  const [filters, setFilters] = useState({
    status: '',
    processo: '',
    nomeEncontrado: '',
    cliente: '',
    uf: '',
    statusPub: '',
    noSerur: '',
  });

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Verificar se há duplicatas
  const hasDuplicates = results.some(r => r.isDuplicate);
  const duplicatesCount = results.filter(r => r.isDuplicate).length;

  // Função para extrair opções únicas
  const getUniqueOptions = (key: string): string[] => {
    const options = new Set<string>();
    results.forEach((result) => {
      const sevenRow = result.sevenRows[0];
      const serurRow = result.serurRow;
      let value = '';
      switch (key) {
        case 'status':
          value = result.status;
          break;
        case 'nomeEncontrado':
          value = String(getCol(sevenRow, 'Nome Encontrado') || '').trim();
          break;
        case 'cliente':
          value = String(getCol(sevenRow, 'Cliente') || '').trim();
          break;
        case 'uf':
          value = String(getCol(sevenRow, 'UF') || getCol(serurRow, 'UF') || '').trim();
          break;
        case 'statusPub':
          value = String(getCol(sevenRow, 'Status Publicação') || '').trim();
          break;
        case 'noSerur':
          value = serurRow ? 'Sim' : 'Não';
          break;
      }
      if (value && value !== '-') options.add(value);
    });
    return Array.from(options).sort();
  };

  if (results.length === 0) {
    return (
      <Card className="border border-orange-300 bg-orange-50 p-6">
        <p className="text-orange-900 font-medium">⚠️ Nenhum processo encontrado para esta comparação</p>
      </Card>
    );
  }

  // Aplicar filtros
  const filteredResults = results.filter((result) => {
    const sevenRow = result.sevenRows[0];
    const serurRow = result.serurRow;

    if (filters.status && !result.status.toLowerCase().includes(filters.status.toLowerCase())) return false;
    if (filters.processo && !result.processo.toLowerCase().includes(filters.processo.toLowerCase())) return false;
    if (filters.nomeEncontrado && !String(getCol(sevenRow, 'Nome Encontrado') || '').toLowerCase().includes(filters.nomeEncontrado.toLowerCase())) return false;
    if (filters.cliente && !String(getCol(sevenRow, 'Cliente') || '').toLowerCase().includes(filters.cliente.toLowerCase())) return false;
    if (filters.uf && !String(getCol(sevenRow, 'UF') || getCol(serurRow, 'UF') || '').toLowerCase().includes(filters.uf.toLowerCase())) return false;
    if (filters.statusPub && !String(getCol(sevenRow, 'Status Publicação') || '').toLowerCase().includes(filters.statusPub.toLowerCase())) return false;
    if (filters.noSerur) {
      const hasSerur = serurRow ? 'sim' : 'não';
      if (!hasSerur.includes(filters.noSerur.toLowerCase())) return false;
    }

    return true;
  });

  // Stats baseado em filtros
  const stats = {
    total: filteredResults.length,
    matches: filteredResults.filter((r) => r.status === 'MATCH').length,
    onlySeven: filteredResults.filter((r) => r.status === 'ONLY_SEVEN').length,
    onlySerur: filteredResults.filter((r) => r.status === 'ONLY_SERUR').length,
  };

  // Aplicar ordenação
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (!sortConfig) return 0;

    let aVal: any = '';
    let bVal: any = '';
    const aSevenRow = a.sevenRows[0];
    const bSevenRow = b.sevenRows[0];
    const aSerurRow = a.serurRow;
    const bSerurRow = b.serurRow;

    switch (sortConfig.key) {
      case 'status':
        aVal = a.status;
        bVal = b.status;
        break;
      case 'processo':
        aVal = a.processo;
        bVal = b.processo;
        break;
      case 'dataDiario':
        aVal = new Date(aSevenRow ? aSevenRow['Data Diário'] : 0).getTime();
        bVal = new Date(bSevenRow ? bSevenRow['Data Diário'] : 0).getTime();
        break;
      case 'nomeEncontrado':
        aVal = String(getCol(aSevenRow, 'Nome Encontrado') || '');
        bVal = String(getCol(bSevenRow, 'Nome Encontrado') || '');
        break;
      case 'cliente':
        aVal = String(getCol(aSevenRow, 'Cliente') || '');
        bVal = String(getCol(bSevenRow, 'Cliente') || '');
        break;
      case 'uf':
        aVal = String(getCol(aSevenRow, 'UF') || getCol(aSerurRow, 'UF') || '');
        bVal = String(getCol(bSevenRow, 'UF') || getCol(bSerurRow, 'UF') || '');
        break;
      case 'statusPub':
        aVal = String(getCol(aSevenRow, 'Status Publicação') || '');
        bVal = String(getCol(bSevenRow, 'Status Publicação') || '');
        break;
      case 'noSerur':
        aVal = aSerurRow ? 1 : 0;
        bVal = bSerurRow ? 1 : 0;
        break;
      default:
        return 0;
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const SortHeader = ({ label, sortKey }: { label: string; sortKey: string }) => {
    const isActive = sortConfig?.key === sortKey;
    return (
      <button
        onClick={() => handleSort(sortKey)}
        className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition"
      >
        <span>{label}</span>
        {isActive ? (
          sortConfig?.direction === 'asc' ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <div className="h-3 w-3 opacity-30">
            <ArrowUp className="h-3 w-3" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Duplicate Alert */}
      {hasDuplicates && (
        <Card className="border border-yellow-300 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">⚠️ Duplicados detectados</p>
              <p className="text-xs text-yellow-800 mt-1">
                {duplicatesCount} registro(s) com campos duplicados (Processo, Nome Encontrado, Cliente ou UF). Veja a coluna "Duplicado" para detalhes.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200 p-4">
          <p className="text-xs text-gray-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </Card>
        <Card className="border border-green-200 bg-green-50 p-4">
          <p className="text-xs text-green-700 font-medium">Correspondências</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.matches}</p>
        </Card>
        <Card className="border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs text-blue-700 font-medium">Só no Seven</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{stats.onlySeven}</p>
        </Card>
        <Card className="border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs text-orange-700 font-medium">Só no Lig Contato</p>
          <p className="text-2xl font-bold text-orange-700 mt-1">{stats.onlySerur}</p>
        </Card>
        {(sevenFilteredTotal > 0 || sevenTotal > 0) && (
          <Card className="border border-purple-200 bg-purple-50 p-4">
            <p className="text-xs text-purple-700 font-medium">Seven Total</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{sevenFilteredTotal > 0 ? sevenFilteredTotal : sevenTotal}</p>
          </Card>
        )}
        {serurTotal > 0 && (
          <Card className="border border-indigo-200 bg-indigo-50 p-4">
            <p className="text-xs text-indigo-700 font-medium">Lig Contato Total</p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">{serurTotal}</p>
          </Card>
        )}
      </div>

      {/* Results Table */}
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {/* Filter Row */}
          <div className="bg-gray-100 border-b border-gray-200 p-3">
            <div className="grid grid-cols-4 md:grid-cols-10 gap-2">
              {/* Status - SELECT */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="text-xs h-8 border border-gray-300 rounded px-2 bg-white"
              >
                <option value="">Todos</option>
                {getUniqueOptions('status').map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {/* Processo - INPUT */}
              <Input
                placeholder="Processo..."
                value={filters.processo}
                onChange={(e) => setFilters({ ...filters, processo: e.target.value })}
                className="text-xs h-8"
              />
              {/* Nome Encontrado - SELECT */}
              <select
                value={filters.nomeEncontrado}
                onChange={(e) => setFilters({ ...filters, nomeEncontrado: e.target.value })}
                className="text-xs h-8 border border-gray-300 rounded px-2 bg-white"
              >
                <option value="">Todos</option>
                {getUniqueOptions('nomeEncontrado').map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {/* Cliente - SELECT */}
              <select
                value={filters.cliente}
                onChange={(e) => setFilters({ ...filters, cliente: e.target.value })}
                className="text-xs h-8 border border-gray-300 rounded px-2 bg-white"
              >
                <option value="">Todos</option>
                {getUniqueOptions('cliente').map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {/* UF - SELECT */}
              <select
                value={filters.uf}
                onChange={(e) => setFilters({ ...filters, uf: e.target.value })}
                className="text-xs h-8 border border-gray-300 rounded px-2 bg-white"
              >
                <option value="">Todos</option>
                {getUniqueOptions('uf').map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {/* Status Pub - SELECT */}
              <select
                value={filters.statusPub}
                onChange={(e) => setFilters({ ...filters, statusPub: e.target.value })}
                className="text-xs h-8 border border-gray-300 rounded px-2 bg-white"
              >
                <option value="">Todos</option>
                {getUniqueOptions('statusPub').map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {/* No Lig Contato - SELECT */}
              <select
                value={filters.noSerur}
                onChange={(e) => setFilters({ ...filters, noSerur: e.target.value })}
                className="text-xs h-8 border border-gray-300 rounded px-2 bg-white"
              >
                <option value="">Todos</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
              <button
                onClick={() => setFilters({
                  status: '',
                  processo: '',
                  nomeEncontrado: '',
                  cliente: '',
                  uf: '',
                  statusPub: '',
                  noSerur: '',
                })}
                className="text-xs px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded font-semibold"
              >
                Limpar
              </button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50">
                <TableHead className="text-xs font-semibold text-gray-700"><SortHeader label="Status" sortKey="status" /></TableHead>
                <TableHead className="text-xs font-semibold text-gray-700"><SortHeader label="Processo" sortKey="processo" /></TableHead>
                <TableHead className="text-xs font-semibold text-gray-700"><SortHeader label="Data Diário" sortKey="dataDiario" /></TableHead>
                <TableHead className="text-xs font-semibold text-gray-700"><SortHeader label="Nome Encontrado" sortKey="nomeEncontrado" /></TableHead>
                <TableHead className="text-xs font-semibold text-gray-700"><SortHeader label="Cliente" sortKey="cliente" /></TableHead>
                <TableHead className="text-xs font-semibold text-gray-700"><SortHeader label="UF" sortKey="uf" /></TableHead>
                <TableHead className="text-xs font-semibold text-gray-700"><SortHeader label="Status Pub." sortKey="statusPub" /></TableHead>
                <TableHead className="text-xs font-semibold text-gray-700"><SortHeader label="Conteúdo" sortKey="conteudo" /></TableHead>
                <TableHead className="text-xs font-semibold text-gray-700"><SortHeader label="No Lig Contato?" sortKey="noSerur" /></TableHead>
                <TableHead className="text-xs font-semibold text-gray-700">Duplicado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((result, idx) => {
                const sevenRow = result.sevenRows[0];
                const serurRows = result.serurRows || [];
                
                // Se há múltiplos Serur rows, mostrar um por linha
                if (result.isDuplicate && serurRows.length > 1) {
                  return (
                    <React.Fragment key={idx}>
                      {serurRows.map((eachSerurRow, serurIdx) => (
                        <TableRow 
                          key={`${idx}-${serurIdx}`} 
                          className={`border-b border-gray-100 hover:bg-yellow-50 ${
                            result.isDuplicate ? 'bg-yellow-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <TableCell className="text-xs py-2.5">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                result.status === 'MATCH'
                                  ? 'bg-green-100 text-green-700'
                                  : result.status === 'ONLY_SEVEN'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {result.status === 'MATCH'
                                ? 'Correspondência'
                                : result.status === 'ONLY_SEVEN'
                                  ? 'Só Seven'
                                  : 'Só Serur'}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs font-mono text-gray-900 py-2.5">
                            {result.processo}
                          </TableCell>
                          <TableCell className="text-xs text-gray-700 py-2.5">
                            {sevenRow ? formatDate(getCol(sevenRow, 'Data Diário')) : '-'}
                          </TableCell>
                          <TableCell className="text-xs text-gray-700 py-2.5 max-w-xs">
                            <div title={getCol(sevenRow, 'Nome Encontrado') || ''} className="truncate">
                              {getCol(sevenRow, 'Nome Encontrado') || '-'}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-gray-700 py-2.5 max-w-[120px]">
                            <div title={getCol(sevenRow, 'Cliente') || ''} className="truncate">
                              {getCol(sevenRow, 'Cliente') || '-'}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-gray-700 py-2.5">
                            {getCol(sevenRow, 'UF') || getCol(eachSerurRow, 'UF') || '-'}
                          </TableCell>
                          <TableCell className="text-xs text-gray-700 py-2.5">
                            {getCol(sevenRow, 'Status Publicação') ? (
                              <span title={String(getCol(sevenRow, 'Status Publicação'))} className="truncate inline-block max-w-xs">
                                {String(getCol(sevenRow, 'Status Publicação')).substring(0, 20)}
                              </span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-gray-700 py-2.5 max-w-xs">
                            <ContentModal 
                              content={String(getCol(eachSerurRow, 'Conteúdo') || '').trim()} 
                              debugInfo={`Colunas disponíveis: ${eachSerurRow ? Object.keys(eachSerurRow).join(', ') : 'nenhuma'}`}
                              trigger={
                                <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                                  Ver conteúdo
                                </span>
                              } 
                            />
                          </TableCell>
                          <TableCell className="text-xs py-2.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                {serurRows.length}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs py-2.5">
                            {result.isDuplicate ? (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                                <span className="text-yellow-700 font-medium">Duplicado ({serurRows.length})</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  );
                }

                // Caso normal: uma linha por resultado
                const serurRow = serurRows[0] || null;
                return (
                  <TableRow key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="text-xs py-2.5">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          result.status === 'MATCH'
                            ? 'bg-green-100 text-green-700'
                            : result.status === 'ONLY_SEVEN'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {result.status === 'MATCH'
                          ? 'Correspondência'
                          : result.status === 'ONLY_SEVEN'
                            ? 'Só Seven'
                            : 'Só Serur'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-gray-900 py-2.5">
                      {result.processo}
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 py-2.5">
                      {sevenRow ? formatDate(getCol(sevenRow, 'Data Diário')) : '-'}
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 py-2.5 max-w-xs">
                      <div title={getCol(sevenRow, 'Nome Encontrado') || ''} className="truncate">
                        {getCol(sevenRow, 'Nome Encontrado') || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 py-2.5 max-w-[120px]">
                      <div title={getCol(sevenRow, 'Cliente') || ''} className="truncate">
                        {getCol(sevenRow, 'Cliente') || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 py-2.5">
                      {getCol(sevenRow, 'UF') || getCol(serurRow, 'UF') || '-'}
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 py-2.5">
                      {getCol(sevenRow, 'Status Publicação') ? (
                        <span title={String(getCol(sevenRow, 'Status Publicação'))} className="truncate inline-block max-w-xs">
                          {String(getCol(sevenRow, 'Status Publicação')).substring(0, 20)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 py-2.5 max-w-xs">
                      <ContentModal 
                        content={String(getCol(serurRow, 'Conteúdo') || '').trim()} 
                        debugInfo={`Colunas disponíveis: ${serurRow ? Object.keys(serurRow).join(', ') : 'nenhuma'}`}
                        trigger={
                          <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                            Ver conteúdo
                          </span>
                        } 
                      />
                    </TableCell>
                    <TableCell className="text-xs py-2.5 text-center">
                      {serurRow ? (
                        <div className="flex items-center justify-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            {serurRows.length}
                          </span>
                        </div>
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-xs py-2.5">
                      {result.isDuplicate ? (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                          <span className="text-yellow-700 font-medium" title={result.duplicateFields.join(', ')}>
                            {result.duplicateFields.length > 0 ? result.duplicateFields.join(', ') : 'Sim'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Results Summary */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-xs text-gray-600">
          <p>Mostrando <span className="font-semibold">{filteredResults.length}</span> de <span className="font-semibold">{results.length}</span> resultados</p>
        </div>
      </Card>
    </div>
  );
}
