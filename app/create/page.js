'use client';

import Link from 'next/link';

export default function CreatePage() {
  const digitalAssets = [
    { name: 'PDF Document', slug: 'pdf', icon: '📄', desc: 'E-books, guides, or reports' },
    { name: 'Office Files', slug: 'office', icon: '📊', desc: 'Word, Excel, & PowerPoint docs' },
    { name: 'Video Content', slug: 'video', icon: '🎬', desc: 'Tutorials, movies, or clips' },
    { name: 'Mini-Course', slug: 'mini-course', icon: '🎓', desc: 'Structured learning lessons' },
    { name: 'Digital Book', slug: 'books', icon: '📚', desc: 'Full length digital publications' },
    { name: 'Event Ticket', slug: 'ticket', icon: '🎟️', desc: 'Access to exclusive events' },
    { name: 'Game Card', slug: 'game-card', icon: '🎮', desc: 'In-game items and assets' },
    { name: 'App License', slug: 'app-activate-card', icon: '🔑', desc: 'Software activation keys' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center py-20 px-6 relative overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.05)_0%,_transparent_70%)] -z-10"></div>
      
      <div className="text-center max-w-2xl mb-12">
        <Link href="/">
          <div className="inline-flex items-center gap-2 mb-8 group cursor-pointer">
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 group-hover:border-green-500/50 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Back to Home</span>
          </div>
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase italic">
          Choose Your <span className="text-green-500">Solution</span>
        </h1>
        <p className="text-zinc-500 font-medium">Select a tool to generate your decentralized payment link.</p>
      </div>

      <div className="w-full max-w-5xl mb-12">
        <div className="flex items-center gap-4 mb-6">
           <div className="h-[1px] bg-zinc-800 flex-1"></div>
           <span className="text-[10px] uppercase font-black tracking-[3px] text-green-500">Business & Retail</span>
           <div className="h-[1px] bg-zinc-800 flex-1"></div>
        </div>

        <Link
            href="/create/invoice"
            className="group relative w-full bg-gradient-to-r from-[#121214] to-[#0f2a1d] border border-green-500/20 hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] p-8 md:p-10 rounded-[32px] transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            
            <div className="relative z-10 flex items-start gap-6">
              <div className="text-5xl bg-zinc-900/80 w-24 h-24 flex items-center justify-center rounded-2xl border border-white/10 shadow-2xl group-hover:scale-105 transition-transform">
                🧾
              </div>
              <div>
                 <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight text-white group-hover:text-green-400 transition-colors italic uppercase">
                  Merchant Terminal
                 </h3>
                 <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed max-w-md">
                   All-in-one crypto invoicing solution. Perfect for <span className="text-white font-bold">Restaurants</span>, <span className="text-white font-bold">Retail Stores</span>, and <span className="text-white font-bold">Freelancers</span>.
                 </p>
                 <div className="flex gap-2 mt-4">
                    <span className="bg-zinc-800/50 border border-zinc-700 px-3 py-1 rounded-full text-[10px] uppercase font-bold text-zinc-300">🏪 POS Mode</span>
                    <span className="bg-zinc-800/50 border border-zinc-700 px-3 py-1 rounded-full text-[10px] uppercase font-bold text-zinc-300">👤 Personal Bill</span>
                 </div>
              </div>
            </div>

            <div className="relative z-10 bg-green-600 text-black px-8 py-4 rounded-xl font-black uppercase text-sm tracking-wider flex items-center gap-2 group-hover:bg-green-500 transition-colors shadow-lg">
               Launch Terminal <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
        </Link>
      </div>

      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-[1px] bg-zinc-800 flex-1"></div>
           <span className="text-[10px] uppercase font-black tracking-[3px] text-zinc-600">Digital Assets</span>
           <div className="h-[1px] bg-zinc-800 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {digitalAssets.map((type) => (
            <Link
              key={type.slug}
              href={`/create/${type.slug}`}
              className="group relative bg-[#121214] hover:bg-[#18181b] border border-white/5 hover:border-zinc-600 p-6 rounded-[24px] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="text-3xl mb-4 bg-zinc-900 w-12 h-12 flex items-center justify-center rounded-xl border border-white/5">
                  {type.icon}
                </div>
                
                <h3 className="text-lg font-black mb-1 tracking-tight group-hover:text-green-500 transition-colors">
                  {type.name}
                </h3>
                
                <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-4">
                  {type.desc}
                </p>
                
                <div className="mt-auto flex justify-end opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="mt-24 text-[10px] font-black uppercase tracking-[5px] text-zinc-800">
          Secure • Non-Custodial • Powered by BCH
      </footer>

    </div>
  );
}
