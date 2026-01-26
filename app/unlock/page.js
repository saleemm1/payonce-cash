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
  const smartLink = `bitcoincash:${cleanAddr}?amount=${bchPrice}`;
  const addressOnlyLink = cleanAddr;

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white flex flex-col items-center justify-center px-4 py-8 font-sans">
      {!isPaid ? (
        <div className="w-full max-w-md bg-[#16161a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          {data.a && <div className="absolute -right-12 top-6 bg-green-600 text-black text-[8px] font-black px-12 py-1 rotate-45 uppercase shadow-2xl">Viral Mode</div>}
          
          <div className="flex flex-col items-center mb-6">
             {data.pr && (
               <img src={data.pr} className="w-full h-40 object-cover rounded-3xl mb-4 border border-white/5 shadow-inner" alt="Preview" />
             )}
             <h1 className="text-2xl font-black italic uppercase tracking-tighter text-center">{data.n}</h1>
             <div className="flex flex-col items-center mt-2 opacity-60">
                <span className="text-[10px] font-black uppercase tracking-widest text-green-500">{data.sn}</span>
                <span className="text-[8px] font-bold font-mono uppercase">{data.se}</span>
             </div>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-4 rounded-[2rem] shadow-[0_0_50px_rgba(34,197,94,0.2)] transition-all relative">
              {!loadingPrice ? (
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrMode === 'smart' ? smartLink : addressOnlyLink)}`} alt="QR" className="w-[170px] h-[170px]" />
              ) : <div className="w-[170px] h-[170px] bg-zinc-800 animate-pulse rounded-2xl"></div>}
              
              {checking && (
                 <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center border-2 border-green-500/50">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-[8px] font-black text-green-500 uppercase animate-pulse">Scanning Ledger...</p>
                 </div>
              )}
            </div>

            <div className="flex bg-black rounded-full mt-5 p-1 border border-white/5">
              <button onClick={() => setQrMode('smart')} className={`px-5 py-2 rounded-full text-[9px] font-black uppercase transition-all ${qrMode === 'smart' ? 'bg-green-600 text-black shadow-lg' : 'text-zinc-500'}`}>Smart Pay</button>
              <button onClick={() => setQrMode('address')} className={`px-5 py-2 rounded-full text-[9px] font-black uppercase transition-all ${qrMode === 'address' ? 'bg-green-600 text-black shadow-lg' : 'text-zinc-500'}`}>Address Only</button>
            </div>
            
            <div className="mt-5 w-full flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/5">
              <code className="flex-1 text-[9px] text-zinc-500 truncate ml-2 font-mono">{cleanAddr}</code>
              <button onClick={() => {navigator.clipboard.writeText(cleanAddr); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="bg-zinc-800 px-4 py-2 rounded-lg text-[9px] font-black uppercase border border-white/10 active:scale-95 transition-all">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="text-center mb-6 py-5 bg-zinc-900/50 rounded-3xl border border-white/5 relative">
            <p className="text-[9px] text-zinc-500 font-black uppercase mb-1 font-mono">${data.p} USD</p>
            <p className="text-4xl font-black text-green-500 tracking-tighter">{bchPrice} <span className="text-sm font-light">BCH</span></p>
          </div>

          <button onClick={() => setChecking(true)} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-[1.5rem] transition-all shadow-[0_10px_30px_rgba(22,163,74,0.2)] uppercase tracking-tighter text-xl active:scale-95">
            {checking ? 'Awaiting Payment...' : 'Verify Transaction'}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-[#16161a] p-10 rounded-[3rem] border border-green-500/30 text-center shadow-2xl animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <span className="text-4xl">💎</span>
           </div>
           <h1 className="text-3xl font-black mb-1 text-white italic uppercase tracking-tighter">Payment Confirmed</h1>
           <p className="text-zinc-500 text-[10px] mb-8 uppercase tracking-[3px] font-bold">Encrypted File Unlocked</p>
           
           <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="w-full bg-green-600 text-black py-5 rounded-2xl font-black block hover:bg-green-500 transition-all uppercase mb-8 shadow-xl text-lg active:scale-95">
             Download File ⚡
           </a>

           {!rating ? (
             <div className="bg-black/40 p-5 rounded-[2rem] border border-white/5 shadow-inner">
               <p className="text-[9px] text-zinc-500 uppercase font-black mb-4 tracking-widest">Rate the Merchant</p>
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
                Feedback Submitted Successfully
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
