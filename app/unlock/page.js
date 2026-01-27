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
  const [viralMethod, setViralMethod] = useState('smart');
  const [error, setError] = useState('');
  const [txDetected, setTxDetected] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(id))));
        setData(decoded);
      } catch (e) { setError("Invalid Secure Link"); }
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
          if (bal.unconfirmed > 0 && !txDetected) setTxDetected(true);
          if (bal.unconfirmed > 0 || bal.confirmed > 0) {
            setTimeout(() => { setIsPaid(true); setChecking(false); }, 1000);
          }
        } catch (err) { console.error(err); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [checking, isPaid, data, txDetected]);

  if (error) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black uppercase tracking-widest">{error}</div>;
  if (!data) return <div className="min-h-screen bg-black text-white flex justify-center items-center animate-pulse font-black italic tracking-[10px]">LOADING...</div>;

  const sellerAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
  const affiliateAddr = searchParams.get('ref');
  const isViral = data.a && affiliateAddr && (affiliateAddr !== sellerAddr);
  
  const discountTotal = (parseFloat(bchPrice) * 0.95).toFixed(8);
  const sellerAmt = (parseFloat(discountTotal) * 0.9).toFixed(8);
  const affAmt = (parseFloat(discountTotal) * 0.1).toFixed(8);

  const smartURI = `bitcoincash:${sellerAddr}?amount=${sellerAmt}&address=${affiliateAddr}&amount=${affAmt}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white flex flex-col items-center justify-center px-4 py-8 font-sans">
      {!isPaid ? (
        <div className="w-full max-w-md bg-[#111114] p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-8 text-center">
             <div className="bg-green-500/10 border border-green-500/20 px-4 py-1 rounded-full mb-4">
                <p className="text-[9px] font-black text-green-500 uppercase tracking-widest italic">
                  {isViral ? "Viral Discount Active -5%" : "Direct Purchase Mode"}
                </p>
             </div>
             {data.pr && <img src={data.pr} className="w-full h-40 object-cover rounded-[2rem] mb-4 border border-white/5" />}
             <h1 className="text-2xl font-black italic uppercase tracking-tighter">{data.n}</h1>
          </div>

          {isViral ? (
            <div className="mb-8">
               <div className="flex bg-black/50 p-1 rounded-2xl border border-white/5 mb-6">
                  <button onClick={() => setViralMethod('smart')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${viralMethod === 'smart' ? 'bg-green-600 text-black shadow-lg' : 'text-zinc-500'}`}>Option A: Smart</button>
                  <button onClick={() => setViralMethod('manual')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${viralMethod === 'manual' ? 'bg-green-600 text-black shadow-lg' : 'text-zinc-500'}`}>Option B: Manual</button>
               </div>

               {viralMethod === 'smart' ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in-95">
                     <div className="bg-white p-4 rounded-[2.5rem] mb-6 shadow-[0_0_50px_rgba(34,197,94,0.1)] relative">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(smartURI)}`} className="w-[180px] h-[180px]" />
                        {(checking || txDetected) && (
                          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl rounded-[2.2rem] flex flex-col items-center justify-center border-2 border-green-500 animate-in fade-in">
                             <div className={txDetected ? "animate-bounce text-4xl" : "animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"}>{txDetected ? '⚡' : ''}</div>
                             <p className="text-[10px] font-black text-green-500 mt-2 uppercase">{txDetected ? 'Detected' : 'Scanning'}</p>
                          </div>
                        )}
                     </div>
                     <p className="text-[9px] text-zinc-500 text-center px-6 leading-relaxed uppercase font-bold tracking-tight">
                       Recommended for <span className="text-white">Electron Cash</span> users.<br/>One scan, split payment.
                     </p>
                  </div>
               ) : (
                  <div className="space-y-3 animate-in fade-in slide-in-from-right-4">
                     <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-zinc-500 uppercase mb-2 italic">1. Main Payment (Seller)</p>
                        <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-zinc-800 transition-all" onClick={() => copyToClipboard(sellerAmt)}>
                           <span className="text-[11px] font-mono text-green-500 font-bold">{sellerAmt} BCH</span>
                           <span className="text-[8px] font-black text-zinc-600 uppercase">Copy Amt</span>
                        </div>
                        <button onClick={() => copyToClipboard(sellerAddr)} className="w-full mt-2 py-2 text-[8px] font-black text-zinc-400 uppercase tracking-widest border border-dashed border-zinc-700 rounded-lg">Copy Address</button>
                     </div>
                     <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-zinc-500 uppercase mb-2 italic">2. Commission (Promoter)</p>
                        <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-zinc-800 transition-all" onClick={() => copyToClipboard(affAmt)}>
                           <span className="text-[11px] font-mono text-green-500 font-bold">{affAmt} BCH</span>
                           <span className="text-[8px] font-black text-zinc-600 uppercase">Copy Amt</span>
                        </div>
                        <button onClick={() => copyToClipboard(affiliateAddr)} className="w-full mt-2 py-2 text-[8px] font-black text-zinc-400 uppercase tracking-widest border border-dashed border-zinc-700 rounded-lg">Copy Address</button>
                     </div>
                  </div>
               )}
            </div>
          ) : (
            <div className="flex flex-col items-center mb-8">
               <div className="bg-white p-4 rounded-[2.5rem] mb-6 relative">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`bitcoincash:${sellerAddr}?amount=${bchPrice}`)}`} className="w-[180px] h-[180px]" />
                  {(checking || txDetected) && (
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-xl rounded-[2.2rem] flex flex-col items-center justify-center border-2 border-green-500">
                       <div className={txDetected ? "animate-bounce text-4xl" : "animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"}>{txDetected ? '⚡' : ''}</div>
                    </div>
                  )}
               </div>
               <button onClick={() => copyToClipboard(sellerAddr)} className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest">{copied ? '✓ Copied' : '📄 Copy Address'}</button>
            </div>
          )}

          <div className="text-center mb-8 py-6 bg-black/40 rounded-[2rem] border border-white/5">
            <p className="text-[10px] text-zinc-500 font-black uppercase mb-1 tracking-widest">${isViral ? (data.p * 0.95).toFixed(2) : data.p} USD</p>
            <p className="text-4xl font-black text-green-500 tracking-tighter">{isViral ? discountTotal : bchPrice} <span className="text-sm font-light uppercase">BCH</span></p>
          </div>

          <button onClick={() => setChecking(true)} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl transition-all uppercase tracking-tighter text-xl shadow-xl active:scale-95 mb-4">
            {checking ? (txDetected ? 'Processing...' : 'Scanning...') : 'Verify Payment'}
          </button>

          {data.a && !affiliateAddr && (
            <button onClick={() => router.push(`/affiliate?id=${searchParams.get('id')}`)} className="w-full py-4 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] hover:text-white transition-all">
              🚀 Become a Partner (10%)
            </button>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md bg-[#111114] p-12 rounded-[3.5rem] border border-green-500/30 text-center animate-in zoom-in-95">
           <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-2xl">
              <span className="text-4xl animate-pulse">💎</span>
           </div>
           <h1 className="text-4xl font-black mb-2 italic uppercase tracking-tighter">Paid!</h1>
           <p className="text-zinc-500 text-[10px] mb-8 uppercase tracking-[4px] font-bold italic">Zero-Conf Verified</p>
           {data.dt === 'file' ? (
             <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="w-full bg-green-600 text-black py-5 rounded-2xl font-black block hover:bg-green-500 transition-all uppercase mb-6 shadow-xl text-lg">Download ⚡</a>
           ) : (
             <div className="bg-black/50 p-6 rounded-2xl border border-white/10 mb-6 break-all shadow-inner">
               <p className="text-green-500 font-mono text-sm leading-relaxed select-all">{data.i}</p>
             </div>
           )}
           <button onClick={() => window.location.reload()} className="text-[9px] font-black text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-all">Back to Store</button>
        </div>
      )}
    </div>
  );
}

export default function UnlockPage() {
  return <Suspense fallback={null}><UnlockContent /></Suspense>;
}
