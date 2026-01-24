'use client';

import Link from 'next/link';
import { useRef } from 'react';

export default function HomePage() {
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-green-500/30 font-sans">
      
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="w-10 h-10 object-contain" alt="PayOnce Logo" 
               onError={(e) => e.target.src = "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png"} />
          <span className="text-2xl font-black tracking-tighter italic">PayOnce<span className="text-green-500">.cash</span></span>
        </div>
        
        <div className="hidden md:flex gap-6 items-center">
           <div className="flex gap-4 border-r border-white/10 pr-6 mr-2">
              <a href="https://x.com/PayOnceCash" target="_blank" className="text-zinc-400 hover:text-white transition-colors">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://t.me/PayOnceCash" target="_blank" className="text-zinc-400 hover:text-white transition-colors">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
              </a>
           </div>
           <button onClick={scrollToAbout} className="text-[10px] font-black uppercase tracking-[2px] text-zinc-500 hover:text-green-500 transition-colors">About Us</button>
           <Link href="/create">
            <button className="text-xs font-black uppercase tracking-widest bg-green-600 hover:bg-green-500 text-black px-6 py-2.5 rounded-full transition-all">
              Launch App
            </button>
           </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center pt-24 pb-32 px-6 text-center">
        <div className="inline-flex items-center gap-3 bg-green-500/5 border border-green-500/10 px-4 py-2 rounded-full text-green-500 text-[10px] font-black uppercase tracking-[2px] mb-10 animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Powered by Bitcoin Cash 0-Conf</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter max-w-5xl mb-8 leading-[0.9] bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent uppercase">
          Sell Content <br /> 
          <span className="text-green-500 italic">Instantly.</span>
        </h1>

        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-medium">
          The non-custodial gateway to sell digital goods. No middleman, no delays, and <span className="text-white underline decoration-green-500 underline-offset-4">automatic affiliate rewards</span>.
        </p>

        <div className="flex flex-col items-center w-full max-w-4xl px-4">
          <Link href="/create">
            <button className="bg-white text-black font-black px-12 py-4 rounded-xl text-lg md:text-xl transition-all shadow-xl hover:bg-green-500 hover:-translate-y-1 active:scale-95">
              START SELLING
            </button>
          </Link>

          <div className="flex flex-row gap-8 mt-12">
            <button 
              onClick={scrollToAbout}
              className="text-zinc-600 hover:text-white font-bold text-[10px] uppercase tracking-[3px] transition-all"
            >
                About Us
            </button>
            <div className="w-[1px] h-3 bg-white/10 self-center"></div>
            <button 
              onClick={scrollToFeatures}
              className="text-zinc-600 hover:text-white font-bold text-[10px] uppercase tracking-[3px] transition-all"
            >
                How it works
            </button>
          </div>
        </div>

        <div ref={aboutRef} className="mt-48 max-w-4xl text-left border-l-2 border-green-500/20 pl-8 md:pl-16">
            <h2 className="text-green-500 text-[10px] font-black uppercase tracking-[4px] mb-4">Who we are</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6 italic">Freedom to Sell, <br/>Built for Creators.</h3>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              PayOnce is a decentralized infrastructure that eliminates the complexity of digital commerce. We believe that creators should own their economy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-zinc-900/30 p-5 rounded-2xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 italic">Why PayOnce?</h4>
                    <p className="text-zinc-500">We take 0% commission. Funds hit your wallet instantly without intermediaries.</p>
                </div>
                <div className="bg-zinc-900/30 p-5 rounded-2xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 italic">The Vision</h4>
                    <p className="text-zinc-500">A world where a link is all you need to start a global, borderless business.</p>
                </div>
            </div>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mt-48">
          <div className="group bg-zinc-900/20 p-10 rounded-[40px] border border-white/5 text-left hover:border-green-500/20 transition-all">
            <div className="text-3xl mb-6">💸</div>
            <h3 className="text-xl font-black mb-4 tracking-tight">Direct Payments</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Your money goes directly to your wallet. 100% non-custodial.</p>
          </div>
          <div className="group bg-zinc-900/20 p-10 rounded-[40px] border border-white/5 text-left hover:border-purple-500/20 transition-all">
            <div className="text-3xl mb-6">🧬</div>
            <h3 className="text-xl font-black mb-4 tracking-tight">Viral Engine</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Built-in affiliate rewards handled automatically on-chain.</p>
          </div>
          <div className="group bg-zinc-900/20 p-10 rounded-[40px] border border-white/5 text-left hover:border-blue-500/20 transition-all">
            <div className="text-3xl mb-6">⚡</div>
            <h3 className="text-xl font-black mb-4 tracking-tight">Zero-Conf Speed</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Instant delivery powered by Bitcoin Cash network speed.</p>
          </div>
        </div>

        <div className="mt-40 bg-green-600 w-full max-w-4xl p-12 rounded-[50px] flex flex-col items-center gap-6">
            <h2 className="text-black text-4xl font-black tracking-tighter text-center uppercase leading-none">READY TO BUILD <br/>YOUR EMPIRE?</h2>
            <Link href="/create">
               <button className="bg-black text-white px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform">
                  CREATE YOUR FIRST LINK
               </button>
            </Link>
        </div>

        <div className="mt-32 flex flex-col items-center gap-6">
            <div className="flex gap-8 text-zinc-600">
               <a href="https://x.com/PayOnceCash" target="_blank" className="hover:text-white transition-colors">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
               </a>
               <a href="https://t.me/PayOnceCash" target="_blank" className="hover:text-white transition-colors">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
               </a>
            </div>
            <footer className="pb-10 text-zinc-800 text-[10px] font-black uppercase tracking-[5px]">
                PayOnce.cash • @PayOnceCash • 2026
            </footer>
        </div>
      </main>

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600/5 blur-[150px] -z-10 animate-pulse"></div>
    </div>
  );
}
