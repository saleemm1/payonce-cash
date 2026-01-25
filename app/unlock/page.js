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

  const type = searchParams.get('type') || 'content';
  const productName = searchParams.get('name') || 'Premium Content';
  const usdAmount = parseFloat(searchParams.get('usd') || '0');
  const sellerWallet = searchParams.get('wallet') || '';
  const sellerName = searchParams.get('seller') || 'Verified Seller';
  const sellerEmail = searchParams.get('email') || '';
  const preview = searchParams.get('preview') || '';
  const note = searchParams.get('note') || '';

  const getCleanWallet = (addr) => {
    if (!addr) return '';
    return addr.includes(':') ? addr.split(':')[1] : addr;
  };

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
    if (checking && !isPaid && sellerWallet) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`https://rest.mainnet.cash/v1/address/balance/${getCleanWallet(sellerWallet)}`);
          const data = await res.json();
          if (data.unconfirmed >= 0 || data.confirmed > 0) {
            setIsPaid(true);
            setChecking(false);
          }
        } catch (err) { console.error(err); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [checking, isPaid, sellerWallet]);

  const qrData = `bitcoincash:${getCleanWallet(sellerWallet)}?amount=${bchPrice}`;

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-8 font-sans">
      {!isPaid ? (
        <div className="w-full max-w-md bg-[#18181b] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">{type === 'invoice' ? 'To Seller' : 'Seller'}</p>
              <p className="text-sm font-black text-green-500">{sellerName}</p>
            </div>
            {preview && (
              <a href={preview} target="_blank" className="bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-xl text-[10px] font-bold transition-all border border-white/10">
                VIEW PREVIEW 👁️
              </a>
            )}
          </div>

          <div className="text-center mb-6">
             <h1 className="text-3xl font-black text-white capitalize leading-tight">{productName}</h1>
             {note && <p className="text-zinc-400 text-xs mt-2 italic">{note}</p>}
             <p className="text-zinc-500 text-[10px] mt-1">Support: {sellerEmail}</p>
          </div>

          <div className="flex justify-center mb-6 relative">
            <div className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              {!loadingPrice && (
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`} alt="BCH QR" className="w-[180px] h-[180px]" />
              )}
              {loadingPrice && <div className="w-[180px] h-[180px] bg-zinc-800 animate-pulse rounded-lg"></div>}
            </div>
            {checking && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-xs font-black text-green-500 animate-pulse uppercase">Searching for Payment...</p>
              </div>
            )}
          </div>

          <div className="text-center mb-6 py-4 bg-zinc-900/50 rounded-2xl border border-white/5">
            {loadingPrice ? (
              <p className="text-zinc-500 animate-pulse italic text-xs">Fetching Market Rates...</p>
            ) : (
              <>
                <p className="text-4xl font-black text-green-500 tracking-tight">{bchPrice} <span className="text-lg font-light">BCH</span></p>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">Total to pay: ${usdAmount} USD</p>
              </>
            )}
          </div>

          <button onClick={() => setChecking(true)} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl transition-all shadow-lg mb-4 uppercase tracking-tighter text-lg">
            {checking ? 'Checking Ledger...' : 'I HAVE SENT PAYMENT'}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
          {type === 'invoice' ? (
            <div className="bg-white text-black p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl italic">PAID</div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase italic">Official Receipt</h2>
                  <p className="text-[10px] text-zinc-500 font-bold tracking-tighter">{new Date().toLocaleString()}</p>
                </div>
                <div className="bg-green-500 text-white p-2 rounded-lg font-bold italic shadow-lg">BCH</div>
              </div>
              <div className="space-y-4 border-t border-b border-zinc-100 py-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-[10px] font-black uppercase">Client</span>
                  <span className="font-black text-sm">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-[10px] font-black uppercase">Seller</span>
                  <span className="font-black text-sm">{sellerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-[10px] font-black uppercase">Ref Note</span>
                  <span className="font-medium text-[10px] text-right max-w-[150px]">{note || 'No description provided'}</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-zinc-400 text-[10px] font-black uppercase">Settled Amount</span>
                <span className="text-3xl font-black text-green-600">${usdAmount} USD</span>
              </div>
              <p className="text-[9px] text-zinc-400 font-bold italic text-right uppercase tracking-widest">Transaction Verified on Chain</p>
              <button onClick={() => window.print()} className="w-full mt-6 py-3 border-2 border-dashed border-zinc-200 rounded-xl text-[10px] font-black uppercase text-zinc-400 hover:bg-zinc-50 transition-all">Save PDF Receipt</button>
            </div>
          ) : (
            <div className="bg-[#18181b] p-10 rounded-3xl border border-green-500/30 text-center shadow-2xl">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl text-green-500">✅</span>
              </div>
              <h1 className="text-3xl font-black mb-2 text-white italic uppercase">Access Granted!</h1>
              <p className="text-zinc-400 text-xs mb-8">Payment verified. You can now access your asset.</p>
              <button className="w-full bg-green-600 text-black py-5 rounded-2xl font-black mb-8 hover:bg-green-500 transition-all uppercase text-lg shadow-xl shadow-green-900/20">Download / Access Content</button>
              {!rating ? (
                <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mb-3 tracking-widest text-center">Rate this transaction</p>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => setRating('pos')} className="flex-1 p-3 bg-zinc-800 hover:bg-green-500/20 rounded-xl transition-all border border-white/5 text-xs font-bold uppercase">👍 Good</button>
                    <button onClick={() => setRating('neg')} className="flex-1 p-3 bg-zinc-800 hover:bg-red-500/20 rounded-xl transition-all border border-white/5 text-xs font-bold uppercase">👎 Bad</button>
                  </div>
                </div>
              ) : (
                <p className="text-green-500 font-black text-xs uppercase tracking-widest animate-pulse italic">Feedback Received • Thank You</p>
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
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center font-black italic uppercase">Initializing Secure Terminal...</div>}>
      <UnlockContent />
    </Suspense>
  );
}
