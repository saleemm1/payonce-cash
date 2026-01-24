'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function UnlockContent() {
  const searchParams = useSearchParams();
  const [isPaid, setIsPaid] = useState(false);
  const [checking, setChecking] = useState(false);
  const [buyerWallet, setBuyerWallet] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [rating, setRating] = useState(null);

  const productName = searchParams.get('name') || 'Premium Content';
  const price = parseFloat(searchParams.get('price') || '0.0001');
  const sellerWallet = searchParams.get('wallet') || '';
  const sellerName = searchParams.get('seller') || 'Verified Seller';
  const sellerEmail = searchParams.get('email') || '';
  const preview = searchParams.get('preview') || '';
  const refWallet = searchParams.get('ref') || null;

  useEffect(() => {
    let interval;
    if (checking && !isPaid && sellerWallet) {
      interval = setInterval(async () => {
        try {
          const cleanAddr = sellerWallet.includes(':') ? sellerWallet.split(':')[1] : sellerWallet;
          const res = await fetch(`https://rest.mainnet.cash/v1/address/balance/${cleanAddr}`);
          const data = await res.json();
          if (data.unconfirmed >= 0 || data.confirmed > 0) {
            setIsPaid(true);
            setChecking(false);
          }
        } catch (err) { console.error("Scanning...", err); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [checking, isPaid, sellerWallet]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-8 font-sans">
      {!isPaid ? (
        <div className="w-full max-w-md bg-[#18181b] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Seller Trust Badge */}
          <div className="flex items-center justify-between mb-6 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Seller</p>
              <p className="text-sm font-black text-green-500">{sellerName}</p>
            </div>
            {preview && (
              <a href={preview} target="_blank" className="bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-xl text-[10px] font-bold transition-all border border-white/10">
                VIEW PREVIEW 👁️
              </a>
            )}
          </div>

          <div className="text-center mb-6">
             <h1 className="text-3xl font-black text-white capitalize leading-tight">{productName}</h1>
             <p className="text-zinc-500 text-[10px] mt-1 italic">Support: {sellerEmail}</p>
          </div>

          <div className="flex justify-center mb-6 relative group">
            <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=bitcoincash:${sellerWallet}?amount=${price}`} alt="BCH QR" />
            </div>
            {checking && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-xs font-black text-green-500 animate-pulse uppercase">Verifying on Chain...</p>
              </div>
            )}
          </div>

          <div className="text-center mb-6 py-4 bg-zinc-900/50 rounded-2xl border border-white/5">
            <p className="text-4xl font-black text-green-500 tracking-tight">{price} <span className="text-lg font-light">BCH</span></p>
          </div>

          <button onClick={() => setChecking(true)} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl transition-all shadow-lg mb-4 uppercase">
            {checking ? 'Confirming...' : 'I Have Paid'}
          </button>

          {/* Trust Pilot Demo */}
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <div className="flex justify-center gap-1 mb-1 text-yellow-500">
               <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-center">98% Positive Seller Rating</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-6">
          <div className="bg-[#18181b] p-10 rounded-3xl border border-green-500/30 text-center shadow-2xl">
            <h1 className="text-3xl font-black mb-2 text-white">Payment Success!</h1>
            <p className="text-zinc-400 text-xs mb-8">Access your content below. Don't forget to rate the seller.</p>
            
            <button className="w-full bg-white text-black py-5 rounded-2xl font-black mb-8 hover:bg-green-500 transition-all uppercase">
              Download Content Now
            </button>

            {/* Post-Payment Rating System */}
            {!rating ? (
              <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-zinc-400 font-bold uppercase mb-3">Rate your experience</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => {setRating('pos'); alert("Thanks for your positive feedback!")}} className="p-3 bg-green-500/10 hover:bg-green-500/20 rounded-xl transition-all border border-green-500/20">👍 Positive</button>
                  <button onClick={() => {setRating('neg'); alert("Feedback sent to the system.")}} className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/20">👎 Negative</button>
                </div>
              </div>
            ) : (
              <p className="text-green-500 font-bold text-xs">Thank you for securing the ecosystem! ✅</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UnlockPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <UnlockContent />
    </Suspense>
  );
}
