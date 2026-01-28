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
      } catch {
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
      const isViral = data.a && affiliateAddr && affiliateAddr !== sellerClean;
      const affClean = affiliateAddr ? (affiliateAddr.includes(':') ? affiliateAddr.split(':')[1] : affiliateAddr) : null;

      interval = setInterval(async () => {
        try {
          const sBal = await fetch(`https://rest.mainnet.cash/v1/address/balance/${sellerClean}`).then(r => r.json());
          const sellerOk = sBal.unconfirmed > 0 || sBal.confirmed > 0;

          if (isViral && affClean) {
            const aBal = await fetch(`https://rest.mainnet.cash/v1/address/balance/${affClean}`).then(r => r.json());
            const promoterOk = aBal.unconfirmed > 0 || aBal.confirmed > 0;
            if (sellerOk && promoterOk) {
              setIsPaid(true);
              setChecking(false);
            }
          } else if (sellerOk) {
            setIsPaid(true);
            setChecking(false);
          }
        } catch {}
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [checking, isPaid, data, searchParams]);

  if (error) return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center font-black uppercase">{error}</div>;
  if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center animate-pulse font-black italic tracking-[10px]">LOADING...</div>;

  const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
  const affiliateAddr = searchParams.get('ref');
  const isViral = data.a && affiliateAddr && affiliateAddr !== cleanAddr;

  const discountTotal = bchPrice ? (parseFloat(bchPrice) * 0.95).toFixed(8) : "0";
  const sellerAmt = (parseFloat(discountTotal) * 0.9).toFixed(8);
  const affAmt = (parseFloat(discountTotal) * 0.1).toFixed(8);

  const standardLink = `bitcoincash:${cleanAddr}?amount=${bchPrice}`;
  const smartViralLink = `bitcoincash:${cleanAddr}?amount=${sellerAmt}&address=${affiliateAddr}&amount=${affAmt}`;

  const copyToClipboard = (t) => {
    navigator.clipboard.writeText(t);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white flex items-center justify-center px-4 py-10">
      {!isPaid ? (
        <div className="w-full max-w-md bg-[#16161a] rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          {isViral && <div className="absolute -right-14 top-6 bg-green-600 text-black text-[9px] font-black px-14 py-1 rotate-45">5% DISCOUNT</div>}

          <div className="p-8 space-y-6 text-center">
            <h1 className="text-3xl font-black italic tracking-tighter">{data.n}</h1>
            <p className="text-zinc-500 text-[11px]">{data.fn || "Secure_Attachment.enc"}</p>

            <div className="bg-white p-4 rounded-[2rem] shadow-[0_0_40px_rgba(34,197,94,0.15)]">
              {!loadingPrice && (
                <img
                  className="mx-auto w-[180px] h-[180px]"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    isViral ? smartViralLink : (qrMode === 'smart' ? standardLink : cleanAddr)
                  )}`}
                />
              )}
            </div>

            {!isViral && (
              <>
                <div className="flex bg-black rounded-full p-1 border border-white/10">
                  <button onClick={() => setQrMode('address')} className={`flex-1 py-2 rounded-full text-[10px] font-black ${qrMode === 'address' ? 'bg-green-600 text-black' : 'text-zinc-500'}`}>Address</button>
                  <button onClick={() => setQrMode('smart')} className={`flex-1 py-2 rounded-full text-[10px] font-black ${qrMode === 'smart' ? 'bg-green-600 text-black' : 'text-zinc-500'}`}>Smart Pay</button>
                </div>

                <div className="flex items-center gap-2 bg-black/40 p-3 rounded-xl border border-white/10">
                  <code className="flex-1 text-[10px] text-zinc-400 truncate font-mono">{cleanAddr}</code>
                  <button onClick={() => copyToClipboard(cleanAddr)} className="bg-zinc-800 px-4 py-2 rounded-lg text-[10px] font-black">
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </>
            )}

            <div className="py-4 bg-zinc-900/60 rounded-2xl">
              <p className="text-[10px] text-zinc-500 uppercase">Total</p>
              <p className="text-4xl font-black text-green-500">{isViral ? discountTotal : bchPrice} BCH</p>
            </div>

            <button onClick={() => setChecking(true)} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl text-xl">
              {checking ? 'Awaiting Payment...' : 'Verify Payment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-[#16161a] p-10 rounded-[3rem] border border-green-500 text-center shadow-2xl">
          <h1 className="text-4xl font-black italic mb-6">Access Granted</h1>

          {data.dt === 'file' ? (
            <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="block bg-green-600 text-black py-5 rounded-2xl font-black">
              Download
            </a>
          ) : (
            <div className="bg-black p-6 rounded-2xl text-green-500 font-mono break-all">
              {data.i}
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
