'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FilterNomeMultiProps {
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
}

export function FilterNomeMulti({ options, value, onChange }: FilterNomeMultiProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const handleRemove = (option: string) => {
    onChange(value.filter(v => v !== option));
  };

  const handleClear = () => {
    onChange([]);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="border border-gray-300 rounded bg-white">
        {/* Selected items */}
        <div className="flex flex-wrap gap-2 p-2 min-h-10">
          {value.length === 0 ? (
            <span className="text-gray-500 text-sm py-1">Selecione nomes...</span>
          ) : (
            value.map(item => (
              <div
                key={item}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
              >
                {item}
                <button
                  onClick={() => handleRemove(item)}
                  className="hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))
          )}
          <div className="flex-1 flex items-center justify-end">
            {value.length > 0 && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 mr-1"
                title="Limpar todos"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 border-t border-gray-300 bg-white rounded-b max-h-48 overflow-y-auto z-10 shadow-lg">
            {options.length === 0 ? (
              <div className="p-3 text-gray-500 text-sm text-center">Nenhuma opção disponível</div>
            ) : (
              options.map(option => (
                <label
                  key={option}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option)}
                    onChange={() => handleToggle(option)}
                    className="w-4 h-4"
                  />
                  <span>{option}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
