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

  if (error) return <div className="min-h-screen bg-[#050505] text-red-500 flex justify-center items-center font-bold tracking-widest uppercase text-sm">{error}</div>;
  if (!data) return <div className="min-h-screen bg-[#050505] text-zinc-500 flex justify-center items-center animate-pulse font-mono text-xs tracking-[0.5em]">INITIALIZING...</div>;

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
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center p-4 antialiased selection:bg-green-500/30">
      {!isPaid ? (
        <div className="w-full max-w-[420px] bg-[#0f0f11] rounded-[32px] border border-zinc-800/50 shadow-2xl overflow-hidden relative transition-all duration-500">
          
          {isViral && (
            <div className="absolute -right-12 top-8 bg-green-500 text-black text-[10px] font-black px-12 py-1 rotate-45 shadow-lg z-10">
              5% OFF
            </div>
          )}
          
          <div className="p-8 pb-6 flex flex-col items-center text-center relative z-0">
             {data.cn && (
               <div className="mb-6 inline-flex items-center justify-center px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                 <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Bill: <span className="text-white">{data.cn}</span></span>
               </div>
             )}
             
             {data.pr && (
               <div className="w-full mb-6 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-b from-green-500/20 to-transparent rounded-[24px] blur opacity-50 group-hover:opacity-100 transition duration-700"></div>
                  <img src={data.pr} className="w-full h-48 object-cover rounded-[20px] relative shadow-2xl border border-white/5" alt="Preview" />
               </div>
             )}

             <div className="w-full space-y-2 mb-6">
                <h1 className="text-xl font-bold text-white tracking-tight leading-snug">{data.n}</h1>
                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-medium bg-zinc-900/50 py-2 px-4 rounded-xl border border-white/5">
                   <span className="uppercase tracking-wider">Format:</span>
                   <span className="text-green-500 font-bold truncate max-w-[150px]">{data.fn || "Encrypted File"}</span>
                </div>
                {data.d && <p className="text-zinc-400 text-xs leading-relaxed px-2 pt-2">{data.d}</p>}
             </div>

             <div className="w-full grid grid-cols-2 gap-3 mb-2">
                <div className="bg-zinc-900/30 p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1">
                   <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Seller</span>
                   <span className="text-[11px] font-bold text-zinc-200">{data.sn}</span>
                </div>
                <div className="bg-zinc-900/30 p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1">
                   <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Contact</span>
                   <span className="text-[10px] font-bold text-green-500/80 truncate w-full text-center">{data.se}</span>
                </div>
             </div>
          </div>

          <div className="bg-[#141416] p-8 pt-6 rounded-t-[32px] border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col items-center mb-6">
               <div className="mb-2 text-center">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1">Total Amount</p>
                  <div className="flex items-baseline justify-center gap-2">
                     <span className="text-3xl font-bold text-white tracking-tight">{isViral ? discountTotal : bchPrice}</span>
                     <span className="text-sm font-bold text-green-500">BCH</span>
                  </div>
                  <p className="text-[10px] text-zinc-600 font-medium mt-1">
                     ≈ ${isViral ? (data.p * 0.95).toFixed(2) : data.p} USD
                  </p>
               </div>
            </div>

            <div className="flex flex-col items-center gap-5">
              {(!isViral || viralMethod === 'smart') && (
                <div className="relative group">
                   <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500/30 to-zinc-800 rounded-[24px] blur opacity-75"></div>
                   <div className="relative bg-white p-3 rounded-[22px]">
                    {!loadingPrice ? (
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(isViral ? smartViralLink : (qrMode === 'smart' ? standardLink : cleanAddr))}`} 
                        alt="QR Code" 
                        className="w-40 h-40 mix-blend-multiply" 
                      />
                    ) : <div className="w-40 h-40 bg-zinc-100 rounded-xl animate-pulse"></div>}
                    
                    {checking && (
                       <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-[22px] flex flex-col items-center justify-center z-20">
                          <div className="w-8 h-8 border-2 border-zinc-200 border-t-green-600 rounded-full animate-spin mb-2"></div>
                          <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">Scanning</p>
                       </div>
                    )}
                   </div>
                </div>
              )}

              {!isViral && (
                <div className="w-full">
                  <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800 mb-4 relative">
                    <button 
                      onClick={() => setQrMode('address')} 
                      className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${qrMode === 'address' ? 'bg-[#1f1f22] text-white shadow-lg border border-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Address
                    </button>
                    <button 
                      onClick={() => setQrMode('smart')} 
                      className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${qrMode === 'smart' ? 'bg-[#1f1f22] text-white shadow-lg border border-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Smart Pay
                    </button>
                  </div>
                  
                  <div className={`transition-all duration-300 overflow-hidden ${qrMode === 'address' ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex items-center gap-2 bg-zinc-900/50 p-2 pl-3 rounded-xl border border-white/5">
                      <code className="flex-1 text-[10px] text-zinc-400 font-mono truncate select-all">{cleanAddr}</code>
                      <button onClick={() => copyToClipboard(cleanAddr)} className="bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-colors">
                        {copied ? '✓' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setChecking(true)} 
              disabled={checking}
              className="w-full mt-6 bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-wider text-sm shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {checking ? 'Checking Status...' : 'Verify Transaction'}
            </button>

            {data.a && !affiliateAddr && (
              <button onClick={() => router.push(`/affiliate?product=${searchParams.get('id')}`)} className="w-full mt-3 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 py-3 rounded-xl border border-white/5 text-[9px] font-bold uppercase tracking-widest transition-all">
                Partner & Earn 10%
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[420px] bg-[#0f0f11] p-8 rounded-[32px] border border-green-500/20 text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
           
           <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
           </div>
           
           <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Access Granted</h1>
           <p className="text-zinc-500 text-[10px] mb-8 uppercase tracking-[0.2em] font-bold">Transaction Confirmed</p>
           
           <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 mb-8 text-left">
              <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-2">Content</span>
              <p className="text-white font-medium text-sm break-words leading-relaxed">
                {data.dt === 'file' ? data.fn || "Secure File" : data.i}
              </p>
           </div>

           {data.dt === 'file' ? (
             <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-black py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-900/20 mb-8 group">
               <span>Download File</span>
               <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             </a>
           ) : null}

           {!rating ? (
             <div className="bg-[#161618] p-5 rounded-2xl border border-white/5">
               <p className="text-[9px] text-zinc-500 uppercase font-bold mb-4 tracking-widest">Rate Transaction</p>
               <div className="flex gap-3">
                 <button onClick={() => setRating('pos')} className="flex-1 py-3 bg-zinc-900 hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-500 rounded-xl transition-all text-xs font-bold border border-white/5">
                    Good
                 </button>
                 <button onClick={() => setRating('neg')} className="flex-1 py-3 bg-zinc-900 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 rounded-xl transition-all text-xs font-bold border border-white/5">
                    Bad
                 </button>
               </div>
             </div>
           ) : (
             <div className="py-3 bg-green-600/10 text-green-500 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-green-500/20">
               Thank you for feedback
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
