'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState('generator');
  const [wallet, setWallet] = useState('');
  const [price, setPrice] = useState('10');
  const [productName, setProductName] = useState('My Product');
  const [secret, setSecret] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    if (!wallet) return alert('Please enter a BCH wallet address');
    
    const payload = {
        w: wallet,
        p: price,
        n: productName,
        dt: 'invoice',
        sec: secret ? `hmac_sha256_${secret.substring(0, 4)}...` : null
    };
    
    const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://payonce-cash.vercel.app'}/unlock?id=${encodedId}`;
    
    const code = `<a href="${url}" target="_blank" style="background-color: #22c55e; color: black; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-family: sans-serif; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(34,197,94,0.3); transition: transform 0.2s ease;">
  <span>⚡ Pay with BCH</span>
</a>`;
    
    setGeneratedCode(code);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sdkExample = `// 📦 1. Install the package
// npm install @payonce/sdk

import { PayOnce } from '@payonce/sdk';

// 2. Server-Side: Create a secure signature
const { url, signature } = await PayOnce.createInvoice({
  wallet: "bitcoincash:qrz...", 
  price: 15.00,
  product: "Premium Asset",
  secretKey: process.env.PAYONCE_SECRET
});

// 3. Client-Side: Render the button
return <PayOnceButton url={url} />;`;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30">
      <nav className="border-b border-white/5 py-6 px-6 flex justify-between items-center max-w-7xl mx-auto">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 font-black text-xs border border-green-500/20">{`</>`}</div>
            <span className="font-bold text-lg tracking-tight">PayOnce <span className="text-zinc-500">Developers</span></span>
         </div>
         <Link href="/">
            <button className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">Back to Home</button>
         </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left Column: Hero & Info */}
        <div>
            <div className="inline-block bg-green-900/20 text-green-500 text-[10px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full border border-green-500/20 mb-6">
                Public Beta
            </div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-6 leading-none">
                Build the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Sovereign Economy.</span>
            </h1>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                Integrate non-custodial Bitcoin Cash payments into your app, website, or game. Choose the No-Code generator for simple links, or the SDK for dynamic scale.
            </p>

            <div className="space-y-8">
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 shrink-0">1</div>
                    <div>
                        <h3 className="font-bold text-white mb-1">Client-Side Logic</h3>
                        <p className="text-sm text-zinc-500">Generate payment links directly in the browser. Zero backend dependency.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 shrink-0">2</div>
                    <div>
                        <h3 className="font-bold text-white mb-1">Instant Settlement</h3>
                        <p className="text-sm text-zinc-500">Funds go directly to your wallet address. We never touch the money.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 shrink-0">3</div>
                    <div>
                        <h3 className="font-bold text-white mb-1">Cryptographic Proof</h3>
                        <p className="text-sm text-zinc-500">HMAC signing ensures price integrity on the client side.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Interactive Card */}
        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 shadow-2xl h-fit">
            
            {/* Tabs */}
            <div className="flex bg-black/50 rounded-xl p-1 mb-8 border border-white/5">
                <button 
                    onClick={() => setActiveTab('generator')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wide rounded-lg transition-all ${activeTab === 'generator' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                >
                    No-Code Generator
                </button>
                <button 
                    onClick={() => setActiveTab('sdk')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wide rounded-lg transition-all ${activeTab === 'sdk' ? 'bg-green-500/10 text-green-500 border border-green-500/20 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                >
                    NPM SDK (Pro)
                </button>
            </div>

            {/* TAB 1: GENERATOR */}
            {activeTab === 'generator' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Your BCH Wallet Address</label>
                            <input type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="bitcoincash:qp..." className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-green-500 transition-colors" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Product Name</label>
                                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-green-500 transition-colors" />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Price (USD)</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-green-500 transition-colors" />
                            </div>
                        </div>

                        <div className="bg-green-900/10 p-4 rounded-xl border border-green-500/20 mt-2">
                            <div className="flex items-center justify-between mb-2">
                                 <label className="text-[10px] uppercase font-black text-green-500 flex items-center gap-1">
                                    🔒 Tamper Protection
                                 </label>
                                 <span className="text-[9px] text-zinc-500">Optional</span>
                            </div>
                            <input 
                                type="password" 
                                value={secret} 
                                onChange={(e) => setSecret(e.target.value)} 
                                placeholder="Enter Secret Key (e.g. sk_live_...)" 
                                className="w-full bg-black/50 border border-green-500/20 rounded-lg p-2 text-xs text-white outline-none focus:border-green-500 transition-colors font-mono tracking-widest" 
                            />
                            <p className="text-[9px] text-zinc-600 mt-2 leading-tight">
                                Adds a signature to the payload to prevent client-side price modification.
                            </p>
                        </div>

                        <button onClick={generateCode} className="w-full bg-white text-black font-black uppercase py-3 rounded-xl hover:bg-green-500 hover:scale-[1.02] transition-all shadow-xl">
                            Generate Embed Code
                        </button>
                    </div>

                    {generatedCode && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 mt-8 pt-8 border-t border-white/5">
                            <div className="mb-6">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-3">Button Preview</label>
                                <div className="p-8 bg-black/30 border border-dashed border-zinc-700 rounded-2xl flex justify-center items-center min-h-[100px]">
                                     <div dangerouslySetInnerHTML={{ __html: generatedCode }} />
                                </div>
                            </div>

                            <div className="relative">
                                 <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">HTML Embed Code</label>
                                 <div className="bg-black rounded-xl border border-white/10 relative group overflow-hidden">
                                    <textarea 
                                        readOnly 
                                        value={generatedCode} 
                                        className="w-full bg-[#080808] text-zinc-400 text-xs font-mono h-32 p-4 resize-none outline-none leading-relaxed"
                                        onClick={(e) => e.target.select()}
                                    />
                                    <button 
                                        onClick={handleCopy} 
                                        className={`absolute top-3 right-3 text-[10px] font-bold px-4 py-2 rounded-lg transition-all shadow-lg z-10 ${copied ? 'bg-green-500 text-black' : 'bg-zinc-800 text-white hover:bg-white hover:text-black'}`}
                                    >
                                        {copied ? 'COPIED!' : 'COPY CODE'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: SDK (PRO) */}
            {activeTab === 'sdk' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="mb-6 text-center">
                        <div className="inline-block p-3 bg-zinc-900 rounded-full mb-3 text-2xl">📦</div>
                        <h3 className="text-lg font-bold text-white">Dynamic Integration</h3>
                        <p className="text-zinc-500 text-xs mt-1">For e-commerce, SaaS, and marketplaces.</p>
                    </div>

                    <div className="bg-black/80 rounded-xl border border-white/10 overflow-hidden relative group">
                        <div className="bg-[#1a1a1a] px-4 py-2 border-b border-white/5 flex items-center gap-2">
                             <div className="flex gap-1.5">
                                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                             </div>
                             <span className="text-[10px] text-zinc-500 font-mono ml-2">integration.js</span>
                        </div>
                        <textarea 
                            readOnly 
                            value={sdkExample} 
                            className="w-full bg-transparent text-zinc-300 text-xs font-mono h-[300px] p-4 resize-none outline-none leading-relaxed selection:bg-green-500/30"
                        />
                        <div className="absolute top-10 right-4">
                             <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-500/20">v1.0.2</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                        <button className="flex-1 bg-white text-black font-black uppercase py-3 rounded-xl hover:bg-zinc-200 transition-colors text-xs">
                           Read Full Docs
                        </button>
                        <button className="flex-1 border border-white/20 text-white font-black uppercase py-3 rounded-xl hover:bg-white/5 transition-colors text-xs">
                           View on NPM
                        </button>
                    </div>
                </div>
            )}

        </div>
      </main>
    </div>
  );
}
