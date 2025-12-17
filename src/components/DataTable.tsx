'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

interface DataTableProps {
  title: string;
  data: any[];
  columns: string[];
}

export function DataTable({ title, data, columns }: DataTableProps) {
  if (data.length === 0) {
    return null;
  }

  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <span className="text-xs text-gray-600 font-medium">
            {data.length} linhas
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
              {columns.map((col) => (
                <TableHead key={col} className="whitespace-nowrap text-xs font-semibold text-gray-700 h-10">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, 20).map((row, idx) => (
              <TableRow key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <TableCell key={col} className="whitespace-nowrap text-xs text-gray-700 py-2.5">
                    <span className="inline-block max-w-xs truncate">
                      {String(row[col] || '-').substring(0, 100)}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data.length > 20 && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
          <p className="text-xs text-gray-600">
            Mostrando 20 de <span className="font-semibold">{data.length}</span> linhas
          </p>
        </div>
      )}
    </Card>
  );
}
