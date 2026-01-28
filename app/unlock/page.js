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
    const [copied, setCopied] = useState('');
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
        const fetchPrice = async () => {
            if (data?.p) {
                try {
                    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
                    const json = await res.json();
                    if (json['bitcoin-cash']) {
                        setBchPrice((parseFloat(data.p) / json['bitcoin-cash'].usd).toFixed(8));
                        setLoadingPrice(false);
                    }
                } catch (e) {
                    setLoadingPrice(false);
                }
            }
        };
        fetchPrice();
        const interval = setInterval(fetchPrice, 60000);
        return () => clearInterval(interval);
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

    useEffect(() => {
        const affiliateAddr = searchParams.get('ref');
        const sellerClean = data?.w?.includes(':') ? data.w.split(':')[1] : data?.w;
        if (data?.a && affiliateAddr && affiliateAddr !== sellerClean) {
            setQrMode('manual');
        } else {
            setQrMode('address');
        }
    }, [data, searchParams]);

    if (error) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black uppercase tracking-tighter">{error}</div>;
    if (!data) return <div className="min-h-screen bg-[#0b0b0d] text-white flex justify-center items-center animate-pulse font-black italic tracking-[10px]">LOADING...</div>;

    const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
    const affiliateAddr = searchParams.get('ref');
    const isViral = data.a && affiliateAddr && (affiliateAddr !== cleanAddr);

    const fullPriceBch = bchPrice || "0";
    const discountTotal = bchPrice ? (parseFloat(bchPrice) * 0.95).toFixed(8) : "0";
    const sellerAmt = isViral ? (parseFloat(discountTotal) * 0.9).toFixed(8) : fullPriceBch;
    const affAmt = isViral ? (parseFloat(discountTotal) * 0.1).toFixed(8) : "0";

    const standardLink = `bitcoincash:${cleanAddr}?amount=${fullPriceBch}`;
    const smartViralLink = `bitcoincash:${cleanAddr}?amount=${sellerAmt}&address=${affiliateAddr}&amount=${affAmt}`;

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(''), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0b0b0d] text-zinc-300 flex flex-col items-center justify-center px-4 py-12 font-sans selection:bg-green-500 selection:text-black">
            {!isPaid ? (
                <div className="w-full max-w-[460px] bg-[#16161a] p-1 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden transition-all">
                    {isViral && (
                        <div className="absolute -right-12 top-7 bg-green-500 text-black text-[10px] font-black px-12 py-1 rotate-45 uppercase z-10 shadow-xl">
                            5% DISCOUNT
                        </div>
                    )}

                    <div className="p-7">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[2px]">Secured Link</span>
                            </div>

                            <div className="mb-6">
                                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none mb-3">{data.n}</h1>
                                {isViral && (
                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest bg-green-500/10 py-1 px-3 rounded-lg inline-block">
                                        Affiliate Reward Applied 💸
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center mb-8">
                            {!(isViral && qrMode === 'manual') && (
                                <div className="bg-white p-5 rounded-[2.5rem] shadow-[0_0_60px_rgba(34,197,94,0.1)] relative">
                                    {!loadingPrice ? (
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrMode === 'smart' ? (isViral ? smartViralLink : standardLink) : cleanAddr)}`}
                                            alt="QR" className="w-[180px] h-[180px] rounded-lg"
                                        />
                                    ) : <div className="w-[180px] h-[180px] bg-zinc-800 animate-pulse rounded-2xl"></div>}
                                    
                                    {checking && (
                                        <div className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-green-500/40">
                                            <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Verifying...</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex bg-black/50 rounded-2xl mt-8 p-1 border border-white/5 w-full">
                                {isViral ? (
                                    <>
                                        <button onClick={() => setQrMode('manual')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${qrMode === 'manual' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Manual Pay</button>
                                        <button onClick={() => setQrMode('smart')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${qrMode === 'smart' ? 'bg-green-600 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Smart Pay (Electron)</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setQrMode('address')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${qrMode === 'address' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Address</button>
                                        <button onClick={() => setQrMode('smart')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${qrMode === 'smart' ? 'bg-green-600 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Smart Pay</button>
                                    </>
                                )}
                            </div>

                            <div className="mt-6 w-full space-y-3">
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 relative group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Recipient: Seller {isViral && '(90%)'}</span>
                                        <span className="text-[10px] font-bold text-green-500">{sellerAmt} BCH</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 text-[10px] text-zinc-400 truncate font-mono">{cleanAddr}</code>
                                        <button onClick={() => copyToClipboard(cleanAddr, 'seller')} className="bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-white border border-white/5 transition-all">
                                            {copied === 'seller' ? 'DONE' : 'COPY'}
                                        </button>
                                    </div>
                                </div>

                                {isViral && (
                                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5 relative group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Recipient: Promoter (10%)</span>
                                            <span className="text-[10px] font-bold text-green-500">{affAmt} BCH</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 text-[10px] text-zinc-400 truncate font-mono">{affiliateAddr}</code>
                                            <button onClick={() => copyToClipboard(affiliateAddr, 'aff')} className="bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-white border border-white/5 transition-all">
                                                {copied === 'aff' ? 'DONE' : 'COPY'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center mb-8 py-6 bg-gradient-to-b from-zinc-900/50 to-transparent rounded-[2rem] border border-white/5">
                            <p className="text-[10px] text-zinc-500 font-black uppercase mb-2 tracking-[3px]">Total To Send</p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-5xl font-black text-green-500 tracking-tighter tabular-nums">
                                    {isViral ? discountTotal : fullPriceBch}
                                </span>
                                <span className="text-lg font-bold text-zinc-400 tracking-tight">BCH</span>
                            </div>
                            {isViral && (
                                <p className="text-[9px] text-green-500/60 mt-2 font-black italic uppercase tracking-tighter">
                                    You saved 5% via affiliate link
                                </p>
                            )}
                        </div>

                        <button onClick={() => setChecking(true)} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl transition-all uppercase tracking-tight text-lg active:scale-[0.98] mb-6 shadow-xl group">
                            {checking ? 'Awaiting Network...' : 'Verify Transaction'}
                        </button>

                        <div className="text-center">
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                                {isViral 
                                    ? (qrMode === 'smart' ? "Smart Pay splits payment for Electron Cash." : "Manual: Send exact amounts to both recipients.")
                                    : "Send the amount to the address to unlock."}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-[440px] bg-[#16161a] p-10 rounded-[3rem] border border-green-500/20 text-center shadow-2xl animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                        <span className="text-5xl animate-bounce">💎</span>
                    </div>
                    <h1 className="text-4xl font-black mb-2 italic uppercase tracking-tighter text-white">Access Granted</h1>
                    <p className="text-zinc-500 text-[11px] mb-10 uppercase tracking-[4px] font-bold">Successfully Decrypted</p>
                    
                    {data.dt === 'file' ? (
                        <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="w-full bg-green-600 text-black py-6 rounded-2xl font-black block hover:bg-green-500 transition-all uppercase mb-10 shadow-xl text-xl tracking-tighter active:scale-95">
                            Download Now ⚡
                        </a>
                    ) : (
                        <div className="bg-zinc-900/80 p-6 rounded-2xl border border-white/5 mb-10 break-all text-left shadow-inner">
                            <p className="text-[10px] text-zinc-500 uppercase font-black mb-3">Unlocked Content:</p>
                            <p className="text-green-500 font-mono text-sm leading-relaxed select-all">{data.i}</p>
                        </div>
                    )}

                    {!rating ? (
                        <div className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
                            <p className="text-[9px] text-zinc-500 uppercase font-black mb-5 tracking-[3px]">Feedback</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setRating('pos')} className="flex-1 p-5 bg-zinc-900/50 hover:bg-green-500/10 rounded-2xl transition-all text-[10px] font-black uppercase border border-white/5 group border-b-2 border-b-transparent hover:border-b-green-500">
                                    <span className="block text-2xl mb-2">👍</span> Trusted
                                </button>
                                <button onClick={() => setRating('neg')} className="flex-1 p-5 bg-zinc-900/50 hover:bg-red-500/10 rounded-2xl transition-all text-[10px] font-black uppercase border border-white/5 group border-b-2 border-b-transparent hover:border-b-red-500">
                                    <span className="block text-2xl mb-2">👎</span> Avoid
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-5 bg-green-600/10 text-green-500 border border-green-500/20 rounded-2xl font-black text-[10px] uppercase italic tracking-[2px]">
                            Rating Submitted
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
