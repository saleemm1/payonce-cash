'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function UnlockContent() {
  const searchParams = useSearchParams();
  const [isPaid, setIsPaid] = useState(false);
  const [checking, setChecking] = useState(false);
  const [bchPrice, setBchPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [rating, setRating] = useState(null);
  const [qrMode, setQrMode] = useState('smart');
  const [copied, setCopied] = useState(false);

  const type = searchParams.get('type') || 'content';
  const productName = searchParams.get('name') || 'Premium Content';
  const usdAmount = parseFloat(searchParams.get('usd') || '0');
  const sellerWallet = searchParams.get('wallet') || '';
  const sellerName = searchParams.get('seller') || 'The Merchant';
  const preview = searchParams.get('preview') || '';
  const note = searchParams.get('note') || '';
  const isAffiliate = searchParams.get('aff') === 'true';
  const productCode = searchParams.get('code') || '';

  const getCleanWallet = (addr) => {
    if (!addr) return '';
    let clean = addr.trim();
    if (clean.includes(':')) {
      clean = clean.split(':')[1];
    }
    return clean;
  };

  const cleanAddr = getCleanWallet(sellerWallet);

  useEffect(() => {
    const fetchBchRate = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
        const data = await res.json();
        const rate = data['bitcoin-cash'].usd;
        setBchPrice((usdAmount / rate).toFixed(8));
        setLoadingPrice(false);
      } catch (err) { console.error(err); }
    };
    if (usdAmount > 0) fetchBchRate();
  }, [usdAmount]);

  useEffect(() => {
    let interval;
    if (checking && !isPaid && cleanAddr) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`https://rest.mainnet.cash/v1/address/balance/${cleanAddr}`);
          const data = await res.json();
          if (data.unconfirmed > 0 || data.confirmed > 0) {
            setIsPaid(true);
            setChecking(false);
          }
        } catch (err) { console.error(err); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [checking, isPaid, cleanAddr]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const smartLink = `bitcoincash:${cleanAddr}?amount=${bchPrice}`;
  const addressOnlyLink = cleanAddr;

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-8 font-sans">
      {!isPaid ? (
        <div className="w-full max-w-md bg-[#18181b] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          {isAffiliate && (
            <div className="absolute -right-12 top-6 bg-green-600 text-black text-[8px] font-black px-12 py-1 rotate-45 uppercase tracking-tighter shadow-lg">
              Viral Mode Active
            </div>
          )}
          
          <div className="flex items-center justify-between mb-6 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Merchant</p>
              <p className="text-sm font-black text-green-500">{sellerName}</p>
            </div>
            {preview && (
              <a href={preview} target="_blank" className="bg-green-600 px-3 py-2 rounded-xl text-[10px] font-black text-black transition-all hover:scale-105 active:scale-95">
                PREVIEW 👁️
              </a>
            )}
          </div>

          <div className="text-center mb-6">
             <h1 className="text-2xl font-black text-white capitalize italic tracking-tighter">{productName}</h1>
             {note && <p className="text-zinc-400 text-[10px] mt-2 bg-white/5 p-2 rounded-lg leading-relaxed">{note}</p>}
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.15)] relative">
              {!loadingPrice && (
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrMode === 'smart' ? smartLink : addressOnlyLink)}`} 
                  alt="BCH QR" 
                  className="w-[180px] h-[180px]" 
                />
              )}
              {loadingPrice && <div className="w-[180px] h-[180px] bg-zinc-800 animate-pulse rounded-2xl"></div>}
              
              {checking && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-[9px] font-black text-green-500 animate-pulse uppercase">Searching Ledger...</p>
                </div>
              )}
            </div>

            <div className="flex bg-black rounded-full mt-4 p-1 border border-white/10">
              <button onClick={() => setQrMode('smart')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${qrMode === 'smart' ? 'bg-green-600 text-black' : 'text-zinc-500 hover:text-white'}`}>Smart Pay</button>
              <button onClick={() => setQrMode('address')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${qrMode === 'address' ? 'bg-green-600 text-black' : 'text-zinc-500 hover:text-white'}`}>Address Only</button>
            </div>

            <div className="mt-4 w-full flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/5">
              <code className="flex-1 text-[9px] text-zinc-400 truncate ml-2 font-mono">{cleanAddr}</code>
              <button onClick={() => copyToClipboard(cleanAddr)} className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border border-white/10 min-w-[60px]">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="text-center mb-6 py-4 bg-zinc-900/50 rounded-2xl border border-white/5 relative">
            <p className="text-[9px] text-zinc-500 font-black uppercase mb-1">Total to Pay</p>
            <p className="text-3xl font-black text-green-500 tracking-tight">{bchPrice} <span className="text-sm font-light">BCH</span></p>
            <div className="absolute -top-2 -right-2 bg-zinc-800 text-[8px] px-2 py-1 rounded-md border border-white/10 font-bold">${usdAmount} USD</div>
          </div>

          <button onClick={() => setChecking(true)} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl transition-all shadow-xl shadow-green-900/10 uppercase tracking-tighter text-lg active:scale-95">
            {checking ? 'Awaiting Payment...' : 'Unlock Content Now'}
          </button>
          
          <p className="text-center text-[9px] text-zinc-600 mt-4 uppercase font-bold tracking-[2px]">Secured by Bitcoin Cash</p>
        </div>
      ) : (
        <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
          {type === 'invoice' ? (
            <div className="bg-white text-black p-8 rounded-[2rem] shadow-2xl relative overflow-hidden border-[12px] border-green-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl italic">PAID</div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase italic">Official Receipt</h2>
                  <p className="text-[10px] text-zinc-500 font-bold">{new Date().toLocaleString()}</p>
                </div>
                <div className="bg-green-500 text-white p-2 rounded-lg font-bold italic shadow-lg">BCH</div>
              </div>
              <div className="space-y-4 border-t border-b border-zinc-100 py-6 mb-6 font-mono">
                <div className="flex justify-between uppercase">
                  <span className="text-zinc-400 text-[10px] font-black">Description</span>
                  <span className="font-black text-sm">{productName}</span>
                </div>
                <div className="flex justify-between uppercase">
                  <span className="text-zinc-400 text-[10px] font-black">Vendor</span>
                  <span className="font-black text-sm">{sellerName}</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-zinc-400 text-[10px] font-black uppercase">Total Paid</span>
                <span className="text-3xl font-black text-green-600">${usdAmount} USD</span>
              </div>
              <button onClick={() => window.print()} className="w-full mt-6 py-3 border-2 border-dashed border-zinc-300 rounded-xl text-[10px] font-black uppercase text-zinc-500 hover:bg-zinc-50 transition-all">Print Receipt</button>
            </div>
          ) : (
            <div className="bg-[#18181b] p-10 rounded-3xl border border-green-500/30 text-center shadow-2xl">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✅</span>
              </div>
              <h1 className="text-3xl font-black mb-2 text-white italic uppercase">Access Granted</h1>
              <p className="text-zinc-400 text-xs mb-8">Your transaction was confirmed on the blockchain.</p>
              
              {productCode ? (
                <div className="bg-black p-6 rounded-2xl border border-dashed border-zinc-700 mb-8 group relative">
                  <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 italic">Your License Key / Code</p>
                  <code className="text-green-500 font-black text-xl tracking-widest break-all select-all">{productCode}</code>
                  <button onClick={() => copyToClipboard(productCode)} className="block mt-4 mx-auto text-[9px] text-zinc-400 underline uppercase font-bold">{copied ? 'Copied' : 'Copy Code'}</button>
                </div>
              ) : (
                <button className="w-full bg-green-600 text-black py-5 rounded-2xl font-black mb-8 hover:bg-green-500 transition-all uppercase text-lg shadow-[0_10px_30px_rgba(34,197,94,0.3)]">Download Files</button>
              )}

              {!rating ? (
                <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-zinc-500 uppercase font-black mb-3">Rate this merchant</p>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => setRating('pos')} className="flex-1 p-3 bg-zinc-800 hover:bg-green-500/20 rounded-xl transition-all text-xs font-bold uppercase border border-white/5">👍 Trusted</button>
                    <button onClick={() => setRating('neg')} className="flex-1 p-3 bg-zinc-800 hover:bg-red-500/20 rounded-xl transition-all text-xs font-bold uppercase border border-white/5">👎 Avoid</button>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse py-2 bg-green-500/10 rounded-xl border border-green-500/20">
                   <p className="text-green-500 font-black text-[10px] uppercase italic">Feedback Recorded Successfully</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function UnlockPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center font-black italic uppercase tracking-[5px] animate-pulse">Initializing Terminal...</div>}>
      <UnlockContent />
    </Suspense>
  );
}
