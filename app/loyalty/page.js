'use client';

import Link from 'next/link';

export default function LoyaltyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden">
      
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-yellow-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-green-600/5 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-sm border-b border-white/5">
         <Link href="/">
           <div className="flex items-center gap-2 cursor-pointer group">
              <span className="text-xl">←</span>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Back to PayOnce</span>
           </div>
         </Link>
         <div className="text-[10px] font-black uppercase tracking-widest text-yellow-500 border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 rounded-full">
            Beta Access
         </div>
      </nav>

      <main className="pt-40 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
         
         <div className="mb-8 animate-pulse">
            <span className="text-[10px] font-black uppercase tracking-[6px] text-yellow-500">Coming Soon</span>
         </div>

         <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 leading-none">
            <span className="text-white">Shop & Earn</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">Real Assets.</span>
         </h1>

         <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
            The first <strong>Shop-to-Earn</strong> protocol built on Bitcoin Cash. 
            Receive tradable <span className="text-white">CashTokens</span> instantly in your wallet every time you pay with PayOnce.
         </p>

         <div className="relative w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl mb-20 transform hover:scale-105 transition-transform duration-500">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                       <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M11 7h2v6h-2zm0 8h2v2h-2z"/></svg>
                    </div>
                    <div className="text-left">
                       <div className="text-xs font-bold">Payment Success</div>
                       <div className="text-[10px] text-zinc-500">Just now via PayOnce</div>
                    </div>
                </div>
                <div className="text-xs font-mono text-green-400">-$15.00</div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                      🎁
                   </div>
                   <div className="text-left">
                      <div className="text-xs font-black uppercase text-yellow-500">Reward Unlocked</div>
                      <div className="text-[10px] text-zinc-400">You received PAY Tokens</div>
                   </div>
                </div>
                <div className="text-lg font-black italic text-white">+15.00 PAY</div>
            </div>
            
            <div className="mt-4 text-[9px] text-zinc-600 text-center font-mono">
               Hash: 349a...8f2b • Settled in 0-Conf
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
             <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-yellow-500/20 transition-all">
                 <div className="text-3xl mb-4">💎</div>
                 <h3 className="text-lg font-bold mb-2 text-white">Not Just Points</h3>
                 <p className="text-zinc-500 text-sm">Unlike database points, these are real on-chain assets you can trade, swap, or hold.</p>
             </div>
             <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-yellow-500/20 transition-all">
                 <div className="text-3xl mb-4">⚡</div>
                 <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white">Automated Airdrops</h3>
                 </div>
                 <p className="text-zinc-500 text-sm">Merchants set the rules. The protocol airdrops tokens instantly upon payment.</p>
             </div>
             <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-yellow-500/20 transition-all">
                 <div className="text-3xl mb-4">🤝</div>
                 <h3 className="text-lg font-bold mb-2 text-white">Loyalty 3.0</h3>
                 <p className="text-zinc-500 text-sm">Create exclusive access, discount NFTs, or voting rights for your top customers.</p>
             </div>
         </div>

         <div className="mt-20 mb-20">
             <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-zinc-800 to-zinc-700">
                 <button className="bg-[#050505] text-zinc-300 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 transition-all">
                    Feature In Development
                 </button>
             </div>
         </div>

      </main>

    </div>
  );
}
