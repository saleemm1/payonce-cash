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
          }).catch(() => setLoadingPrice(false));
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

  if (error) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black uppercase text-xl">{error}</div>;
  if (!data) return <div className="min-h-screen bg-black text-white flex justify-center items-center animate-pulse font-black italic tracking-[10px]">LOADING SYSTEM...</div>;

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
    <div className="min-h-screen bg-[#050506] text-white flex flex-col items-center justify-center px-4 py-12 font-sans selection:bg-green-500/30">
      {!isPaid ? (
        <div className="w-full max-w-[550px] bg-[#0f0f12] p-10 rounded-[3rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {isViral && (
            <div className="absolute -right-12 top-8 bg-green-600 text-black text-[10px] font-black px-12 py-1.5 rotate-45 uppercase shadow-2xl">5% Discount Applied</div>
          )}
          
          <div className="flex flex-col items-center mb-8 text-center">
             {data.cn && (
               <div className="mb-6 bg-green-600/10 border border-green-500/20 px-6 py-1.5 rounded-full">
                 <span className="text-xs text-green-500 font-black uppercase italic tracking-widest">Personal Bill: {data.cn}</span>
               </div>
             )}

             {data.pr && (
               <img src={data.pr} className="w-full h-56 object-cover rounded-[2rem] mb-6 border border-white/5 shadow-2xl" alt="Preview" />
             )}

             <div className="mb-6">
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] block mb-2">Document Title</span>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-md">{data.n}</h1>
             </div>

             <div className="mb-6 bg-black/40 border border-white/5 p-5 rounded-[1.5rem] w-full group transition-all hover:border-green-500/30">
                <span className="text-[10px] text-zinc-500 uppercase font-black block mb-2 tracking-widest">Attached File Asset</span>
                <p className="text-sm text-green-500 font-black truncate px-2 italic uppercase tracking-tight">
                  {data.fn || "Secure_Attachment.enc"}
                </p>
             </div>

             {data.d && <p className="text-zinc-400 text-sm mt-2 px-4 leading-relaxed italic font-medium">{data.d}</p>}
             
             <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                   <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Official Seller</span>
                   <span className="text-xs font-black text-white uppercase italic tracking-tight">{data.sn}</span>
                </div>
                <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center overflow-hidden">
                   <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Support Email</span>
                   <span className="text-[10px] font-mono font-bold text-green-500/80 truncate w-full text-center">{data.se}</span>
                </div>
             </div>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#e2e2e2] p-6 rounded-[2.5rem] shadow-[0_0_60px_rgba(34,197,94,0.1)] relative transition-transform hover:scale-[1.02] duration-500">
                {!loadingPrice ? (
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(isViral ? smartViralLink : (qrMode === 'smart' ? standardLink : cleanAddr))}`} 
                    alt="QR" className="w-[200px] h-[200px] mix-blend-multiply" 
                  />
                ) : <div className="w-[200px] h-[200px] bg-zinc-800 animate-pulse rounded-2xl"></div>}
                {checking && (
                   <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-green-500/50">
                      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">Verifying...</p>
                   </div>
                )}
            </div>

            {!isViral && (
              <>
                <div className="flex bg-black/80 rounded-2xl mt-8 p-1.5 border border-white/5 shadow-inner w-full">
                  <button onClick={() => setQrMode('address')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${qrMode === 'address' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}>Address Mode</button>
                  <button onClick={() => setQrMode('smart')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${qrMode === 'smart' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}>Smart Pay</button>
                </div>
                
                <div className="mt-6 w-full flex items-center gap-3 bg-black/50 p-3 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                  <code className="flex-1 text-xs text-zinc-500 truncate ml-2 font-mono tracking-tight">{cleanAddr}</code>
                  <button onClick={() => copyToClipboard(cleanAddr)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 ${copied ? 'bg-green-600 text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="text-center mb-8 py-6 bg-zinc-900/40 rounded-[2rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-[10px] text-zinc-500 font-black uppercase mb-2 font-mono tracking-[0.3em]">
              {isViral ? `$${(data.p * 0.95).toFixed(2)} USD (Discounted Price)` : `$${data.p} USD Fixed`}
            </p>
            <p className="text-5xl font-black text-green-500 tracking-tighter">{isViral ? discountTotal : bchPrice} <span className="text-sm font-light text-zinc-400 ml-1">BCH</span></p>
          </div>

          <button onClick={() => setChecking(true)} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-6 rounded-[2rem] transition-all uppercase tracking-widest text-xl active:scale-[0.98] mb-4 shadow-2xl shadow-green-900/20">
            {checking ? 'Awaiting Payment...' : 'Verify Transaction'}
          </button>

          {data.a && !affiliateAddr && (
            <button onClick={() => router.push(`/affiliate?product=${searchParams.get('id')}`)} className="w-full bg-white/5 hover:bg-white/10 text-zinc-400 py-4 rounded-2xl border border-white/5 text-xs font-black uppercase tracking-[0.2em] transition-all">
              🚀 Promote this item & earn 10%
            </button>
          )}
        </div>
      ) : (
        <div className="w-full max-w-[550px] bg-[#0f0f12] p-12 rounded-[3.5rem] border border-green-500/30 text-center shadow-2xl animate-in zoom-in-95 duration-700">
           <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
              <span className="text-5xl animate-bounce">💎</span>
           </div>
           <h1 className="text-4xl font-black mb-2 italic uppercase tracking-tighter text-white">Access Granted</h1>
           <p className="text-zinc-500 text-xs mb-10 uppercase tracking-[0.4em] font-bold">Encrypted Asset Unlocked</p>
           
           <div className="mb-10 text-left bg-black/40 p-6 rounded-3xl border border-white/5">
              <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 tracking-widest">Unlocked File Asset:</p>
              <p className="text-white font-black italic uppercase tracking-tight text-lg">{data.n}</p>
           </div>

           {data.dt === 'file' ? (
             <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="w-full bg-green-600 text-black py-6 rounded-3xl font-black block hover:bg-green-500 transition-all uppercase mb-10 shadow-xl text-xl tracking-tighter flex items-center justify-center gap-3">
               Download Secure Data ⚡
             </a>
           ) : (
             <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10 mb-10 break-all shadow-inner text-left">
               <p className="text-[10px] text-zinc-400 uppercase font-black mb-3 tracking-widest">Decrypted Data Content:</p>
               <p className="text-green-500 font-mono text-base leading-relaxed">{data.i}</p>
             </div>
           )}

           {!rating ? (
             <div className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
               <p className="text-xs text-zinc-500 uppercase font-black mb-6 tracking-widest text-center">Rate Seller Trustworthiness</p>
               <div className="flex justify-center gap-6">
                 <button onClick={() => setRating('pos')} className="flex-1 p-5 bg-zinc-900 hover:bg-green-500/20 rounded-2xl transition-all text-xs font-black uppercase border border-white/5 group">
                    <span className="block text-2xl mb-2 group-hover:scale-125 transition-transform">👍</span> Trusted
                 </button>
                 <button onClick={() => setRating('neg')} className="flex-1 p-5 bg-zinc-900 hover:bg-red-500/20 rounded-2xl transition-all text-xs font-black uppercase border border-white/5 group">
                    <span className="block text-2xl mb-2 group-hover:scale-125 transition-transform">👎</span> Avoid
                 </button>
               </div>
             </div>
           ) : (
             <div className="py-5 bg-green-600 text-black rounded-3xl font-black text-sm uppercase italic animate-pulse">
               Feedback Successfully Transmitted
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
