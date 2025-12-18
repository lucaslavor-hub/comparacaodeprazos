'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ContentModalProps {
  content: string;
  trigger?: React.ReactNode;
  debugInfo?: string;
}

export function ContentModal({ content, trigger, debugInfo }: ContentModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const preview = content && content.length > 50 
    ? content.substring(0, 50) + '...' 
    : content || '-';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer text-xs"
        title="Clique para ver o conteúdo completo"
      >
        {trigger || preview}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="max-w-2xl max-h-[80vh] overflow-auto bg-white shadow-lg">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Conteúdo</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded p-4 text-xs text-gray-800 whitespace-pre-wrap break-words max-h-[60vh] overflow-auto font-mono">
                {content ? content : (
                  <div className="text-gray-500">
                    <p>Sem conteúdo</p>
                    {debugInfo && <p className="mt-2 text-gray-400">{debugInfo}</p>}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
