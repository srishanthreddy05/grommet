import { Suspense } from 'react';
import ItemsClient from './ItemsClient';

export default function ItemsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-[calc(100vh-64px)] bg-[#FEF7EF] px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-slate-200 bg-[#FEF7EF] p-8 text-slate-700 shadow-sm text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-slate-900 mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </main>
    }>
      <ItemsClient />
    </Suspense>
  );
}
