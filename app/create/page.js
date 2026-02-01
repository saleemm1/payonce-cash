'use client';

import Link from 'next/link';

export default function CreatePage() {
  const digitalAssets = [
    { name: 'Source Code', slug: 'code', icon: '💻', desc: 'Scripts, plugins, or software' },
    { name: 'Secure Folder', slug: 'folder', icon: '📁', desc: 'Archives & bulk data' },
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
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center py-20 px-6 relative overflow-hidden font-sans">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.08)_0%,_transparent_70%)] -z-10"></div>
      
      <div className="text-center max-w-3xl mb-16">
        <Link href="/">
          <div className="inline-flex items-center gap-2 mb-8 group cursor-pointer">
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 group-hover:border-green-500/50 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Back to Home</span>
          </div>
        </Link>
        
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 uppercase italic leading-none">
          What do you want to <span className="text-green-500"> SELL?</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Decentralized Payment Infrastructure for Bitcoin Cash</p>
      </div>

      <div className="w-full max-w-5xl mb-16">
        <div className="flex items-center gap-4 mb-8">
           <span className="text-[11px] uppercase font-black tracking-[4px] text-green-500 whitespace-nowrap">Business & Retail Solutions</span>
           <div className="h-[1px] bg-gradient-to-r from-green-500/50 to-transparent flex-1"></div>
        </div>

        <Link
            href="/create/invoice"
            className="group relative w-full bg-[#121214] border border-white/5 hover:border-green-500/40 p-1 rounded-[40px] transition-all duration-500 hover:-translate-y-2 block mb-6"
          >
            <div className="bg-zinc-950/50 rounded-[38px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/5 blur-[100px] -z-10"></div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                <div className="text-6xl bg-zinc-900 w-28 h-28 flex items-center justify-center rounded-3xl border border-white/5 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  🧾
                </div>
                <div className="text-center md:text-left">
                   <h3 className="text-3xl md:text-4xl font-black mb-3 tracking-tighter text-white uppercase italic">
                   Merchant <span className="text-green-500 text-shadow-glow">Terminal</span>
                   </h3>
                   <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-xl mb-6">
                     Deploy a real-world BCH payment system for your business.
Accept Bitcoin Cash instantly — in-store or online.
                   </p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-zinc-900/80 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">🏪</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-green-500 uppercase">POS Mode</span>
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">In-store Retail</span>
                        </div>
                      </div>
                      <div className="bg-zinc-900/80 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">👤</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-blue-400 uppercase">Personal</span>
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">1-on-1 Billing</span>
                        </div>
                      </div>
                      <div className="bg-zinc-900/80 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">📦</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-purple-400 uppercase">Digital Shop</span>
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">Public Listing</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="relative z-10 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-tighter flex items-center gap-3 group-hover:bg-green-500 transition-all shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap">
                  Open Terminal <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
        </Link>

        
        <Link href="/pos" className="group w-full bg-[#121214] border border-white/5 hover:border-green-500/40 p-6 rounded-[32px] transition-all hover:-translate-y-1 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-full bg-green-500/5 blur-[60px]"></div>
            <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center text-4xl border border-white/5 group-hover:scale-110 transition-transform shadow-2xl">
                📱
            </div>
            <div className="text-center md:text-left">
                <h4 className="text-2xl font-black uppercase italic text-white group-hover:text-green-500 transition-colors">
                    Live Web POS
                </h4>
                <p className="text-sm text-zinc-400 font-medium mt-1 max-w-lg">
                    Turn any smartphone or tablet into a <span className="text-white font-bold">Bitcoin Cash Point of Sale</span>. <br className="hidden md:block"/> No hardware required. Auto-saved wallets. Real-time rates.
                </p>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 hidden md:block">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
            </div>
        </Link>
      </div>

      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
           <span className="text-[11px] uppercase font-black tracking-[4px] text-zinc-600 whitespace-nowrap">Digital Asset Locking</span>
           <div className="h-[1px] bg-zinc-800 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {digitalAssets.map((type) => (
            <Link
              key={type.slug}
              href={`/create/${type.slug}`}
              className="group relative bg-[#121214] hover:bg-zinc-900/50 border border-white/5 hover:border-white/20 p-8 rounded-[32px] transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative z-10">
                <div className="text-4xl mb-6 bg-zinc-900 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  {type.icon}
                </div>
                
                <h3 className="text-xl font-black mb-2 tracking-tight group-hover:text-green-500 transition-colors uppercase italic">
                  {type.name}
                </h3>
                
                <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-4">
                  {type.desc}
                </p>
                
                <div className="mt-6 flex justify-end opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}

          <div className="border-2 border-dashed border-white/5 p-8 rounded-[32px] flex flex-col items-center justify-center text-center group hover:bg-zinc-900/20 transition-all">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-zinc-700 font-bold group-hover:scale-110 transition-transform">
                  +
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-600">More assets<br/>Coming Soon</span>
          </div>
        </div>
      </div>

      <footer className="mt-32 flex flex-col items-center gap-4">
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[3px] text-zinc-700">
            <span>Non-Custodial</span>
            <span className="text-green-900">•</span>
            <span>Instant Settlement</span>
            <span className="text-green-900">•</span>
            <span>Zero Fees</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[5px] text-green-500/40">Powered by Bitcoin Cash</p>
      </footer>

      <style jsx>{`
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
        }
      `}</style>

    </div>
  );
}
