'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AffiliateContent() {
  const searchParams = useSearchParams();
  const urlProduct = searchParams.get('product'); 
  
  const [originalLink, setOriginalLink] = useState('');
  const [promoterWallet, setPromoterWallet] = useState('');
  const [viralLink, setViralLink] = useState('');
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (urlProduct) {
        setOriginalLink(`${window.location.origin}/unlock?id=${urlProduct}`);
    }
  }, [urlProduct]);

  useEffect(() => {
    if (!originalLink) {
        setProductData(null);
        setError('');
        return;
    }

    try {
        let idParam = '';
        if (originalLink.includes('id=')) {
            const urlObj = new URL(originalLink);
            idParam = urlObj.searchParams.get('id');
        } else {
            idParam = originalLink; 
        }

        if (!idParam) throw new Error("Invalid Link");

        const decoded = JSON.parse(decodeURIComponent(escape(atob(idParam))));
        
        if (!decoded.a) { 
            throw new Error("Viral Mode is DISABLED by the creator for this product.");
        }

        setProductData(decoded);
        setError('');
    } catch (e) {
        setProductData(null);
        setError("Invalid Link or Viral Mode not active.");
    }
  }, [originalLink]);

  const generateViralLink = (e) => {
    e.preventDefault();
    if (!productData || !promoterWallet) return;

    try {
        const newPayload = {
            ...productData,
            aff: promoterWallet 
        };

        const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(newPayload))));
        const newUrl = `${window.location.origin}/unlock?id=${encodedId}`;
        setViralLink(newUrl);
    } catch (e) {
        alert("Error generating link");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center py-20 px-6 font-sans">
      
      <div className="text-center max-w-2xl mb-12">
        <div className="inline-block bg-green-900/20 text-green-500 text-[10px] font-black uppercase tracking-[4px] px-4 py-2 rounded-full border border-green-500/20 mb-6">
            Permissionless Growth
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
          Become a <span className="text-green-500">Partner</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto">
          Promote any PayOnce product and earn instant crypto commissions directly to your wallet. No sign-up required.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-[#18181b] border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[80px] -z-10"></div>

        <div className="space-y-8">
            <div>
                <label className="text-[11px] text-zinc-500 font-black uppercase tracking-wider mb-2 block">1. Paste Product Link</label>
                <input 
                    type="text" 
                    value={originalLink}
                    onChange={(e) => setOriginalLink(e.target.value)}
                    placeholder="https://payonce.cash/unlock?id=..." 
                    className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-green-500 transition-all font-mono text-xs"
                />
                {error && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">⚠️ {error}</p>}
                
                {productData && !error && (
                    <div className="mt-4 bg-green-900/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-4 animate-fade-in">
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center text-xl">
                            🎁
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">{productData.n || 'Unknown Product'}</h4>
                            <div className="flex gap-3 text-[10px] text-green-400 font-mono mt-1">
                                <span>💰 Price: ${productData.p}</span>
                                <span>🚀 Commission: 10%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={`transition-all duration-500 ${productData ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 blur-sm pointer-events-none'}`}>
                <label className="text-[11px] text-zinc-500 font-black uppercase tracking-wider mb-2 block">2. Your Wallet Address (For Payouts)</label>
                <input 
                    type="text" 
                    value={promoterWallet}
                    onChange={(e) => setPromoterWallet(e.target.value)}
                    placeholder="bitcoincash:qpm2q..." 
                    className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-green-500 transition-all font-mono text-xs"
                />
            </div>

            <button 
                onClick={generateViralLink}
                disabled={!productData || !promoterWallet}
                className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl text-xl uppercase italic shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:shadow-[0_0_60px_rgba(34,197,94,0.5)] transition-all disabled:opacity-50 disabled:shadow-none"
            >
                Generate Viral Link 🚀
            </button>

            {viralLink && (
                <div className="mt-8 pt-8 border-t border-white/5 animate-fade-in-up">
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest text-center mb-4">Your Unique Affiliate Link</p>
                    <div className="bg-black p-2 rounded-2xl border border-green-500/50 flex gap-2">
                        <input readOnly value={viralLink} className="flex-1 bg-transparent p-3 text-green-500 font-mono text-xs outline-none" />
                        <button 
                            onClick={() => {navigator.clipboard.writeText(viralLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} 
                            className="bg-green-600 hover:bg-green-500 text-black px-6 rounded-xl font-bold uppercase text-xs transition-all"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-zinc-600 mt-4 max-w-md mx-auto leading-relaxed">
                        Share this link. When someone buys, the smart contract automatically routes 10% of the sale directly to your wallet instantly.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default function AffiliatePage() {
  return <Suspense fallback={null}><AffiliateContent /></Suspense>;
}
