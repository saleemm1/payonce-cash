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

  if (error) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black uppercase tracking-tighter">{error}</div>;
  if (!data) return <div className="min-h-screen bg-[#0b0b0d] text-white flex justify-center items-center animate-pulse font-black italic tracking-[10px]">LOADING...</div>;

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
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-10 font-sans selection:bg-green-500/30">
      {!isPaid ? (
        <div className="w-full max-w-md bg-[#16161a] rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {isViral && (
            <div className="absolute -right-14 top-7 bg-green-500 text-black text-[10px] font-black px-16 py-1.5 rotate-45 uppercase shadow-xl z-20">
              5% Discount
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-col items-center text-center">
              {data.cn && (
                <div className="mb-4 bg-green-600/10 border border-green-500/20 px-4 py-1.5 rounded-full">
                  <span className="text-[10px] text-green-500 font-black uppercase italic">Personal Bill: {data.cn}</span>
                </div>
              )}
              {data.pr && (
                <div className="w-full h-48 rounded-3xl overflow-hidden mb-6 border border-white/5 shadow-inner">
                  <img src={data.pr} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Preview" />
                </div>
              )}

              <div className="mb-6">
                <span className="text-[9px] text-zinc-500 uppercase font-black tracking-[0.2em] block mb-1">Document Title</span>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-tight">{data.n}</h1>
              </div>

              <div className="mb-6 bg-black/40 border border-white/5 p-4 rounded-2xl w-full">
                <span className="text-[8px] text-zinc-500 uppercase font-black block mb-1">Course Content:</span>
                <p className="text-xs text-green-500 font-bold truncate italic uppercase tracking-tight">
                  {data.fn || "Secure_Attachment.enc"}
                </p>
              </div>

              {data.d && <p className="text-zinc-500 text-[11px] mb-6 px-4 leading-relaxed italic">{data.d}</p>}
              
              <div className="grid grid-cols-2 gap-3 w-full mb-8 bg-zinc-900/40 p-4 rounded-2xl border border-white/5">
                <div className="text-center border-r border-white/10">
                  <span className="text-[7px] text-zinc-500 uppercase font-black block mb-1 tracking-widest">Instructor</span>
                  <span className="text-xs font-black text-white uppercase italic">{data.sn}</span>
                </div>
                <div className="text-center">
                  <span className="text-[7px] text-zinc-500 uppercase font-black block mb-1 tracking-widest">Support</span>
                  <span className="text-[10px] font-mono font-bold text-green-500/80 truncate block">{data.se}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center mb-8">
              {(!isViral || viralMethod === 'smart') && (
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
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Scanning Ledger...</p>
                    </div>
                  )}
                </div>
              )}

              <div className="w-full space-y-4">
                <div className="flex bg-black/60 rounded-2xl p-1.5 border border-white/5 shadow-inner">
                  <button onClick={() => setQrMode('address')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${qrMode === 'address' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500'}`}>Address</button>
                  <button onClick={() => setQrMode('smart')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${qrMode === 'smart' ? 'bg-green-600 text-black shadow-xl' : 'text-zinc-500'}`}>Smart Pay</button>
                </div>

                {isViral && (
                  <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/5">
                    <button onClick={() => setViralMethod('smart')} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${viralMethod === 'smart' ? 'bg-green-600/20 text-green-500' : 'text-zinc-500'}`}>Smart Link</button>
                    <button onClick={() => setViralMethod('manual')} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${viralMethod === 'manual' ? 'bg-green-600/20 text-green-500' : 'text-zinc-500'}`}>Manual Pay</button>
                  </div>
                )}
                
                <div className="flex items-center gap-2 bg-black/40 p-3 rounded-2xl border border-white/5 group transition-all hover:border-white/20">
                  <code className="flex-1 text-[9px] text-zinc-500 truncate font-mono tracking-tighter ml-2">{cleanAddr}</code>
                  <button onClick={() => copyToClipboard(cleanAddr)} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all active:scale-95">
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-[2rem] border border-white/5 mb-6 text-center shadow-inner relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-2">
                  {isViral ? `$${(data.p * 0.95).toFixed(2)} USD (Disc.)` : `$${data.p} USD`}
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-black text-green-500 tracking-tighter">
                    {isViral ? discountTotal : bchPrice}
                  </span>
                  <span className="text-lg font-black text-green-500/50 uppercase italic tracking-tighter">BCH</span>
                </div>
              </div>
            </div>

            <button onClick={() => setChecking(true)} disabled={checking} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl transition-all uppercase tracking-tighter text-xl active:scale-95 shadow-[0_10px_30px_rgba(22,163,74,0.3)] mb-4">
              {checking ? 'Waiting for Payment...' : 'Verify Transaction'}
            </button>

            {data.a && !affiliateAddr && (
              <button onClick={() => router.push(`/affiliate?product=${searchParams.get('id')}`)} className="w-full bg-white/5 hover:bg-white/10 text-zinc-400 py-3 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all">
                🚀 Earn 10% to promote this
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-[#16161a] p-10 rounded-[3.5rem] border-2 border-green-500 shadow-[0_0_80px_rgba(34,197,94,0.2)] text-center animate-in zoom-in-95 duration-700 relative overflow-hidden">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
            <span className="text-4xl">💎</span>
          </div>
          
          <h1 className="text-4xl font-black mb-2 italic uppercase tracking-tighter leading-none">Access Granted</h1>
          <p className="text-zinc-500 text-[10px] mb-10 uppercase tracking-[0.4em] font-black">Successfully Decrypted</p>
          
          <div className="mb-8 text-left bg-black/40 p-5 rounded-3xl border border-white/5">
            <p className="text-[8px] text-zinc-500 uppercase font-black mb-2 tracking-widest">Unlocked Asset:</p>
            <p className="text-white font-black italic uppercase tracking-tight text-lg leading-none">{data.n}</p>
          </div>

          {data.dt === 'file' ? (
            <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="w-full bg-green-600 text-black py-6 rounded-2xl font-black block hover:bg-green-500 transition-all uppercase mb-10 shadow-xl text-xl">
              Download File ⚡
            </a>
          ) : (
            <div className="bg-black p-6 rounded-3xl border border-white/10 mb-10 break-all text-left">
              <p className="text-[10px] text-zinc-500 uppercase font-black mb-3">Secret Data:</p>
              <p className="text-green-500 font-mono text-sm leading-relaxed">{data.i}</p>
            </div>
          )}

          {!rating ? (
            <div className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
              <p className="text-[9px] text-zinc-500 uppercase font-black mb-5 tracking-widest">Rate the Vendor</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setRating('pos')} className="flex-1 p-5 bg-black hover:bg-green-500/10 rounded-2xl transition-all border border-white/5 group">
                  <span className="block text-2xl mb-1 group-hover:scale-125 transition-transform">👍</span>
                  <span className="text-[9px] font-black uppercase">Legit</span>
                </button>
                <button onClick={() => setRating('neg')} className="flex-1 p-5 bg-black hover:bg-red-500/10 rounded-2xl transition-all border border-white/5 group">
                  <span className="block text-2xl mb-1 group-hover:scale-125 transition-transform">👎</span>
                  <span className="text-[9px] font-black uppercase">Scam</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-5 bg-green-600/20 text-green-500 rounded-2xl font-black text-xs uppercase italic border border-green-500/20">
              Feedback Successfully Recorded
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
