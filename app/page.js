'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

export default function HomePage() {
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const invoiceRef = useRef(null);
  const devRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = () => featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToHowItWorks = () => howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToInvoice = () => invoiceRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToDev = () => devRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-green-500/30 font-sans overflow-x-hidden">
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse-slow delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-[#050505]/80 backdrop-blur-md border-white/5 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
                <div className="absolute inset-0 bg-green-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img src="/logo.png" className="w-9 h-9 object-contain relative z-10" alt="Logo" onError={(e) => e.target.src = "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png"} />
            </div>
            <span className="text-xl font-black tracking-tighter italic">PayOnce<span className="text-green-500">.cash</span></span>
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
             <button onClick={scrollToHowItWorks} className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">How it Works</button>
             <button onClick={scrollToInvoice} className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Solutions</button>
             <button onClick={scrollToDev} className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Developers</button>
             
             {/* 🔥 NEW LOYALTY BUTTON ADDED HERE */}
             <Link href="/loyalty">
               <button className="text-[11px] font-bold uppercase tracking-widest text-yellow-500 hover:text-yellow-400 transition-colors flex items-center gap-2">
                 Loyalty <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[8px] px-1.5 py-0.5 rounded">NEW</span>
               </button>
             </Link>
             
             <div className="h-4 w-[1px] bg-white/10"></div>
             
             <div className="flex gap-4">
               <a href="https://x.com/PayOnceCash" target="_blank" className="text-zinc-500 hover:text-white transition-colors"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
               <a href="https://t.me/PayOnceCash" target="_blank" className="text-zinc-500 hover:text-white transition-colors"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg></a>
             </div>

             <Link href="/create">
              <button className="text-[10px] font-black uppercase tracking-widest bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-full transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                Launch App 🚀
              </button>
             </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center pt-40 pb-20 px-6 text-center relative">
        
        <div className="inline-flex items-center gap-2 bg-zinc-900/50 backdrop-blur-sm border border-green-500/20 px-4 py-1.5 rounded-full mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Live on Bitcoin Cash Network</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter max-w-4xl mb-6 leading-tight uppercase italic">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">Monetize Your</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">Digital Assets.</span>
        </h1>

        <p className="text-zinc-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed font-medium">
          The non-custodial gateway to sell goods. Upload files, lock them with crypto, and sell instantly. No signup, no banks, no limits.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none justify-center px-4">
          <Link href="/create">
            <button className="w-full sm:w-auto bg-white text-black font-black px-10 py-4 rounded-2xl text-lg transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-green-500 hover:scale-105 active:scale-95">
              START SELLING
            </button>
          </Link>
          <button 
            onClick={scrollToInvoice}
            className="w-full sm:w-auto bg-zinc-900/50 backdrop-blur border border-white/10 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all hover:bg-zinc-800 hover:border-white/20"
          >
            Explore Solutions
          </button>
        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           {['Source Code', 'PDFs', 'Videos', 'Tickets', 'Designs', 'Data'].map((item) => (
               <div key={item} className="px-4 py-2 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest bg-zinc-900/30">
                  {item}
               </div>
           ))}
        </div>
      </main>

      <section ref={howItWorksRef} className="py-32 px-6 border-t border-white/5 bg-[#08080a] relative">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-green-500 text-sm font-black uppercase tracking-[5px] mb-3">The Process</h2>
               <h3 className="text-3xl md:text-5xl font-black uppercase italic text-white">From Upload to <span className="text-zinc-600">Cash</span></h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               <div className="group relative bg-zinc-900/40 p-10 rounded-[40px] border border-white/5 hover:border-green-500/30 transition-all hover:-translate-y-2">
                  <div className="absolute top-10 right-10 text-8xl font-black text-white/5 group-hover:text-green-500/10 transition-colors">1</div>
                  <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">📤</div>
                  <h4 className="text-xl font-black uppercase italic mb-3">Upload & Encrypt</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">Upload your file. We encrypt it on IPFS. Only the buyer with the key can unlock it.</p>
               </div>
               
               <div className="group relative bg-zinc-900/40 p-10 rounded-[40px] border border-white/5 hover:border-green-500/30 transition-all hover:-translate-y-2">
                  <div className="absolute top-10 right-10 text-8xl font-black text-white/5 group-hover:text-green-500/10 transition-colors">2</div>
                  <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">🔗</div>
                  <h4 className="text-xl font-black uppercase italic mb-3">Share Link</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">Set your price in USD (paid in BCH). Get a secure link to post on social media or send to clients.</p>
               </div>

               <div className="group relative bg-zinc-900/40 p-10 rounded-[40px] border border-white/5 hover:border-green-500/30 transition-all hover:-translate-y-2">
                  <div className="absolute top-10 right-10 text-8xl font-black text-white/5 group-hover:text-green-500/10 transition-colors">3</div>
                  <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">💰</div>
                  <h4 className="text-xl font-black uppercase italic mb-3">Instant Payout</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">Funds go <span className="text-white font-bold">directly</span> to your wallet instantly. No platform holding periods.</p>
               </div>
            </div>
         </div>
      </section>

      <section ref={invoiceRef} className="py-32 px-6 relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16">
               <h2 className="text-green-500 text-sm font-black uppercase tracking-[5px] mb-3">One Terminal. Infinite Uses.</h2>
               <h3 className="text-3xl md:text-5xl font-black uppercase italic text-white max-w-3xl mx-auto">Powerful Invoice Solutions <br/> for Every Business</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-zinc-900/20 border border-white/10 rounded-[30px] p-8 hover:bg-zinc-900/40 transition-all">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">🏪</div>
                        <div>
                            <h4 className="text-xl font-black uppercase italic">Retail POS</h4>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Restaurants • Cafes • Stores</p>
                        </div>
                    </div>
                    <ul className="space-y-4 text-sm text-zinc-400">
                        <li className="flex gap-2"><span className="text-green-500">✓</span> 0-Hardware Setup (Just your phone/laptop)</li>
                        <li className="flex gap-2"><span className="text-green-500">✓</span> Instant "Order Paid" confirmation</li>
                        <li className="flex gap-2"><span className="text-green-500">✓</span> Perfect for University Cafeterias & Food Trucks</li>
                        <li className="flex gap-2"><span className="text-green-500">✓</span> No credit card fees (Save 3%)</li>
                    </ul>
                </div>

                <div className="bg-zinc-900/20 border border-white/10 rounded-[30px] p-8 hover:bg-zinc-900/40 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-white/5 px-3 py-1 text-[9px] font-black uppercase text-zinc-500 rounded-bl-xl">Popular</div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">👤</div>
                        <div>
                            <h4 className="text-xl font-black uppercase italic">Freelance</h4>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Designers • Devs • Writers</p>
                        </div>
                    </div>
                    <ul className="space-y-4 text-sm text-zinc-400">
                        <li className="flex gap-2"><span className="text-blue-500">✓</span> Send professional crypto invoices</li>
                        <li className="flex gap-2"><span className="text-blue-500">✓</span> No cross-border fees or delays</li>
                        <li className="flex gap-2"><span className="text-blue-500">✓</span> Direct wallet-to-wallet settlement</li>
                        <li className="flex gap-2"><span className="text-blue-500">✓</span> Client gets instant receipt</li>
                    </ul>
                </div>

                <div className="bg-zinc-900/20 border border-white/10 rounded-[30px] p-8 hover:bg-zinc-900/40 transition-all">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">📦</div>
                        <div>
                            <h4 className="text-xl font-black uppercase italic">Digital Shop</h4>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Creators • Sellers</p>
                        </div>
                    </div>
                    <ul className="space-y-4 text-sm text-zinc-400">
                        <li className="flex gap-2"><span className="text-purple-500">✓</span> Sell Files, Codes, or Secret Links</li>
                        <li className="flex gap-2"><span className="text-purple-500">✓</span> Automated delivery after payment</li>
                        <li className="flex gap-2"><span className="text-purple-500">✓</span> Viral Affiliate System included</li>
                        <li className="flex gap-2"><span className="text-purple-500">✓</span> 100% Non-custodial</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      <section ref={featuresRef} className="py-32 px-6 relative overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
            
            <div className="flex-1 text-left">
                <h2 className="text-green-500 text-sm font-black uppercase tracking-[5px] mb-3">Why PayOnce?</h2>
                <h3 className="text-3xl md:text-5xl font-black uppercase italic text-white mb-8 leading-tight">Built for the <br/>Sovereign Creator.</h3>
                
                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
                        </div>
                        <div>
                            <h5 className="text-lg font-black uppercase italic mb-1">0% Commission</h5>
                            <p className="text-zinc-500 text-sm max-w-sm">We don't take a cut. You keep 100% of your sales. (Only standard network fees apply).</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <div>
                            <h5 className="text-lg font-black uppercase italic mb-1">Viral Affiliate Mode</h5>
                            <p className="text-zinc-500 text-sm max-w-sm">Enable "Viral Mode" to let others sell for you. They get 10% automatically, you get sales.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative">
                <div className="relative z-10 bg-[#121214] border border-white/10 rounded-[30px] p-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                         <div className="flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-500"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                             <div className="w-3 h-3 rounded-full bg-green-500"></div>
                         </div>
                         <div className="text-[10px] font-mono text-zinc-500">SECURE_PAYMENT.ENC</div>
                    </div>
                    <div className="space-y-4">
                         <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
                         <div className="h-4 bg-zinc-800 rounded w-1/2 animate-pulse"></div>
                         <div className="h-20 bg-green-900/20 rounded border border-green-500/20 flex items-center justify-center text-green-500 font-mono text-xs">
                             Waiting for Payment...
                         </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-green-500/20 blur-[60px] -z-10"></div>
            </div>

         </div>
      </section>

      <section ref={devRef} className="py-24 px-6 border-t border-white/5 bg-zinc-900/20 relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1">
                  <div className="inline-block bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-green-500/20">
                      For Developers
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase italic text-white mb-6 leading-none">
                      Integration in <br/> <span className="text-zinc-500">Milliseconds.</span>
                  </h2>
                  <p className="text-zinc-400 text-lg mb-8 leading-relaxed max-w-xl">
                      Embed non-custodial checkout buttons into your app, game, or website with a single line of code. Zero backend required.
                  </p>
                  <div className="flex gap-4">
                      <Link href="/developers">
                          <button className="bg-white text-black font-black uppercase px-8 py-4 rounded-xl hover:bg-green-500 transition-all shadow-lg">
                              Get the SDK
                          </button>
                      </Link>
                  </div>
              </div>
              <div className="flex-1 w-full max-w-lg">
                  <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 font-mono text-xs shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-100 transition-opacity">
                          <div className="text-[10px] text-zinc-500 uppercase font-bold">React / Next.js</div>
                      </div>
                      <div className="flex gap-2 mb-6">
                         <div className="w-3 h-3 rounded-full bg-red-500"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                         <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="space-y-2 text-zinc-400">
                          <div><span className="text-purple-400">import</span> {'{ PayButton }'} <span className="text-purple-400">from</span> <span className="text-green-400">'@payonce/sdk'</span>;</div>
                          <br/>
                          <div><span className="text-blue-400">export default</span> <span className="text-purple-400">function</span> <span className="text-yellow-200">App</span>() {'{'}</div>
                          <div className="pl-4"><span className="text-purple-400">return</span> (</div>
                          <div className="pl-8 text-white">{'<PayButton'}</div>
                          <div className="pl-12 text-blue-300">to=<span className="text-green-400">"bitcoincash:qp..."</span></div>
                          <div className="pl-12 text-blue-300">amount=<span className="text-orange-400">{10}</span></div>
                          <div className="pl-12 text-blue-300">onSuccess=<span className="text-yellow-200">{'{deliverAsset}'}</span></div>
                          <div className="pl-8 text-white">{'/>'}</div>
                          <div className="pl-4">);</div>
                          <div>{'}'}</div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section className="py-20 px-6">
         <div className="max-w-5xl mx-auto bg-gradient-to-r from-green-600 to-green-500 rounded-[50px] p-12 md:p-20 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-black uppercase italic tracking-tighter mb-8 leading-none">
                    Start Your Economy
                </h2>
                <Link href="/create">
                    <button className="bg-black text-white px-12 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl">
                        CREATE LINK
                    </button>
                </Link>
            </div>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/10 rounded-full blur-3xl group-hover:bg-black/20 transition-all"></div>
         </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center">
         <div className="flex justify-center gap-8 mb-8 text-zinc-500">
            <a href="https://x.com/PayOnceCash" target="_blank" className="hover:text-green-500 transition-colors"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
            <a href="https://t.me/PayOnceCash" target="_blank" className="hover:text-green-500 transition-colors"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg></a>
         </div>
         <p className="text-[10px] font-black uppercase tracking-[4px] text-zinc-700">
            PayOnce.cash • Powered by Bitcoin Cash
         </p>
      </footer>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
