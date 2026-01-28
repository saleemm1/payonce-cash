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
      <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-xl font-bold tracking-widest uppercase text-sm shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        {error}
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-green-500 rounded-full animate-spin"></div>
        <span className="text-zinc-500 font-mono text-xs tracking-[0.3em] animate-pulse">DECRYPTING SECURE LINK...</span>
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-green-500/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {!isPaid ? (
        <div className="w-full max-w-[400px] backdrop-blur-xl bg-[#0a0a0a]/80 rounded-[30px] border border-white/10 shadow-2xl relative z-10 transition-all duration-500 hover:shadow-[0_0_50px_rgba(34,197,94,0.05)] hover:border-white/20">
          
          {isViral && (
            <div className="absolute -right-[42px] top-[32px] bg-gradient-to-r from-green-500 to-emerald-400 text-black text-[9px] font-black px-10 py-1 rotate-45 shadow-lg z-20 tracking-wider">
              5% OFF
            </div>
          )}

          <div className="p-6 pb-2 flex flex-col items-center text-center">
             <div className="w-full flex justify-between items-center mb-6 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Secure Payment</span>
                </div>
                {data.cn && <span className="text-[10px] text-zinc-500 font-mono border border-zinc-800 px-2 py-0.5 rounded-md">#{data.cn}</span>}
             </div>

             {data.pr && (
               <div className="w-full mb-6 relative group overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                  <img src={data.pr} className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Preview" />
               </div>
             )}

             <div className="text-center mb-6 w-full">
                <h1 className="text-xl font-bold text-white tracking-tight mb-2 leading-tight">{data.n}</h1>
                <div className="inline-flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-white/5">
                   <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[180px]">{data.fn || "Encrypted_Asset.file"}</span>
                </div>
             </div>

             <div className="w-full bg-zinc-900/40 rounded-2xl p-4 border border-white/5 mb-2">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total</span>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 font-medium mr-1">≈</span>
                    <span className="text-[11px] text-zinc-400 font-mono">${isViral ? (data.p * 0.95).toFixed(2) : data.p} USD</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                   <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-white tracking-tighter">{isViral ? discountTotal : bchPrice}</span>
                      <span className="text-xs font-bold text-green-500">BCH</span>
                   </div>
                   {!loadingPrice && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>}
                </div>
             </div>
          </div>

          <div className="px-6 pb-6">
            {!isViral && (
              <div className="flex p-1 bg-zinc-900/80 rounded-xl border border-white/5 mb-5">
                <button 
                  onClick={() => setQrMode('address')} 
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${qrMode === 'address' ? 'bg-zinc-800 text-white shadow-md border border-white/5' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  Address
                </button>
                <button 
                  onClick={() => setQrMode('smart')} 
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${qrMode === 'smart' ? 'bg-zinc-800 text-white shadow-md border border-white/5' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  Smart Pay
                </button>
              </div>
            )}

            <div className="flex flex-col items-center gap-4 transition-all duration-300">
              {(!isViral || viralMethod === 'smart') && (
                <div className="bg-white p-3 rounded-2xl shadow-2xl shadow-green-900/10 relative overflow-hidden group">
                   {!loadingPrice ? (
                     <img 
                       src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(isViral ? smartViralLink : (qrMode === 'smart' ? standardLink : cleanAddr))}`} 
                       alt="QR" 
                       className="w-44 h-44 object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" 
                     />
                   ) : <div className="w-44 h-44 bg-zinc-100 animate-pulse rounded-xl"></div>}
                   
                   {checking && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                         <div className="w-8 h-8 border-3 border-zinc-100 border-t-green-500 rounded-full animate-spin mb-2"></div>
                      </div>
                   )}
                </div>
              )}
              
              {!isViral && qrMode === 'address' && (
                <div className="w-full animate-in slide-in-from-top-2 fade-in duration-300">
                   <div className="flex items-center gap-2 bg-black/40 p-1.5 pl-3 rounded-xl border border-white/10 hover:border-white/20 transition-colors group">
                     <code className="flex-1 text-[10px] text-zinc-400 font-mono truncate">{cleanAddr}</code>
                     <button 
                        onClick={() => copyToClipboard(cleanAddr)} 
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${copied ? 'bg-green-600 text-black' : 'bg-zinc-800 text-white group-hover:bg-zinc-700'}`}
                     >
                       {copied ? 'Copied' : 'Copy'}
                     </button>
                   </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setChecking(true)} 
              className={`w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-black font-black py-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(34,197,94,0.2)] active:scale-[0.98] ${checking ? 'opacity-80' : ''}`}
            >
              {checking ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
                  Checking...
                </span>
              ) : 'Verify Transaction'}
            </button>

            {data.a && !affiliateAddr && (
              <button 
                onClick={() => router.push(`/affiliate?product=${searchParams.get('id')}`)} 
                className="w-full mt-3 flex items-center justify-center gap-2 text-zinc-500 hover:text-white py-2 transition-colors text-[9px] font-bold uppercase tracking-widest group"
              >
                <span>Promote & Earn 10%</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[400px] backdrop-blur-xl bg-[#0a0a0a]/90 p-8 rounded-[30px] border border-green-500/30 text-center shadow-[0_0_60px_rgba(34,197,94,0.1)] animate-in zoom-in-95 fade-in duration-500 relative overflow-hidden">
           <div className="absolute inset-0 bg-green-500/5 pointer-events-none"></div>
           
           <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
           </div>
           
           <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Access Granted</h1>
           <p className="text-zinc-500 text-[10px] mb-8 uppercase tracking-[0.25em] font-bold">Successfully Verified</p>
           
           <div className="bg-zinc-900/60 p-5 rounded-2xl border border-white/5 mb-8 text-left relative z-10">
              <p className="text-[9px] text-zinc-500 uppercase font-black mb-2 tracking-wider">Decrypted Data</p>
              {data.dt === 'file' ? (
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                       <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                       <p className="text-white font-bold text-xs">{data.fn || "Secure_File.zip"}</p>
                       <p className="text-green-500 text-[9px] uppercase font-bold">Ready to download</p>
                    </div>
                 </div>
              ) : (
                 <code className="text-green-500 font-mono text-xs break-all block bg-black/30 p-2 rounded-lg border border-white/5">
                    {data.i}
                 </code>
              )}
           </div>

           {data.dt === 'file' ? (
             <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="relative z-10 w-full bg-white hover:bg-zinc-200 text-black py-4 rounded-xl font-black block transition-all uppercase mb-6 shadow-xl active:scale-95 text-xs tracking-widest flex items-center justify-center gap-2">
               Download Now
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             </a>
           ) : null}

           {!rating ? (
             <div className="relative z-10 bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
               <p className="text-[8px] text-zinc-500 uppercase font-black mb-3 tracking-widest">Rate Transaction</p>
               <div className="flex gap-2">
                 <button onClick={() => setRating('pos')} className="flex-1 py-2.5 bg-zinc-800/50 hover:bg-green-500/20 hover:text-green-500 hover:border-green-500/30 rounded-lg transition-all text-[10px] font-bold border border-white/5 uppercase">
                    Trusted
                 </button>
                 <button onClick={() => setRating('neg')} className="flex-1 py-2.5 bg-zinc-800/50 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 rounded-lg transition-all text-[10px] font-bold border border-white/5 uppercase">
                    Scam
                 </button>
               </div>
             </div>
           ) : (
             <div className="relative z-10 py-3 bg-green-500/10 text-green-500 rounded-xl font-bold text-[9px] uppercase tracking-widest border border-green-500/20 animate-pulse">
               Feedback Submitted
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
