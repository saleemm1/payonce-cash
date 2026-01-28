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
  const [qrMode, setQrMode] = useState('address');
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
    const fetchPrice = () => {
      if (data?.p) {
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd')
          .then(res => res.json())
          .then(json => {
            setBchPrice((parseFloat(data.p) / json['bitcoin-cash'].usd).toFixed(8));
            setLoadingPrice(false);
          })
          .catch(() => setLoadingPrice(false));
      }
    };
    fetchPrice();
    const priceInterval = setInterval(fetchPrice, 60000); 
    return () => clearInterval(priceInterval);
  }, [data]);

  useEffect(() => {
    let interval;
    if (checking && !isPaid && data?.w) {
      const sellerClean = data.w.includes(':') ? data.w.split(':')[1] : data.w;
      const affiliateAddr = searchParams.get('ref');
      const isViral = data.a && affiliateAddr && (affiliateAddr !== sellerClean);
      const affClean = affiliateAddr ? (affiliateAddr.includes(':') ? affiliateAddr.split(':')[1] : affiliateAddr) : null;

      interval = setInterval(async () => {
        try {
          const sRes = await fetch(`https://rest.mainnet.cash/v1/address/balance/${sellerClean}`);
          const sBal = await sRes.json();
          const sellerOk = sBal.unconfirmed > 0 || sBal.confirmed > 0;

          if (isViral && affClean) {
            const aRes = await fetch(`https://rest.mainnet.cash/v1/address/balance/${affClean}`);
            const aBal = await aRes.json();
            const promoterOk = aBal.unconfirmed > 0 || aBal.confirmed > 0;
            
            if (sellerOk && promoterOk) {
              setIsPaid(true);
              setChecking(false);
            }
          } else if (sellerOk) {
            setIsPaid(true);
            setChecking(false);
          }
        } catch (err) { console.error(err); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [checking, isPaid, data, searchParams]);

  if (error) return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-8 py-6 rounded-2xl font-black tracking-widest uppercase text-lg shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        {error}
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-[6px] border-zinc-800 border-t-green-500 rounded-full animate-spin"></div>
        <span className="text-zinc-500 font-black text-sm tracking-[0.4em] animate-pulse">DECRYPTING...</span>
      </div>
    </div>
  );

  const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
  const affiliateAddr = searchParams.get('ref');
  const isViral = data.a && affiliateAddr && (affiliateAddr !== cleanAddr);

  const discountTotal = bchPrice ? (parseFloat(bchPrice) * 0.95).toFixed(8) : "0";
  const sellerAmt = (parseFloat(discountTotal) * 0.9).toFixed(8);
  const affAmt = (parseFloat(discountTotal) * 0.1).toFixed(8);

  const standardLink = `bitcoincash:${cleanAddr}?amount=${bchPrice}`;
  const smartViralLink = `bitcoincash:${cleanAddr}?amount=${sellerAmt}&address=${affiliateAddr}&amount=${affAmt}`;
  
  const qrValue = isViral 
    ? smartViralLink 
    : (qrMode === 'smart' ? standardLink : cleanAddr);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-green-500/30">
      <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-green-900/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-emerald-900/5 blur-[120px] rounded-full pointer-events-none"></div>

      {!isPaid ? (
        <div className="w-full max-w-[520px] backdrop-blur-3xl bg-[#0f0f10]/90 rounded-[40px] border border-white/10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
          
          {isViral && (
            <div className="absolute -right-[50px] top-[40px] bg-green-500 text-black text-xs font-black px-14 py-2 rotate-45 shadow-xl z-20 tracking-widest border-2 border-black">
              -5% OFF
            </div>
          )}

          <div className="p-10 pb-4 flex flex-col items-center text-center">
             <div className="w-full flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                  <span className="text-[11px] text-green-500 font-black uppercase tracking-widest">Secure Checkout</span>
                </div>
                {data.cn && <span className="text-xs text-zinc-500 font-mono font-bold border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 rounded-lg">ID: {data.cn}</span>}
             </div>

             {data.pr && (
               <div className="w-full mb-8 relative group overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                  <img src={data.pr} className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Preview" />
                  <div className="absolute bottom-4 left-6 z-20 text-left">
                     <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">Item Name</p>
                     <p className="text-xl font-black text-white leading-none shadow-black drop-shadow-lg">{data.n}</p>
                  </div>
               </div>
             )}

             {!data.pr && (
                 <div className="mb-8 w-full">
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">{data.n}</h1>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">File Type:</span>
                        <span className="text-green-500 font-black uppercase">{data.fn ? data.fn.split('.').pop() : 'FILE'}</span>
                    </div>
                 </div>
             )}

             <div className="w-full bg-zinc-900/30 rounded-[2rem] p-6 border border-white/5 mb-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs text-zinc-500 font-black uppercase tracking-wider">Amount Due</span>
                  <span className="text-xs text-zinc-400 font-mono font-bold bg-black/30 px-2 py-1 rounded-md">
                     ≈ ${isViral ? (data.p * 0.95).toFixed(2) : data.p} USD
                  </span>
                </div>
                <div className="flex justify-between items-center">
                   <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">{isViral ? discountTotal : bchPrice}</span>
                      <span className="text-lg font-black text-green-500">BCH</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="px-10 pb-10">
            {!isViral && (
              <div className="flex p-1.5 bg-black/60 rounded-2xl border border-white/10 mb-8 shadow-inner">
                <button 
                  onClick={() => setQrMode('address')} 
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${qrMode === 'address' ? 'bg-[#1a1a1c] text-white shadow-lg border border-white/10' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  Address
                </button>
                <button 
                  onClick={() => setQrMode('smart')} 
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${qrMode === 'smart' ? 'bg-[#1a1a1c] text-white shadow-lg border border-white/10' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  Smart Pay
                </button>
              </div>
            )}

            <div className="flex flex-col items-center gap-6">
              {(!isViral || viralMethod === 'smart') && (
                <div className="bg-white p-5 rounded-[2.5rem] shadow-[0_0_60px_rgba(34,197,94,0.15)] relative w-full flex justify-center">
                   {!loadingPrice ? (
                     <img 
                       src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&bgcolor=ffffff&data=${encodeURIComponent(qrValue)}`} 
                       alt="QR Code" 
                       className="w-56 h-56 object-contain" 
                     />
                   ) : <div className="w-56 h-56 bg-zinc-100 animate-pulse rounded-2xl"></div>}
                   
                   {checking && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-[2.5rem] flex flex-col items-center justify-center border-4 border-green-500">
                         <div className="w-12 h-12 border-4 border-zinc-200 border-t-green-600 rounded-full animate-spin mb-3"></div>
                         <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Scanning Network</p>
                      </div>
                   )}
                </div>
              )}
              
              {!isViral && qrMode === 'address' && (
                <div className="w-full animate-in slide-in-from-top-4 fade-in duration-300">
                   <div className="flex items-center gap-3 bg-zinc-900/80 p-3 pl-5 rounded-2xl border border-white/10 shadow-lg group">
                     <code className="flex-1 text-xs text-zinc-300 font-mono truncate tracking-tight">{cleanAddr}</code>
                     <button 
                        onClick={() => copyToClipboard(cleanAddr)} 
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg active:scale-95 ${copied ? 'bg-green-500 text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                     >
                       {copied ? 'Copied' : 'Copy'}
                     </button>
                   </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setChecking(true)} 
              disabled={checking}
              className={`w-full mt-8 bg-white hover:bg-zinc-200 text-black font-black py-5 rounded-2xl transition-all duration-300 uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-[0.98] flex items-center justify-center gap-3 ${checking ? 'opacity-90 cursor-wait' : ''}`}
            >
              {checking ? (
                 <>
                   <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                   Processing...
                 </>
              ) : 'I Have Paid'}
            </button>

            {data.a && !affiliateAddr && (
              <button 
                onClick={() => router.push(`/affiliate?product=${searchParams.get('id')}`)} 
                className="w-full mt-4 flex items-center justify-center gap-2 text-zinc-500 hover:text-white py-2 transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
              >
                <span>🚀 Earn 10% Commission</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[500px] backdrop-blur-3xl bg-[#0f0f10]/95 p-12 rounded-[40px] border border-green-500/30 text-center shadow-[0_0_100px_rgba(34,197,94,0.15)] animate-in zoom-in-95 fade-in duration-700 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
           
           <div className="w-24 h-24 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-bounce">
              <svg className="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
           </div>
           
           <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Payment Verified</h1>
           <p className="text-zinc-500 text-xs mb-10 uppercase tracking-[0.3em] font-bold">Secure Connection Established</p>
           
           <div className="bg-zinc-900/60 p-6 rounded-3xl border border-white/5 mb-10 text-left relative z-10">
              <p className="text-[10px] text-zinc-500 uppercase font-black mb-3 tracking-widest">Unlocked Content</p>
              {data.dt === 'file' ? (
                 <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                       <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="overflow-hidden">
                       <p className="text-white font-bold text-sm truncate">{data.fn || "Secure_File.zip"}</p>
                       <p className="text-green-500 text-[10px] uppercase font-black tracking-wider mt-1">Ready for Download</p>
                    </div>
                 </div>
              ) : (
                 <div className="bg-black/40 p-4 rounded-2xl border border-white/5 break-all">
                    <code className="text-green-500 font-mono text-sm leading-relaxed">
                       {data.i}
                    </code>
                 </div>
              )}
           </div>

           {data.dt === 'file' ? (
             <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="relative z-10 w-full bg-white hover:bg-zinc-200 text-black py-5 rounded-2xl font-black block transition-all uppercase mb-8 shadow-2xl active:scale-95 text-sm tracking-widest flex items-center justify-center gap-3">
               Download Asset
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             </a>
           ) : null}

           {!rating ? (
             <div className="relative z-10 bg-[#161618] p-5 rounded-3xl border border-white/5">
               <p className="text-[9px] text-zinc-500 uppercase font-black mb-4 tracking-[0.2em] text-center">How was your experience?</p>
               <div className="flex gap-4">
                 <button onClick={() => setRating('pos')} className="flex-1 py-4 bg-zinc-800/50 hover:bg-green-500/10 hover:border-green-500/40 hover:text-green-500 rounded-2xl transition-all text-[10px] font-black border border-white/5 uppercase flex flex-col items-center gap-1 group">
                    <span className="text-lg group-hover:scale-125 transition-transform">👍</span>
                    Trusted
                 </button>
                 <button onClick={() => setRating('neg')} className="flex-1 py-4 bg-zinc-800/50 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-500 rounded-2xl transition-all text-[10px] font-black border border-white/5 uppercase flex flex-col items-center gap-1 group">
                    <span className="text-lg group-hover:scale-125 transition-transform">👎</span>
                    Issues
                 </button>
               </div>
             </div>
           ) : (
             <div className="relative z-10 py-4 bg-green-500/10 text-green-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-green-500/20">
               Thanks for your feedback!
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
