'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Upload, Filter, Eye } from 'lucide-react';

export default function Tutorial() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Lig Contato"
                width={120}
                height={40}
                priority
                className="h-10 w-auto"
              />
              <div className="border-l border-gray-300 pl-3">
                <h1 className="text-lg font-semibold text-gray-900">Tutorial</h1>
                <p className="text-xs text-gray-600">Guia de uso do sistema de sincronização</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                Voltar ao inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-12">
          {/* Introdução */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Como usar o Publicações</h2>
            <p className="text-gray-700">
              O sistema <strong>Publicações</strong> permite sincronizar e comparar dados entre o relatório do 
              <strong> Seven iPrazos</strong> e os registros do <strong> Lig Contato</strong>. 
              Siga o passo a passo abaixo para usar todas as funcionalidades.
            </p>
          </section>

          {/* Step 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Faça upload dos arquivos</h3>
            </div>
            <Card className="p-6 space-y-4 border-blue-200 bg-blue-50">
              <p className="text-gray-700">
                Na seção <strong>"1. Carregue os arquivos"</strong>, você verá dois campos para upload:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Upload className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  <span><strong>Seven iPrazos (relatório):</strong> Faça upload do arquivo Excel com o relatório do Seven</span>
                </li>
                <li className="flex items-start gap-2">
                  <Upload className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  <span><strong>Lig Contato:</strong> Faça upload do arquivo Excel com os dados do Lig Contato</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600">
                💡 Você pode arrastar e soltar os arquivos ou clicar no campo para selecionar.
              </p>
            </Card>
          </section>

          {/* Step 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <span className="text-sm font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Configure os filtros (opcional)</h3>
            </div>
            <Card className="p-6 space-y-4 border-green-200 bg-green-50">
              <p className="text-gray-700">
                Após carregar o arquivo do Seven, você pode aplicar filtros na seção 
                <strong> "2. Configure os filtros"</strong>:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Filter className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                  <span><strong>Nome Encontrado:</strong> Selecione um ou mais nomes para filtrar os processos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Filter className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                  <span><strong>UF:</strong> Filtro por estado</span>
                </li>
                <li className="flex items-start gap-2">
                  <Filter className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                  <span><strong>Status Publicação:</strong> Filtro por status</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600">
                💡 Os filtros são opcionais. Se não aplicar nenhum, a comparação usará todos os dados.
              </p>
            </Card>
          </section>

          {/* Step 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <span className="text-sm font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Clique em "Comparar"</h3>
            </div>
            <Card className="p-6 space-y-4 border-purple-200 bg-purple-50">
              <p className="text-gray-700">
                Após carregar ambos os arquivos, clique no botão <strong>"Comparar"</strong> para sincronizar os dados.
              </p>
              <p className="text-sm text-gray-600">
                O sistema irá:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>✓ Normalizar os números de processo (CNJ)</li>
                <li>✓ Buscar correspondências entre os dois arquivos</li>
                <li>✓ Identificar processos únicos e duplicatas</li>
                <li>✓ Exibir um relatório completo com os resultados</li>
              </ul>
            </Card>
          </section>

          {/* Step 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                <span className="text-sm font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Analise os resultados</h3>
            </div>
            <Card className="p-6 space-y-4 border-orange-200 bg-orange-50">
              <p className="text-gray-700">
                Os resultados são exibidos em uma tabela com as seguintes informações:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                  <span><strong>MATCH:</strong> Processo encontrado em ambos os arquivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                  <span><strong>ONLY_SEVEN:</strong> Processo existe apenas no Seven</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="h-5 w-5 flex-shrink-0 text-orange-600 mt-0.5" />
                  <span><strong>ONLY_SERUR:</strong> Processo existe apenas no Lig Contato</span>
                </li>
              </ul>
            </Card>
          </section>

          {/* Formatos de Arquivo */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Formatos de arquivo esperados</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 border-blue-200">
                <h4 className="mb-3 font-semibold text-gray-900">Seven iPrazos</h4>
                <p className="mb-3 text-sm text-gray-600">Colunas obrigatórias:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Número Processo</li>
                  <li>• Conteúdo</li>
                  <li>• Nome Encontrado</li>
                </ul>
              </Card>
              <Card className="p-6 border-green-200">
                <h4 className="mb-3 font-semibold text-gray-900">Lig Contato</h4>
                <p className="mb-3 text-sm text-gray-600">Coluna obrigatória:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Número do Processo</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Dicas */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">💡 Dicas úteis</h3>
            <Card className="p-6 space-y-3 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-gray-700">
                <strong>Números de processo:</strong> O sistema normaliza automaticamente os números de processo CNJ. 
                Você pode ter diferentes formatos (com ou sem formatação) que serão reconhecidos.
              </p>
              <p className="text-sm text-gray-700">
                <strong>Multi-select:</strong> Use Ctrl+Click para selecionar múltiplos nomes no filtro de "Nome Encontrado".
              </p>
              <p className="text-sm text-gray-700">
                <strong>Duplicatas:</strong> O sistema identifica automaticamente registros duplicados dentro do mesmo arquivo.
              </p>
              <p className="text-sm text-gray-700">
                <strong>Conteúdo:</strong> Clique em um conteúdo da tabela para visualizar o texto completo em um modal.
              </p>
            </Card>
          </section>

          {/* CTA */}
          <section className="text-center pt-8">
            <Link href="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Ir para a página principal
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
