'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function UnlockContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPaid, setIsPaid] = useState(false);
  const [checking, setChecking] = useState(false);
  const [data, setData] = useState(null);
  const [bchPrice, setBchPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [qrMode, setQrMode] = useState('smart');
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      try {
        const decoded = JSON.parse(atob(id));
        setData(decoded);
      } catch (e) { setError("Invalid Link"); }
    }
  }, [searchParams]);

  useEffect(() => {
    if (data?.p) {
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd')
        .then(res => res.json())
        .then(json => {
          setBchPrice((parseFloat(data.p) / json['bitcoin-cash'].usd).toFixed(8));
          setLoadingPrice(false);
        }).catch(() => setLoadingPrice(false));
    }
  }, [data]);

  useEffect(() => {
    let interval;
    if (checking && !isPaid && data?.w) {
      const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
      interval = setInterval(async () => {
        try {
          const res = await fetch(`https://rest.mainnet.cash/v1/address/balance/${cleanAddr}`);
          const bal = await res.json();
          if (bal.unconfirmed > 0 || bal.confirmed > 0) {
            setIsPaid(true);
            setChecking(false);
          }
        } catch (err) { console.error(err); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [checking, isPaid, data]);

  if (error) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black">{error}</div>;
  if (!data) return <div className="min-h-screen bg-black text-white flex justify-center items-center animate-pulse font-black italic">INITIALIZING TERMINAL...</div>;

  const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
  const smartLink = `bitcoincash:${cleanAddr}?amount=${bchPrice}`;
  const addressOnlyLink = cleanAddr;

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-8 font-sans">
      {!isPaid ? (
        <div className="w-full max-w-md bg-[#18181b] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          {data.a && <div className="absolute -right-12 top-6 bg-green-600 text-black text-[8px] font-black px-12 py-1 rotate-45 uppercase">Viral Mode Active</div>}
          
          <div className="text-center mb-6 text-2xl font-black italic tracking-tighter uppercase">{data.n}</div>

          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.15)]">
              {!loadingPrice ? (
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrMode === 'smart' ? smartLink : addressOnlyLink)}`} alt="QR" className="w-[180px] h-[180px]" />
              ) : <div className="w-[180px] h-[180px] bg-zinc-800 animate-pulse rounded-2xl"></div>}
            </div>

            <div className="flex bg-black rounded-full mt-4 p-1 border border-white/10">
              <button onClick={() => setQrMode('smart')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${qrMode === 'smart' ? 'bg-green-600 text-black' : 'text-zinc-500'}`}>Smart Pay</button>
              <button onClick={() => setQrMode('address')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${qrMode === 'address' ? 'bg-green-600 text-black' : 'text-zinc-500'}`}>Address Only</button>
            </div>
            
            <div className="mt-4 w-full flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/5">
              <code className="flex-1 text-[9px] text-zinc-400 truncate ml-2 font-mono">{cleanAddr}</code>
              <button onClick={() => {navigator.clipboard.writeText(cleanAddr); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="bg-zinc-800 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border border-white/10">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="text-center mb-6 py-4 bg-zinc-900/50 rounded-2xl border border-white/5 relative">
            <p className="text-[9px] text-zinc-500 font-black uppercase mb-1 font-mono">${data.p} USD</p>
            <p className="text-3xl font-black text-green-500 tracking-tight">{bchPrice} <span className="text-sm font-light">BCH</span></p>
          </div>

          <button onClick={() => setChecking(true)} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl transition-all shadow-xl uppercase mb-4 text-lg">
            {checking ? 'Verifying...' : 'Verify Payment'}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-[#18181b] p-10 rounded-3xl border border-green-500/30 text-center shadow-2xl">
           <h1 className="text-3xl font-black mb-2 text-white italic uppercase tracking-tighter">Access Granted</h1>
           <p className="text-zinc-400 text-[10px] mb-8 uppercase tracking-widest font-bold">Secure IPFS Delivery ✅</p>
           
           <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="w-full bg-green-600 text-black py-5 rounded-2xl font-black block hover:bg-green-500 transition-all uppercase mb-8 shadow-xl">
             Download File ⚡
           </a>

           {!rating ? (
             <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
               <p className="text-[9px] text-zinc-500 uppercase font-black mb-3">Rate your experience</p>
               <div className="flex justify-center gap-4">
                 <button onClick={() => setRating('pos')} className="flex-1 p-3 bg-zinc-800 hover:bg-green-500/20 rounded-xl transition-all text-[10px] font-bold uppercase border border-white/5">👍 Trusted</button>
                 <button onClick={() => setRating('neg')} className="flex-1 p-3 bg-zinc-800 hover:bg-red-500/20 rounded-xl transition-all text-[10px] font-bold uppercase border border-white/5">👎 Avoid</button>
               </div>
             </div>
           ) : (
             <div className="py-2 bg-green-500/10 rounded-xl border border-green-500/20 animate-pulse">
                <p className="text-green-500 font-black text-[10px] uppercase">Feedback Recorded</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
}

export default function UnlockPage() {
  return <Suspense fallback={<div>Loading...</div>}><UnlockContent /></Suspense>;
}
