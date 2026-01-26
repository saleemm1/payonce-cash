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

  if (!productId) return <div className="text-white text-center mt-20 font-black uppercase tracking-widest animate-pulse">Access Denied: No Product ID</div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#18181b] p-8 rounded-[2.5rem] border border-green-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 blur-[50px]"></div>
        
        <h1 className="text-3xl font-black text-center mb-2 uppercase italic tracking-tighter">Viral Partner 🚀</h1>
        <p className="text-center text-zinc-500 text-[10px] mb-8 uppercase font-bold tracking-widest">Promote & Earn 10% Commission Instantly</p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 mb-2 block">Receiving BCH Wallet</label>
            <input 
              required 
              type="text" 
              value={promoterWallet}
              onChange={(e) => setPromoterWallet(e.target.value)}
              placeholder="bitcoincash:q..." 
              className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-white outline-none focus:border-green-500 font-mono text-xs transition-all"
            />
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-5 rounded-2xl font-black uppercase text-black transition-all shadow-xl shadow-green-900/10 active:scale-95">
            Activate My Link
          </button>
        </form>

        {affiliateLink && (
          <div className="mt-8 bg-black/50 p-5 rounded-3xl border border-green-500/30 animate-in fade-in slide-in-from-bottom-4">
            <p className="text-[9px] text-green-500 font-black uppercase mb-3 tracking-widest">Your Unique Referral Link</p>
            <code className="block text-[9px] text-zinc-400 break-all bg-zinc-900/80 p-3 rounded-xl mb-4 select-all font-mono leading-relaxed border border-white/5">
              {affiliateLink}
            </code>
            <button onClick={copyToClipboard} className="w-full bg-white text-black py-3 rounded-xl font-black uppercase text-[10px] hover:bg-zinc-200 transition-all active:scale-95">
              {copied ? 'Copied Successfully' : 'Copy Viral Link'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AffiliatePage() {
  return <Suspense fallback={null}><AffiliateContent /></Suspense>;
}
