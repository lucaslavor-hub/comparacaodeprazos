'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  selectedFile?: File | null;
  loading?: boolean;
}

export function FileUpload({ label, onFileSelect, selectedFile, loading }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (
          file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls'],
    },
    disabled: loading,
  });

  const handleClear = () => {
    onFileSelect(null);
  };

  return (
    <Card className="border border-gray-200 shadow-sm relative">
      <div className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">{label}</h3>

        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Arraste o arquivo ou clique para selecionar
            </p>
            <p className="mt-1 text-xs text-gray-500">
              .xlsx ou .xls
            </p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  Carregando arquivo...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
