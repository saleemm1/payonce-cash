'use client';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function AffiliateContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const [promoterWallet, setPromoterWallet] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!productId || !promoterWallet) return;
    
    const link = `${window.location.origin}/unlock?id=${productId}&ref=${promoterWallet}`;
    setAffiliateLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!productId) return <div className="text-white text-center mt-20">Invalid Product ID</div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#18181b] p-8 rounded-3xl border border-green-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 blur-[50px]"></div>
        
        <h1 className="text-3xl font-black text-center mb-2 uppercase italic">Viral Partner 🚀</h1>
        <p className="text-center text-zinc-400 text-xs mb-8">Promote this product and earn commissions instantly.</p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2">Your BCH Wallet (For Payouts)</label>
            <input 
              required 
              type="text" 
              value={promoterWallet}
              onChange={(e) => setPromoterWallet(e.target.value)}
              placeholder="bitcoincash:qz..." 
              className="w-full p-4 bg-black border border-zinc-800 rounded-xl text-white outline-none focus:border-green-500 font-mono text-sm"
            />
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-black uppercase text-black transition-all shadow-lg">
            Generate My Link
          </button>
        </form>

        {affiliateLink && (
          <div className="mt-8 bg-black/50 p-4 rounded-xl border border-green-500/50 animate-in fade-in slide-in-from-bottom-4">
            <p className="text-[10px] text-green-500 font-black uppercase mb-2">Your Unique Viral Link</p>
            <code className="block text-[10px] text-zinc-300 break-all bg-zinc-900 p-2 rounded-lg mb-4 select-all">
              {affiliateLink}
            </code>
            <button onClick={copyToClipboard} className="w-full bg-white text-black py-2 rounded-lg font-bold uppercase text-xs hover:bg-zinc-200">
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AffiliatePage() {
  return <Suspense fallback={<div>Loading...</div>}><AffiliateContent /></Suspense>;
}
