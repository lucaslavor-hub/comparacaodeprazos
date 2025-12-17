'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface FilterNomeProps {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

export function FilterNome({ options, value, onChange }: FilterNomeProps) {
  return (
    <Card className="border border-gray-200 p-4">
      <label className="text-sm font-semibold text-gray-900 block mb-3">
        Filtrar por "Nome Encontrado"
      </label>
      <Select value={value || 'all'} onValueChange={(v) => onChange(v === 'all' ? null : v)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um nome..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos ({options.length})</SelectItem>
          {options.map((nome) => (
            <SelectItem key={nome} value={nome}>
              {nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
}
