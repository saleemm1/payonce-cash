'use client';

import Link from 'next/link';

export default function CreatePage() {
  const contentTypes = [
    { name: 'PDF', slug: 'pdf' },
    { name: 'Video', slug: 'video' },
    { name: 'Mini-course', slug: 'mini-course' },
    { name: 'Digital Book', slug: 'books' },
    { name: 'Ticket', slug: 'ticket' },
    { name: 'Game-card', slug: 'game-card' },
    { name: 'App-activate-card', slug: 'app-activate-card' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">
        Choose Content Type to Sell
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {contentTypes.map((type) => (
          <Link
            key={type.slug}
            href={`/create/${type.slug}`}
            className="bg-green-500 hover:bg-green-400 text-black font-bold py-6 rounded-2xl text-center text-xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          >
            {`Create ${type.name}`}
          </Link>
        ))}
      </div>
    </div>
  );
}