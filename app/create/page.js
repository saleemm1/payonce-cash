'use client';

import Link from 'next/link';

export default function CreatePage() {
  const contentTypes = [
    { name: 'PDF Document', slug: 'pdf', icon: '📄', desc: 'E-books, guides, or reports' },
    { name: 'Video Content', slug: 'video', icon: '🎬', desc: 'Tutorials, movies, or clips' },
    { name: 'Mini-Course', slug: 'mini-course', icon: '🎓', desc: 'Structured learning lessons' },
    { name: 'Digital Book', slug: 'books', icon: '📚', desc: 'Full length digital publications' },
    { name: 'Event Ticket', slug: 'ticket', icon: '🎟️', desc: 'Access to exclusive events' },
    { name: 'Game Card', slug: 'game-card', icon: '🎮', desc: 'In-game items and assets' },
    { name: 'App License', slug: 'app-activate-card', icon: '🔑', desc: 'Software activation keys' },
    { name: 'Professional Invoice', slug: 'invoice', icon: '🧾', desc: 'For stores and service providers' },
    { name: 'Office Files', slug: 'office', icon: '📊', desc: 'Word, Excel, & PowerPoint docs' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center py-20 px-6 relative overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.05)_0%,_transparent_70%)] -z-10"></div>
      
      <div className="text-center max-w-2xl mb-16">
        <Link href="/">
          <div className="inline-flex items-center gap-2 mb-8 group cursor-pointer">
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 group-hover:border-green-500/50 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Back to Home</span>
          </div>
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase italic">
          What are you <span className="text-green-500">Selling?</span>
        </h1>
        <p className="text-zinc-500 font-medium">Select your asset type to generate your unique payment link.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl relative">
        {contentTypes.map((type) => (
          <Link
            key={type.slug}
            href={`/create/${type.slug}`}
            className="group relative bg-[#121214] hover:bg-[#18181b] border border-white/5 hover:border-green-500/30 p-8 rounded-[32px] transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="text-4xl mb-6 bg-zinc-900 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                {type.icon}
              </div>
              
              <h3 className="text-xl font-black mb-2 tracking-tight group-hover:text-green-500 transition-colors">
                {type.name}
              </h3>
              
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                {type.desc}
              </p>
            </div>

            <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </Link>
        ))}

        <div className="border-2 border-dashed border-white/5 p-8 rounded-[32px] flex flex-col items-center justify-center text-zinc-700">
             <span className="text-xs font-black uppercase tracking-widest">More types coming soon...</span>
        </div>
      </div>

      <footer className="mt-20 text-[10px] font-black uppercase tracking-[5px] text-zinc-800">
          Secure • Non-Custodial • Powered by BCH
      </footer>

    </div>
  );
}
