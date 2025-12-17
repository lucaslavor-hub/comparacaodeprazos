# Sistema de Comparação de Prazos

Um aplicativo web moderno para carregar, visualizar e comparar dados de arquivos Excel com foco em análise de prazos.

## 🚀 Tecnologias

- **Next.js 16** - Framework React com SSR
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Componentes UI reutilizáveis
- **XLSX** - Leitura de arquivos Excel
- **React Dropzone** - Upload de arquivos com drag & drop

## 📦 Instalação

```bash
npm install
```

## 🏃 Como Executar

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Build

```bash
npm run build
npm start
```

## 📋 Estrutura do Projeto

```
src/
├── app/
│   ├── globals.css                   # Estilos globais
│   ├── layout.tsx                    # Layout principal
│   └── page.tsx                      # Página home
├── components/
│   ├── ui/                           # Componentes shadcn/ui
│   ├── FileUpload.tsx                # Componente de upload
│   ├── DataTable.tsx                 # Tabela para exibir dados
│   └── ComparisonDashboard.tsx       # Dashboard principal
└── lib/
    ├── utils.ts                      # Utilitários
    └── excelUtils.ts                 # Funções para Excel
```

## ✨ Funcionalidades Atuais

✅ **Upload de Arquivos Excel**
- Drag & drop interface
- Validação de tipo de arquivo
- Exibição de informações do arquivo

✅ **Visualização de Dados**
- Abas para cada planilha do Excel
- Tabela responsiva
- Primeiras 20 linhas visíveis
- Contador de linhas

✅ **Interface Moderna**
- Design moderno com gradientes
- Componentes shadcn/ui
- Layout responsivo

## 🔄 Próximas Funcionalidades

- [ ] Comparação de dados entre dois arquivos
- [ ] Cálculo automático de diferenças de prazos
- [ ] Relatório de divergências
- [ ] Exportação de resultados em Excel
- [ ] Mapeamento de colunas personalizável
- [ ] Cache de dados
- [ ] Histórico de comparações

## 📊 Formato de Arquivo Esperado (Seven)

O arquivo Excel esperado do sistema Seven deve conter as colunas:
- Data Diário
- Data Recebimento
- Hora Recebimento
- Número Processo
- NPC
- ID Publicação
- Status Publicação
- Conteúdo
- Classificação
- Data da Providência da Publicação
- (outras colunas conforme necessário)

## 🛠️ Desenvolvimento

### Adicionar novo componente shadcn/ui

```bash
npx shadcn@latest add <component-name>
```

Exemplos: `button`, `card`, `input`, `dialog`, `toast`, etc.

### ESLint

```bash
npm run lint
```

## 📝 Notas Importantes

- Arquivos Excel são lidos no lado do cliente (navegador)
- Os dados não são enviados para servidor nenhum
- Suporta múltiplas abas em um mesmo arquivo
- Compatível com `.xlsx` e `.xls`

## 🎯 Roadmap

1. **Fase 1** ✅ Layout básico e upload
   - Interface de upload
   - Visualização de dados

2. **Fase 2** 🔄 Comparação de dados (Em progresso)
   - Implementar lógica de correspondência
   - Cálculo de prazos
   - Relatório de divergências

3. **Fase 3** ⏳ Melhorias UX
   - Seletor de colunas para comparação
   - Filtros avançados
   - Estatísticas resumidas

4. **Fase 4** ⏳ Persistência
   - Salvar comparações
   - Exportar relatórios em Excel

## 📄 Licença

MIT

## ✉️ Suporte

Para dúvidas ou sugestões, entre em contato.
