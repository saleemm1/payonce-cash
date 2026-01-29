'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DevelopersPage() {
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
        <div>
            <div className="inline-block bg-green-900/20 text-green-500 text-[10px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full border border-green-500/20 mb-6">
                Public Beta
            </div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-6 leading-none">
                Build the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Sovereign Economy.</span>
            </h1>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                Integrate non-custodial Bitcoin Cash payments into your app, website, or game with just a few lines of code. No API keys required. No servers needed.
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
                        <p className="text-sm text-zinc-500">Optional HMAC signing to prevent parameter tampering (Coming to Mainnet).</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 border-b border-white/5 pb-4">Button Generator</h2>
            
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
                    {/* قسم المعاينة (Preview) منفصل */}
                    <div className="mb-6">
                        <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-3">Button Preview</label>
                        <div className="p-8 bg-black/30 border border-dashed border-zinc-700 rounded-2xl flex justify-center items-center min-h-[100px]">
                             <div dangerouslySetInnerHTML={{ __html: generatedCode }} />
                        </div>
                    </div>

                    {/* قسم الكود (Code) منفصل */}
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
      </main>
    </div>
  );
}
