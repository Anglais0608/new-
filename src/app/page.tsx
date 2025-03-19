'use client';

import React from 'react';
import Calculator from '@/components/Calculator/Calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-gray-900">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Calculatrice Complexe</h1>
        <Calculator />
      </div>
    </main>
  );
}
