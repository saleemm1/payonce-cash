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
        <div className="min-h-screen bg-[#0b0b0d] text-zinc-300 flex flex-col items-center justify-center px-4 py-12 font-sans selection:bg-green-500 selection:text-black">
            {!isPaid ? (
                <div className="w-full max-w-[440px] bg-[#16161a] p-1 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden transition-all">
                    {isViral && (
                        <div className="absolute -right-12 top-7 bg-green-500 text-black text-[10px] font-black px-12 py-1 rotate-45 uppercase z-10 shadow-xl">
                            5% OFF
                        </div>
                    )}

                    <div className="p-7">
                        <div className="flex flex-col items-center text-center">
                            {data.cn && (
                                <div className="mb-6 bg-green-500/5 border border-green-500/10 px-4 py-1.5 rounded-full">
                                    <span className="text-[10px] text-green-500 font-black uppercase tracking-[2px]">Bill: {data.cn}</span>
                                </div>
                            )}

                            {data.pr && (
                                <div className="w-full relative mb-6 group">
                                    <img src={data.pr} className="w-full h-48 object-cover rounded-[2rem] border border-white/5 shadow-inner transition-transform group-hover:scale-[1.02] duration-500" alt="Preview" />
                                    <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]"></div>
                                </div>
                            )}

                            <div className="mb-6">
                                <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest block mb-2 opacity-60">Digital Asset</span>
                                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none mb-2">{data.n}</h1>
                                <div className="inline-block bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                    <p className="text-[10px] text-green-500/80 font-bold truncate italic uppercase">
                                        {data.fn || "Secure_Attachment.enc"}
                                    </p>
                                </div>
                            </div>

                            {data.d && <p className="text-zinc-400 text-[12px] mb-8 leading-relaxed italic opacity-80 max-w-[90%]">{data.d}</p>}
                        </div>

                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-white p-5 rounded-[2.5rem] shadow-[0_0_60px_rgba(34,197,94,0.1)] relative transition-all hover:shadow-[0_0_80px_rgba(34,197,94,0.15)]">
                                {!loadingPrice ? (
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(isViral ? smartViralLink : (qrMode === 'smart' ? standardLink : cleanAddr))}`}
                                        alt="QR" className="w-[180px] h-[180px] rounded-lg"
                                    />
                                ) : <div className="w-[180px] h-[180px] bg-zinc-800 animate-pulse rounded-2xl"></div>}
                                
                                {checking && (
                                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-green-500/40 animate-in fade-in duration-300">
                                        <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Searching Network...</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex bg-black/50 rounded-2xl mt-8 p-1 border border-white/5 w-full">
                                <button onClick={() => setQrMode('address')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${qrMode === 'address' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Address</button>
                                <button onClick={() => setQrMode('smart')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${qrMode === 'smart' ? 'bg-green-600 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Smart Pay</button>
                            </div>

                            {qrMode === 'address' && (
                                <div className="mt-4 w-full flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 group">
                                    <code className="flex-1 text-[10px] text-zinc-500 truncate ml-3 font-mono group-hover:text-zinc-300 transition-colors">{cleanAddr}</code>
                                    <button onClick={() => copyToClipboard(cleanAddr)} className="bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all active:scale-95 text-white border border-white/5">
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="text-center mb-8 py-6 bg-gradient-to-b from-zinc-900/50 to-transparent rounded-[2rem] border border-white/5 relative overflow-hidden">
                            <p className="text-[10px] text-zinc-500 font-black uppercase mb-2 tracking-[3px]">
                                Total Amount Due
                            </p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-5xl font-black text-green-500 tracking-tighter tabular-nums">
                                    {isViral ? discountTotal : bchPrice}
                                </span>
                                <span className="text-lg font-bold text-zinc-400">BCH</span>
                            </div>
                            <p className="text-[10px] text-zinc-600 mt-2 font-bold italic">
                                ≈ {isViral ? (data.p * 0.95).toFixed(2) : data.p} USD
                            </p>
                        </div>

                        <button onClick={() => setChecking(true)} className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl transition-all uppercase tracking-tight text-lg active:scale-[0.98] mb-4 shadow-[0_10px_30px_rgba(22,163,74,0.2)] group">
                            {checking ? 'Awaiting Payment...' : 'Verify Transaction'}
                        </button>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                           <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                                <span className="text-[7px] font-black text-zinc-600 uppercase block mb-1">Seller</span>
                                <span className="text-[11px] font-bold text-white truncate block">{data.sn}</span>
                           </div>
                           <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                                <span className="text-[7px] font-black text-zinc-600 uppercase block mb-1">Support</span>
                                <span className="text-[11px] font-bold text-green-500/70 truncate block">{data.se}</span>
                           </div>
                        </div>

                        {data.a && !affiliateAddr && (
                            <button onClick={() => router.push(`/affiliate?product=${searchParams.get('id')}`)} className="w-full bg-white/5 hover:bg-white/10 text-zinc-400 py-4 rounded-2xl border border-white/5 text-[9px] font-black uppercase tracking-[2px] transition-colors">
                                🚀 Become an Affiliate (Earn 10%)
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-[440px] bg-[#16161a] p-10 rounded-[3rem] border border-green-500/20 text-center shadow-2xl animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                        <span className="text-5xl animate-bounce">💎</span>
                    </div>
                    <h1 className="text-4xl font-black mb-2 italic uppercase tracking-tighter text-white">Access Granted</h1>
                    <p className="text-zinc-500 text-[11px] mb-10 uppercase tracking-[4px] font-bold">Encrypted Data Unlocked</p>
                    
                    <div className="mb-10 text-left bg-black/40 p-5 rounded-2xl border border-white/5 relative">
                        <p className="text-[8px] text-zinc-600 uppercase font-black mb-2 tracking-widest">Asset Name:</p>
                        <p className="text-white font-black italic uppercase tracking-tight text-md">{data.n}</p>
                    </div>

                    {data.dt === 'file' ? (
                        <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="w-full bg-green-600 text-black py-6 rounded-2xl font-black block hover:bg-green-500 transition-all uppercase mb-10 shadow-xl text-xl tracking-tighter active:scale-95">
                            Download Now ⚡
                        </a>
                    ) : (
                        <div className="bg-zinc-900/80 p-6 rounded-2xl border border-white/5 mb-10 break-all shadow-inner text-left relative group">
                            <p className="text-[10px] text-zinc-500 uppercase font-black mb-3">Decrypted Content:</p>
                            <p className="text-green-500 font-mono text-sm leading-relaxed">{data.i}</p>
                        </div>
                    )}

                    {!rating ? (
                        <div className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
                            <p className="text-[9px] text-zinc-500 uppercase font-black mb-5 tracking-[3px] text-center">Quality Feedback</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setRating('pos')} className="flex-1 p-5 bg-zinc-900/50 hover:bg-green-500/10 rounded-2xl transition-all text-[10px] font-black uppercase border border-white/5 group border-b-2 border-b-transparent hover:border-b-green-500">
                                    <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">👍</span> Trusted
                                </button>
                                <button onClick={() => setRating('neg')} className="flex-1 p-5 bg-zinc-900/50 hover:bg-red-500/10 rounded-2xl transition-all text-[10px] font-black uppercase border border-white/5 group border-b-2 border-b-transparent hover:border-b-red-500">
                                    <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">👎</span> Avoid
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-5 bg-green-600/10 text-green-500 border border-green-500/20 rounded-2xl font-black text-[10px] uppercase italic tracking-[2px] animate-pulse">
                            Verification Recorded
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
