'use client';

import * as XLSX from 'xlsx';

export interface ExcelData {
  sheets: {
    [sheetName: string]: any[];
  };
  headers: {
    [sheetName: string]: string[];
  };
}

export interface ComparisonResult {
  status: 'MATCH' | 'ONLY_SEVEN' | 'ONLY_SERUR';
  processo: string;
  sevenRows: any[];
  serurRows: any[];
  serurRow: any | null; // Mantém para compatibilidade
  isDuplicate: boolean;
  duplicateFields: string[];
}

const CNJ_REGEX = /\b\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}\b/;
const CNJ_20DIGITS = /\b\d{20}\b/;

// Normaliza nomes de colunas: remove espaços extras, converte para lowercase
function normalizeColumnName(col: string): string {
  return String(col || '').trim().toLowerCase();
}

// Encontra uma coluna no objeto, mesmo com espaços extras e variações
function getColumnValue(row: any, columnNames: string | string[]): any {
  const targets = Array.isArray(columnNames) ? columnNames : [columnNames];
  
  // Tenta encontrar correspondência exata primeiro
  for (const target of targets) {
    if (row.hasOwnProperty(target)) {
      return row[target];
    }
  }
  
  // Se não encontrar, tenta normalizado
  const normalizedTargets = targets.map(normalizeColumnName);
  const rowKeys = Object.keys(row);
  
  for (const key of rowKeys) {
    const normalizedKey = normalizeColumnName(key);
    if (normalizedTargets.includes(normalizedKey)) {
      return row[key];
    }
  }
  
  return undefined;
}

// Normaliza dados: remove espaços extras de todos os valores
function normalizeRowData(row: any): any {
  const normalized: any = {};
  for (const key in row) {
    let value = row[key];
    if (typeof value === 'string') {
      value = value.trim();
    }
    normalized[key] = value;
  }
  return normalized;
}

// Valida se o arquivo tem as colunas esperadas
export function validateExcelColumns(headers: string[], requiredColumns: string[]): { valid: boolean; missingColumns: string[] } {
  const missingColumns: string[] = [];
  
  for (const required of requiredColumns) {
    const found = headers.some(h => 
      normalizeColumnName(h) === normalizeColumnName(required) ||
      normalizeColumnName(h).includes(normalizeColumnName(required.split(/[, ]/)[0]))
    );
    
    if (!found) {
      missingColumns.push(required);
    }
  }
  
  return {
    valid: missingColumns.length === 0,
    missingColumns
  };
}

export async function readExcelFile(file: File): Promise<ExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const sheets: { [key: string]: any[] } = {};
        const headers: { [key: string]: string[] } = {};

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_json(worksheet) as any[];
          sheets[sheetName] = sheetData;

          // Extract headers
          if (sheetData.length > 0) {
            headers[sheetName] = Object.keys(sheetData[0] as Record<string, any>);
          }
        });

        resolve({ sheets, headers });
      } catch (error) {
        reject(new Error('Erro ao ler arquivo Excel'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsBinaryString(file);
  });
}

function formatCNJFromDigits(d: string): string {
  if (d.length !== 20) return '';
  return `${d.slice(0, 7)}-${d.slice(7, 9)}.${d.slice(9, 13)}.${d.slice(13, 14)}.${d.slice(14, 16)}.${d.slice(16, 20)}`;
}

export function extractProcessNumber(numeroProcesso?: any, conteudo?: any): string | null {
  const rawNum = String(numeroProcesso ?? '').trim();
  const rawContent = String(conteudo ?? '').trim();

  // Se vazio, retorna null
  if (!rawNum && !rawContent) return null;

  // 1) tenta "Número Processo"
  let m = rawNum.match(CNJ_REGEX);
  if (m) {
    return m[0];
  }

  const digits = rawNum.replace(/\D/g, '');
  if (digits.length === 20) {
    return formatCNJFromDigits(digits);
  }

  // 2) fallback: procura no Conteúdo
  m = rawContent.match(CNJ_REGEX);
  if (m) {
    return m[0];
  }

  const d2 = rawContent.match(CNJ_20DIGITS);
  if (d2) {
    return formatCNJFromDigits(d2[0]);
  }

  return null;
}

export function normalizeSevenData(sevenRows: any[]): any[] {
  return sevenRows.map((row) => {
    const normalizedRow = normalizeRowData(row);
    return {
      ...normalizedRow,
      processo_normalizado: extractProcessNumber(
        getColumnValue(normalizedRow, ['Número Processo', 'Número do Processo']),
        getColumnValue(normalizedRow, 'Conteúdo')
      ),
    };
  });
}

export function getNomeEncontradoOptions(sevenRows: any[]): string[] {
  const nomes = new Set<string>();
  sevenRows.forEach((row) => {
    const nome = getColumnValue(row, 'Nome Encontrado');
    if (nome && String(nome).trim()) {
      nomes.add(String(nome).trim());
    }
  });
  return Array.from(nomes).sort();
}

export function filterSevenByNome(sevenRows: any[], nomeEncontrado: string | string[] | null): any[] {
  if (!nomeEncontrado || (Array.isArray(nomeEncontrado) && nomeEncontrado.length === 0)) return sevenRows;
  
  const nomes = Array.isArray(nomeEncontrado) ? nomeEncontrado : [nomeEncontrado];
  
  return sevenRows.filter((row) => {
    const nome = getColumnValue(row, 'Nome Encontrado');
    return nomes.includes(String(nome ?? '').trim());
  });
}

export function formatDate(dateValue: any): string {
  if (!dateValue) return '-';
  
  try {
    // Se já é uma string de data
    if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('pt-BR');
      }
    }
    
    // Se é número (Excel serial date)
    if (typeof dateValue === 'number') {
      // Excel serial date: dias desde 01/01/1900
      // Vamos converter
      const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
      if (!isNaN(excelDate.getTime())) {
        return excelDate.toLocaleDateString('pt-BR');
      }
    }
    
    // Tenta parsing direto
    const d = new Date(dateValue);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('pt-BR');
    }
  } catch (e) {
    // ignora erro
  }
  
  return String(dateValue);
}

export function compareExcels(
  sevenData: any[],
  serurData: any[]
): ComparisonResult[] {
  // Normalizar dados
  const normalizedSeven = normalizeSevenData(sevenData);
  const normalizedSerur = normalizeSevenData(serurData);

  // Agrupar por processo (chave simples para compatibilidade com Lig Contato)
  const sevenByProcesso = new Map<string, any[]>();
  const serurByProcesso = new Map<string, any[]>();

  normalizedSeven.forEach((row) => {
    if (row.processo_normalizado) {
      if (!sevenByProcesso.has(row.processo_normalizado)) {
        sevenByProcesso.set(row.processo_normalizado, []);
      }
      sevenByProcesso.get(row.processo_normalizado)!.push(row);
    }
  });

  normalizedSerur.forEach((row) => {
    if (row.processo_normalizado) {
      if (!serurByProcesso.has(row.processo_normalizado)) {
        serurByProcesso.set(row.processo_normalizado, []);
      }
      serurByProcesso.get(row.processo_normalizado)!.push(row);
    }
  });

  const results: ComparisonResult[] = [];
  const processedProcessos = new Set<string>();

  // Processar cada processo no Seven
  sevenByProcesso.forEach((sevenRows, processo) => {
    processedProcessos.add(processo);
    
    const serurRowsForProcesso = serurByProcesso.get(processo) || [];
    
    // Verificar se há duplicatas: múltiplos registros com mesmo processo
    const isDuplicate = sevenRows.length > 1;
    const duplicateFields = isDuplicate ? ['Número Processo'] : [];

    results.push({
      status: serurRowsForProcesso.length > 0 ? 'MATCH' : 'ONLY_SEVEN',
      processo,
      sevenRows,
      serurRows: serurRowsForProcesso,
      serurRow: serurRowsForProcesso.length > 0 ? serurRowsForProcesso[0] : null,
      isDuplicate,
      duplicateFields,
    });
  });

  // Processar processos únicos do Serur que não estão no Seven
  serurByProcesso.forEach((serurRows, processo) => {
    if (!processedProcessos.has(processo)) {
      const isDuplicate = serurRows.length > 1;
      const duplicateFields = isDuplicate ? ['Número Processo'] : [];
      
      results.push({
        status: 'ONLY_SERUR',
        processo,
        sevenRows: [],
        serurRows,
        serurRow: serurRows[0],
        isDuplicate,
        duplicateFields,
      });
    }
  });

  return results;
}
