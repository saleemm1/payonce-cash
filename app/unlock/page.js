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
  const [viralMethod, setViralMethod] = useState('smart');
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(id))));
        setData(decoded);
      } catch (e) {
        setError("Invalid Secure Link");
      }
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

  if (error) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black uppercase tracking-tighter">{error}</div>;
  if (!data) return <div className="min-h-screen bg-black text-white flex justify-center items-center animate-pulse font-black italic tracking-[10px]">LOADING...</div>;

  const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
  const affiliateAddr = searchParams.get('ref');
  const isViral = data.a && affiliateAddr && (affiliateAddr !== cleanAddr);

  const discountTotal = bchPrice ? (parseFloat(bchPrice) * 0.95).toFixed(8) : "0";
  const sellerAmt = (parseFloat(discountTotal) * 0.9).toFixed(8);
  const affAmt = (parseFloat(discountTotal) * 0.1).toFixed(8);

  const standardLink = `bitcoincash:${cleanAddr}?amount=${bchPrice}`;
  const smartViralLink = `bitcoincash:${cleanAddr}?amount=${sellerAmt}&address=${affiliateAddr}&amount=${affAmt}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white flex flex-col items-center justify-center px-4 py-8 font-sans">
      {!isPaid ? (
        <div className="w-full max-w-md bg-[#16161a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {isViral && (
            <div className="absolute -right-12 top-6 bg-green-600 text-black text-[8px] font-black px-12 py-1 rotate-45 uppercase shadow-2xl">5% Discount</div>
          )}
          
          <div className="flex flex-col items-center mb-6 text-center">
             {data.cn && (
               <div className="mb-4 bg-green-600/10 border border-green-500/20 px-4 py-1 rounded-full">
                 <span className="text-[10px] text-green-500 font-black uppercase italic">Personal Bill: {data.cn}</span>
               </div>
             )}
             {data.pr && (
               <img src={data.pr} className="w-full h-44 object-cover rounded-3xl mb-4 border border-white/5" alt="Preview" />
             )}
             <h1 className="text-2xl font-black italic uppercase tracking-tighter">{data.n}</h1>
             {data.d && <p className="text-zinc-500 text-[11px] mt-2 px-6 leading-relaxed italic">{data.d}</p>}
             
             <div className="mt-6 flex flex-col items-center bg-black/30 p-4 rounded-2xl border border-white/5 w-full">
                <div className="flex flex-col items-center mb-2">
                   <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mb-1">Support Seller</span>
                   <span className="text-sm font-black text-white uppercase italic tracking-tight underline decoration-green-500/50 underline-offset-4">{data.sn}</span>
                </div>
                <div className="flex flex-col items-center">
                   <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mb-1">Name Seller</span>
                   <span className="text-[10px] font-mono font-bold text-green-500/80">{data.se}</span>
                </div>
             </div>
          </div>

          {isViral && (
            <div className="mb-6 bg-black/40 p-1 rounded-2xl border border-white/5 flex">
               <button onClick={() => setViralMethod('smart')} className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${viralMethod === 'smart' ? 'bg-green-600 text-black shadow-inner' : 'text-zinc-500'}`}>Option A: Smart</button>
               <button onClick={() => setViralMethod('manual')} className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${viralMethod === 'manual' ? 'bg-green-600 text-black shadow-inner' : 'text-zinc-500'}`}>Option B: Manual</button>
            </div>
          )}

          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-4 rounded-[2rem] shadow-[0_0_50px_rgba(34,197,94,0.15)] relative">
              {!loadingPrice ? (
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    isViral 
                      ? (viralMethod === 'smart' ? smartViralLink : cleanAddr) 
                      : (qrMode === 'smart' ? standardLink : cleanAddr)
                  )}`} 
                  alt="QR" className="w-[170px] h-[170px]" 
                />
              ) : <div className="w-[170px] h-[170px] bg-zinc-800 animate-pulse rounded-2xl"></div>}
              {checking && (
                 <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center border-2 border-green-500/50">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-[8px] font-black text-green-500 uppercase">Scanning...</p>
                 </div>
              )}
            </div>

            {isViral && viralMethod === 'manual' ? (
              <div className="mt-5 w-full space-y-2 animate-in slide-in-from-top-2">
                 <div className="bg-black/60 p-3 rounded-xl border border-white/5">
                    <p className="text-[7px] font-black text-zinc-500 uppercase mb-1 italic">1. First Wallet (Seller)</p>
                    <p className="text-[8px] text-zinc-400 mb-2">Send exactly {sellerAmt} BCH to:</p>
                    <div className="flex justify-between items-center bg-zinc-900/50 p-2 rounded-lg">
                       <code className="text-[9px] text-green-500 font-bold truncate flex-1">{cleanAddr}</code>
                       <button onClick={() => copyToClipboard(cleanAddr)} className="text-[8px] bg-zinc-800 px-2 py-1 rounded text-white uppercase font-black ml-2">Copy</button>
                    </div>
                 </div>
                 <div className="bg-black/60 p-3 rounded-xl border border-white/5">
                    <p className="text-[7px] font-black text-zinc-500 uppercase mb-1 italic">2. Second Wallet (Promoter)</p>
                    <p className="text-[8px] text-zinc-400 mb-2">Send exactly {affAmt} BCH to:</p>
                    <div className="flex justify-between items-center bg-zinc-900/50 p-2 rounded-lg">
                       <code className="text-[9px] text-green-500 font-bold truncate flex-1">{affiliateAddr}</code>
                       <button onClick={() => copyToClipboard(affiliateAddr)} className="text-[8px] bg-zinc-800 px-2 py-1 rounded text-white uppercase font-black ml-2">Copy</button>
                    </div>
                 </div>
              </div>
            ) : (
              <>
                <div className="flex bg-black rounded-full mt-5 p-1 border border-white/5 shadow-inner">
                  <button onClick={() => setQrMode('smart')} className={`px-5 py-2 rounded-full text-[9px] font-black uppercase transition-all ${qrMode === 'smart' ? 'bg-green-600 text-black shadow-lg' : 'text-zinc-500'}`}>Smart Pay</button>
                  <button onClick={() => setQrMode('address')} className={`px-5 py-2 rounded-full text-[9px] font-black uppercase transition-all ${qrMode === 'address' ? 'bg-green-600 text-black shadow-lg' : 'text-zinc-500'}`}>Address</button>
                </div>
                
                <div className="mt-5 w-full flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/5">
                  <code className="flex-1 text-[9px] text-zinc-600 truncate ml-2 font-mono">{cleanAddr}</code>
                  <button onClick={() => copyToClipboard(cleanAddr)} className="bg-zinc-800 px-4 py-2 rounded-lg text-[9px] font-black uppercase active:scale-95 transition-all">
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="text-center mb-6 py-5 bg-zinc-900/50 rounded-3xl border border-white/5 relative overflow-hidden">
            <p className="text-[9px] text-zinc-500 font-black uppercase mb-1 font-mono tracking-widest">
              {isViral ? (
                <>
                  <span className="line-through opacity-50 text-red-400">${data.p} USD</span>
                  <span className="ml-2 text-green-500">→ ${(data.p * 0.95).toFixed(2)} USD</span>
                </>
              ) : `$${data.p} USD`}
            </p>
            <p className="text-4xl font-black text-green-500 tracking-tighter">{isViral ? discountTotal : bchPrice} <span className="text-sm font-light">BCH</span></p>
            {isViral && (
              <div className="mt-2 px-4">
                <p className="text-[7px] text-green-500/80 font-black uppercase tracking-[0.1em] leading-tight">
                  Promoter Link Applied: 5% Discount granted for split support.
                </p>
              </div>
            )}
          </div>

          <button onClick={() => setChecking(true)} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-[1.5rem] transition-all uppercase tracking-tighter text-xl active:scale-95 mb-4 shadow-xl shadow-green-900/20">
            {checking ? 'Awaiting Payment...' : 'Verify Transaction'}
          </button>

          {data.a && !affiliateAddr && (
            <button onClick={() => router.push(`/affiliate?product=${searchParams.get('id')}`)} className="w-full bg-white/5 text-zinc-400 py-3 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest">
              🚀 Earn 10% to promote this
            </button>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md bg-[#16161a] p-10 rounded-[3rem] border border-green-500/30 text-center shadow-2xl animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <span className="text-4xl">💎</span>
           </div>
           <h1 className="text-3xl font-black mb-1 italic uppercase tracking-tighter">Access Granted</h1>
           <p className="text-zinc-500 text-[10px] mb-8 uppercase tracking-[3px] font-bold">Successfully Decrypted</p>
           
           {data.dt === 'file' ? (
             <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="w-full bg-green-600 text-black py-5 rounded-2xl font-black block hover:bg-green-500 transition-all uppercase mb-8 shadow-xl text-lg">
               Download Asset ⚡
             </a>
           ) : (
             <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10 mb-8 break-all shadow-inner text-left">
               <p className="text-[10px] text-zinc-400 uppercase font-black mb-2">Unlocked Data:</p>
               <p className="text-green-500 font-mono text-sm leading-relaxed">{data.i}</p>
             </div>
           )}

           {!rating ? (
             <div className="bg-black/40 p-5 rounded-[2rem] border border-white/5 shadow-inner">
               <p className="text-[9px] text-zinc-500 uppercase font-black mb-4 tracking-widest text-center">Rate the Experience</p>
               <div className="flex justify-center gap-4">
                 <button onClick={() => setRating('pos')} className="flex-1 p-4 bg-zinc-900 hover:bg-green-500/20 rounded-2xl transition-all text-[10px] font-black uppercase border border-white/5 group">
                    <span className="block text-xl mb-1 group-hover:scale-125 transition-transform">👍</span> Trusted
                 </button>
                 <button onClick={() => setRating('neg')} className="flex-1 p-4 bg-zinc-900 hover:bg-red-500/20 rounded-2xl transition-all text-[10px] font-black uppercase border border-white/5 group">
                    <span className="block text-xl mb-1 group-hover:scale-125 transition-transform">👎</span> Avoid
                 </button>
               </div>
             </div>
           ) : (
             <div className="py-4 bg-green-600 text-black rounded-2xl font-black text-xs uppercase italic animate-bounce">
               Feedback Received
             </div>
           )}
        </div>
      )}
    </div>
  );
}

export default function UnlockPage() {
  return <Suspense fallback={null}><UnlockContent /></Suspense>;
}
