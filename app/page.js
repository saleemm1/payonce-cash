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
      
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="w-10 h-10 object-contain" alt="PayOnce Logo" 
               onError={(e) => e.target.src = "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png"} />
          <span className="text-2xl font-black tracking-tighter italic">PayOnce<span className="text-green-500">.cash</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[2px] text-zinc-500">
           <button onClick={scrollToAbout} className="hover:text-green-500 transition-colors">About Us</button>
           <button onClick={scrollToFeatures} className="hover:text-green-500 transition-colors">How it works</button>
        </div>
        <Link href="/create">
          <button className="text-xs font-black uppercase tracking-widest bg-green-600 hover:bg-green-500 text-black px-6 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95">
            Launch App
          </button>
        </Link>
      </nav>

      <main className="flex flex-col items-center justify-center pt-24 pb-32 px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 bg-green-500/5 border border-green-500/10 px-4 py-2 rounded-full text-green-500 text-[10px] font-black uppercase tracking-[2px] mb-10 animate-pulse">
          <img src="/bch.png" className="w-4 h-4" alt="BCH" onError={(e) => e.target.src = "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png"} />
          <span>Powered by Bitcoin Cash 0-Conf</span>
        </div>

        {/* Hero Section */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter max-w-5xl mb-8 leading-[0.9] bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent">
          SELL CONTENT <br /> 
          <span className="text-green-500 italic">INSTANTLY.</span>
        </h1>

        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-medium">
          The non-custodial gateway to sell digital goods. No middleman, no delays, and <span className="text-white underline decoration-green-500 underline-offset-4">automatic affiliate rewards</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 w-full justify-center px-4">
          <Link href="/create">
            <button className="w-full sm:w-auto bg-white text-black font-black px-12 py-5 rounded-2xl text-xl transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-green-500 hover:shadow-green-500/20 active:scale-95 text-center">
              START SELLING
            </button>
          </Link>
          <button 
            onClick={scrollToFeatures}
            className="w-full sm:w-auto bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold px-12 py-5 rounded-2xl border border-white/5 transition-all backdrop-blur-md"
          >
              How it works
          </button>
        </div>

        {/* About Section (New) */}
        <div ref={aboutRef} className="mt-48 max-w-4xl text-left border-l-2 border-green-500/20 pl-8 md:pl-16">
            <h2 className="text-green-500 text-[12px] font-black uppercase tracking-[4px] mb-4">Who we are</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Freedom to Sell, <br/>Built for Creators.</h3>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              PayOnce is a decentralized infrastructure that eliminates the complexity of digital commerce. We believe that creators should own their economy. 
              Our project provides a <span className="text-white">peer-to-peer</span> bridge between your content and your customers, using the power of Bitcoin Cash.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 italic">Why PayOnce?</h4>
                    <p className="text-zinc-500">Traditional platforms take 30% of your revenue and hold your money for weeks. We take 0% and your money is in your wallet in seconds.</p>
                </div>
                <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5">
                    <h4 className="text-white font-bold mb-2 italic">The Vision</h4>
                    <p className="text-zinc-500">To create a world where a link is all you need to start a global business. No bank accounts, no borders, just code and crypto.</p>
                </div>
            </div>
        </div>

        {/* Features Grid */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mt-48 relative">
          <div className="absolute inset-0 bg-green-500/5 blur-[120px] -z-10"></div>
          
          <div className="group bg-gradient-to-b from-zinc-900 to-black p-10 rounded-[40px] border border-white/5 text-left hover:border-green-500/20 transition-all">
            <div className="text-4xl mb-6 group-hover:rotate-12 transition-transform">💸</div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Direct Payments</h3>
            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
              Money goes from buyer to your wallet. We never hold your funds, ensuring 100% security and zero platform risk.
            </p>
          </div>

          <div className="group bg-gradient-to-b from-zinc-900 to-black p-10 rounded-[40px] border border-white/5 text-left hover:border-purple-500/20 transition-all">
            <div className="text-4xl mb-6 group-hover:scale-125 transition-transform">🧬</div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Viral Engine</h3>
            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
              Built-in affiliate system. Let your customers promote your work for a 10% commission, handled automatically on-chain.
            </p>
          </div>

          <div className="group bg-gradient-to-b from-zinc-900 to-black p-10 rounded-[40px] border border-white/5 text-left hover:border-blue-500/20 transition-all">
            <div className="text-4xl mb-6 group-hover:-translate-y-2 transition-transform">⚡</div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Zero-Conf Speed</h3>
            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
              Leveraging BCH 0-conf for instant digital delivery. The moment they pay, the content is unlocked.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-40 bg-green-600 w-full max-w-5xl p-12 rounded-[50px] flex flex-col items-center gap-6 shadow-[0_40px_80px_rgba(22,163,74,0.2)]">
            <img src="/bch.png" className="w-20 h-20 object-contain drop-shadow-xl" alt="BCH Footer" 
                 onError={(e) => e.target.src = "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png"} />
            <h2 className="text-black text-4xl md:text-5xl font-black tracking-tighter text-center">READY TO BUILD YOUR EMPIRE?</h2>
            <Link href="/create">
               <button className="bg-black text-white px-10 py-4 rounded-full font-black text-lg hover:scale-110 transition-transform shadow-2xl">
                  CREATE YOUR FIRST LINK
               </button>
            </Link>
        </div>

        <footer className="mt-32 pb-10 text-zinc-700 text-[10px] font-black uppercase tracking-[5px]">
            PayOnce.cash • No Limits • No Fees • 2026
        </footer>
      </main>

      {/* Background Decorative Blurs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[150px] rounded-full -z-10"></div>
    </div>
  );
}
