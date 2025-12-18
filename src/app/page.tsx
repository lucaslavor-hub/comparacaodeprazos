import { ComparisonDashboard } from '@/components/ComparisonDashboard';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <ComparisonDashboard />
      
      {/* Debug Section */}
      <div className="fixed bottom-6 right-6 text-xs text-gray-500 space-y-1">
        <div className="pt-2 border-t border-gray-300 mt-2">
          <Link href="/tutorial" className="block text-blue-600 hover:underline">
            📖 Tutorial
          </Link>
          <Link href="/debug-viewer" className="block text-blue-600 hover:underline">
            🔍 Visualizar Dados
          </Link>
          <Link href="/debug-processes" className="block text-blue-600 hover:underline">
            🔎 Debug Processos
          </Link>
        </div>
      </div>
    </>
  );
}
