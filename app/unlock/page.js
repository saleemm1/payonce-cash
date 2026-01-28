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

  if (error) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black uppercase tracking-tighter">{error}</div>;
  if (!data) return <div className="min-h-screen bg-[#0b0b0d] text-white flex justify-center items-center animate-pulse font-black italic tracking-[10px]">LOADING...</div>;

  const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
  const affiliateAddr = searchParams.get('ref');
  const isViral = data.a && affiliateAddr && (affiliateAddr !== cleanAddr);

  const bchPriceVal = parseFloat(bchPrice || 0);
  const discountTotal = (bchPriceVal * 0.95).toFixed(8);
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
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-10 font-sans selection:bg-green-500/30">
      {!isPaid ? (
        <div className="w-full max-w-md bg-[#16161a] rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {isViral && (
            <div className="absolute -right-14 top-7 bg-green-500 text-black text-[10px] font-black px-16 py-1.5 rotate-45 uppercase shadow-xl z-20">
              5% Discount
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-col items-center text-center">
              {data.pr && (
                <div className="w-full h-48 rounded-3xl overflow-hidden mb-6 border border-white/5 relative group">
                  <img src={data.pr} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              )}

              <div className="space-y-1 mb-6">
                <span className="text-[10px] text-green-500 font-black uppercase tracking-[0.2em]">Secure Checkout</span>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{data.n}</h1>
                <p className="text-zinc-500 text-[11px] font-medium uppercase tracking-widest">{data.fn || "Secure_Attachment.enc"}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mb-8 bg-black/40 p-4 rounded-2xl border border-white/5">
                <div className="text-left border-r border-white/10 pr-2">
                  <span className="text-[8px] text-zinc-500 uppercase font-black block">Vendor</span>
                  <span className="text-xs font-bold text-white truncate block uppercase italic">{data.sn}</span>
                </div>
                <div className="text-left pl-2">
                  <span className="text-[8px] text-zinc-500 uppercase font-black block">Support</span>
                  <span className="text-[10px] font-mono font-bold text-green-500/80 truncate block">{data.se}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center mb-8">
              <div className="bg-white p-5 rounded-[2.5rem] shadow-[0_0_60px_rgba(34,197,94,0.15)] relative mb-6">
                {!loadingPrice ? (
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(isViral ? smartViralLink : (qrMode === 'smart' ? standardLink : cleanAddr))}`} 
                    alt="QR" className="w-[180px] h-[180px]" 
                  />
                ) : <div className="w-[180px] h-[180px] bg-zinc-800 animate-pulse rounded-2xl"></div>}
                {checking && (
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-green-500 animate-pulse">
                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Awaiting Block...</p>
                  </div>
                )}
              </div>

              {!isViral && (
                <div className="w-full space-y-4">
                  <div className="flex bg-black/60 rounded-2xl p-1.5 border border-white/5 shadow-inner">
                    <button onClick={() => setQrMode('address')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${qrMode === 'address' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}>Address Only</button>
                    <button onClick={() => setQrMode('smart')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${qrMode === 'smart' ? 'bg-green-600 text-black shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}>Smart Pay</button>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-black p-3 rounded-2xl border border-white/5 group">
                    <code className="flex-1 text-[9px] text-zinc-500 truncate font-mono tracking-tighter">{cleanAddr}</code>
                    <button onClick={() => copyToClipboard(cleanAddr)} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all active:scale-90">
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-[2rem] border border-white/5 mb-6 text-center shadow-inner">
              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] block mb-2">Total Amount</span>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-black text-green-500 tracking-tighter">
                  {isViral ? discountTotal : bchPrice}
                </span>
                <span className="text-lg font-black text-green-500/50 uppercase italic tracking-tighter">BCH</span>
              </div>
              <p className="text-[11px] text-zinc-600 font-bold mt-1 uppercase">
                ≈ {isViral ? (data.p * 0.95).toFixed(2) : data.p} USD
              </p>
            </div>

            <button onClick={() => setChecking(true)} disabled={checking} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl transition-all uppercase tracking-tighter text-xl active:scale-95 shadow-[0_10px_30px_rgba(22,163,74,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
              {checking ? 'Checking Ledger...' : 'Verify Payment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-[#16161a] p-10 rounded-[3.5rem] border-2 border-green-500 shadow-[0_0_80px_rgba(34,197,94,0.2)] text-center animate-in zoom-in-95 duration-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-bounce">
            <span className="text-5xl">✓</span>
          </div>
          
          <div className="space-y-2 mb-10">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Access Granted</h1>
            <p className="text-green-500 text-[10px] uppercase tracking-[0.4em] font-black">Transaction Verified</p>
          </div>
          
          <div className="space-y-4 mb-10">
            {data.dt === 'file' ? (
              <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="w-full bg-white text-black py-5 rounded-2xl font-black block hover:bg-zinc-200 transition-all uppercase shadow-2xl text-lg flex items-center justify-center gap-2">
                Download Now ⚡
              </a>
            ) : (
              <div className="bg-black p-6 rounded-3xl border border-white/10 break-all text-left group">
                <p className="text-[10px] text-zinc-500 uppercase font-black mb-3">Secret Key / Link:</p>
                <p className="text-green-500 font-mono text-sm leading-relaxed select-all">{data.i}</p>
              </div>
            )}
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
            <p className="text-[10px] text-zinc-500 uppercase font-black mb-5 tracking-widest">Rate this seller</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setRating('pos')} disabled={rating} className={`flex-1 p-5 rounded-2xl transition-all border border-white/10 group ${rating === 'pos' ? 'bg-green-600 text-black' : 'bg-black hover:border-green-500'}`}>
                <span className="block text-2xl mb-1 group-hover:scale-125 transition-transform">👍</span>
                <span className="text-[10px] font-black uppercase tracking-tighter">Legit</span>
              </button>
              <button onClick={() => setRating('neg')} disabled={rating} className={`flex-1 p-5 rounded-2xl transition-all border border-white/10 group ${rating === 'neg' ? 'bg-red-600 text-black' : 'bg-black hover:border-red-500'}`}>
                <span className="block text-2xl mb-1 group-hover:scale-125 transition-transform">👎</span>
                <span className="text-[10px] font-black uppercase tracking-tighter">Scam</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UnlockPage() {
  return <Suspense fallback={null}><UnlockContent /></Suspense>;
}
