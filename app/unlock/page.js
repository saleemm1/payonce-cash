'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function UnlockContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPaid, setIsPaid] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [securityStep, setSecurityStep] = useState(0);
    const [checking, setChecking] = useState(false);
    const [data, setData] = useState(null);
    const [bchPrice, setBchPrice] = useState(null);
    const [loadingPrice, setLoadingPrice] = useState(true);
    const [qrMode, setQrMode] = useState('address');
    const [copied, setCopied] = useState('');
    const [rating, setRating] = useState(null);
    const [error, setError] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoError, setPromoError] = useState('');
    const [currentPrice, setCurrentPrice] = useState(null);

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            try {
                const decoded = JSON.parse(decodeURIComponent(escape(atob(id))));
                setData(decoded);
                setCurrentPrice(parseFloat(decoded.p));
            } catch (e) {
                setError("Invalid Secure Link");
            }
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchPrice = async () => {
            if (currentPrice) {
                try {
                    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
                    const json = await res.json();
                    if (json['bitcoin-cash']) {
                        setBchPrice((currentPrice / json['bitcoin-cash'].usd).toFixed(8));
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
    }, [currentPrice]);

    const handleApplyPromo = () => {
        if (data?.pc && data.pc.code === promoCode && !promoApplied) {
            const discount = (parseFloat(data.p) * (parseFloat(data.pc.discount) / 100));
            const newPrice = Math.max(0, parseFloat(data.p) - discount);
            setCurrentPrice(newPrice);
            setPromoApplied(true);
            setPromoError('');
        } else {
            setPromoError('Invalid Code');
        }
    };

    const startValidation = () => {
        setChecking(false);
        setIsValidating(true);
        setTimeout(() => setSecurityStep(1), 1000);
        setTimeout(() => setSecurityStep(2), 2500);
        setTimeout(() => {
            setIsValidating(false);
            setIsPaid(true);
        }, 4000);
    };

    useEffect(() => {
        let interval;
        if (checking && !isPaid && !isValidating && data?.w) {
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
                            startValidation();
                        }
                    } else if (sellerOk) {
                        startValidation();
                    }
                } catch (err) { console.error(err); }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [checking, isPaid, isValidating, data, searchParams]);

    useEffect(() => {
        const affiliateAddr = searchParams.get('ref');
        const sellerClean = data?.w?.includes(':') ? data.w.split(':')[1] : data?.w;
        if (data?.a && affiliateAddr && affiliateAddr !== sellerClean) {
            setQrMode('smart');
        } else {
            setQrMode('address');
        }
    }, [data, searchParams]);

    if (error) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black uppercase tracking-tighter">{error}</div>;
    
    if (!data) return <div className="min-h-screen bg-[#09090b] text-white flex justify-center items-center animate-pulse font-black italic tracking-[10px]">LOADING...</div>;

    const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
    const affiliateAddr = searchParams.get('ref');
    const isViral = data.a && affiliateAddr && (affiliateAddr !== cleanAddr);

    const fullPriceBch = bchPrice || "0";
    const sellerAmt = isViral ? (parseFloat(fullPriceBch) * 0.9).toFixed(8) : fullPriceBch;
    const affAmt = isViral ? (parseFloat(fullPriceBch) * 0.1).toFixed(8) : "0";

    const standardLink = `bitcoincash:${cleanAddr}?amount=${fullPriceBch}`;
    const smartViralLink = `bitcoincash:${cleanAddr}?amount=${sellerAmt}&address=${affiliateAddr}&amount=${affAmt}`;

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(''), 2000);
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-12 font-sans relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.1)_0%,_transparent_60%)] pointer-events-none"></div>

            {isValidating && (
                 <div className="w-full max-w-[440px] bg-[#121214] p-10 rounded-[40px] border-2 border-zinc-800 text-center shadow-2xl relative z-50 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col items-center justify-center h-64">
                         <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin"></div>
                            {securityStep >= 1 && <div className="absolute inset-0 flex items-center justify-center text-green-500 text-3xl animate-pulse">⚡</div>}
                         </div>
                         
                         <h2 className="text-xl font-black uppercase italic text-white mb-6 tracking-tight">Securing Transaction...</h2>
                         
                         <div className="w-full space-y-3">
                            <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${securityStep >= 0 ? 'bg-green-900/20 border-green-500/30' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}>
                                <span className="text-[10px] font-bold uppercase text-zinc-300">1. Mempool Detection</span>
                                {securityStep >= 0 && <span className="text-green-500 text-xs font-black">✓</span>}
                            </div>
                            <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${securityStep >= 1 ? 'bg-green-900/20 border-green-500/30' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}>
                                <span className="text-[10px] font-bold uppercase text-zinc-300">2. Double-Spend Analysis</span>
                                {securityStep >= 1 && <span className="text-green-500 text-xs font-black">✓</span>}
                            </div>
                            <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${securityStep >= 2 ? 'bg-green-900/20 border-green-500/30' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}>
                                <span className="text-[10px] font-bold uppercase text-zinc-300">3. Decrypting Asset</span>
                                {securityStep >= 2 && <span className="text-green-500 text-xs font-black">✓</span>}
                            </div>
                         </div>
                    </div>
                 </div>
            )}

            {!isPaid && !isValidating && (
                <div className="w-full max-w-[480px] bg-[#121214] rounded-[32px] border border-white/5 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
                    
                    {isViral && (
                        <div className="absolute -right-12 top-8 bg-green-500 text-black text-[10px] font-black px-12 py-1 rotate-45 uppercase shadow-[0_0_20px_rgba(34,197,94,0.4)] z-20 tracking-widest">
                            VIRAL DEAL
                        </div>
                    )}

                    <div className="p-8">
                        <div className="flex flex-col items-center text-center mb-8">
                            {data.cn && (
                                <div className="mb-6 inline-flex items-center gap-2 bg-green-900/20 border border-green-500/20 px-4 py-1.5 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Bill: {data.cn}</span>
                                </div>
                            )}

                            {data.pr && (
                                <div className="w-full relative mb-6 group overflow-hidden rounded-[24px] border border-white/5">
                                    <img src={data.pr} className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105" alt="Preview" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4 text-left">
                                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-wider mb-1">
                                            Item Preview
                                        </p>
                                    </div>
                                </div>
                            )}

                            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none mb-2">{data.n}</h1>
                            
                            <div className="inline-block bg-white/5 px-3 py-1 rounded-lg border border-white/5 mb-3">
                               <p className="text-[10px] text-green-500/80 font-bold truncate italic uppercase">
                                 {data.fn || "Secure_Attachment.enc"}
                               </p>
                            </div>
                            
                            {isViral && (
                               <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest block">
                                  Affiliate Reward Applied 💸
                               </p>
                            )}
                            
                            {data.d && <div className="mt-4 bg-zinc-900/50 p-3 rounded-xl border border-white/5 w-full text-left">
                                <p className="text-zinc-400 text-[11px] leading-relaxed italic">{data.d}</p>
                            </div>}

                            {data.pc && !isPaid && !promoApplied && (
                                <div className="mt-4 w-full bg-zinc-900/50 p-2 rounded-xl border border-white/5 flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Promo Code" 
                                        value={promoCode} 
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        className="bg-transparent w-full text-xs p-2 outline-none text-white placeholder:text-zinc-600 font-mono"
                                        maxLength={5}
                                    />
                                    <button 
                                        onClick={handleApplyPromo}
                                        className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 rounded-lg uppercase transition-all"
                                    >
                                        Apply
                                    </button>
                                </div>
                            )}
                            {promoError && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase">{promoError}</p>}
                            {promoApplied && <p className="text-[9px] text-green-500 font-bold mt-1 uppercase">Code Applied: {data.pc.discount}% Off</p>}

                        </div>

                        <div className="bg-zinc-900/30 rounded-[24px] border border-white/5 p-6 mb-6">
                            <div className="flex flex-col items-center">
                                {!(isViral && qrMode === 'manual') && (
                                    <div className="bg-white p-4 rounded-[24px] shadow-lg mb-6 relative group cursor-pointer hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-shadow">
                                        {!loadingPrice ? (
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrMode === 'smart' ? (isViral ? smartViralLink : standardLink) : cleanAddr)}`}
                                                alt="QR" className="w-[160px] h-[160px] mix-blend-multiply"
                                            />
                                        ) : <div className="w-[160px] h-[160px] bg-zinc-200 animate-pulse rounded-xl"></div>}
                                        
                                        {checking && (
                                            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-[24px] flex flex-col items-center justify-center">
                                                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                                <p className="text-[8px] font-black text-green-500 uppercase tracking-widest">Scanning...</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex bg-black p-1 rounded-xl border border-white/10 w-full mb-6">
                                    {isViral ? (
                                        <>
                                            <button onClick={() => setQrMode('smart')} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${qrMode === 'smart' ? 'bg-green-600 text-black shadow' : 'text-zinc-500 hover:text-white'}`}>Smart Pay (Electron)</button>
                                            <button onClick={() => setQrMode('manual')} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${qrMode === 'manual' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>Manual Pay</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setQrMode('address')} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${qrMode === 'address' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>Address</button>
                                            <button onClick={() => setQrMode('smart')} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${qrMode === 'smart' ? 'bg-green-600 text-black shadow' : 'text-zinc-500 hover:text-white'}`}>Smart Pay</button>
                                        </>
                                    )}
                                </div>

                                {qrMode === 'address' && !isViral && (
                                    <div className="w-full bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-3 group hover:border-white/20 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">🏁</div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-[8px] text-zinc-500 font-black uppercase mb-0.5">Recipient Address</p>
                                            <p className="text-[10px] font-mono text-zinc-300 truncate">{cleanAddr}</p>
                                        </div>
                                        <button onClick={() => copyToClipboard(cleanAddr, 'seller')} className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-[10px] text-white transition-all">
                                            {copied === 'seller' ? 'DONE' : 'COPY'}
                                        </button>
                                    </div>
                                )}

                                {qrMode === 'manual' && isViral && (
                                    <div className="w-full space-y-2">
                                         <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">🏪</div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-[8px] text-zinc-500 font-black uppercase mb-0.5">Seller (90%) - {sellerAmt} BCH</p>
                                                <p className="text-[10px] font-mono text-zinc-300 truncate">{cleanAddr}</p>
                                            </div>
                                            <button onClick={() => copyToClipboard(cleanAddr, 'seller')} className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-[10px] text-white">
                                                {copied === 'seller' ? 'DONE' : 'COPY'}
                                            </button>
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">🚀</div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-[8px] text-zinc-500 font-black uppercase mb-0.5">Promoter (10%) - {affAmt} BCH</p>
                                                <p className="text-[10px] font-mono text-zinc-300 truncate">{affiliateAddr}</p>
                                            </div>
                                            <button onClick={() => copyToClipboard(affiliateAddr, 'aff')} className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-[10px] text-white">
                                                {copied === 'aff' ? 'DONE' : 'COPY'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <p className="text-[9px] text-zinc-500 font-black uppercase mb-1 tracking-widest">Total to Send</p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-4xl font-black text-white tracking-tighter tabular-nums">
                                    {fullPriceBch}
                                </span>
                                <span className="text-lg font-bold text-green-500 tracking-tight">BCH</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-1 font-bold">≈ ${currentPrice} USD</p>
                            {isViral && <span className="inline-block mt-2 text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase">Viral Mode Applied</span>}
                        </div>

                        <button 
                            onClick={() => setChecking(true)} 
                            disabled={checking}
                            className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-4 rounded-xl transition-all uppercase tracking-tight text-base shadow-[0_10px_30px_rgba(22,163,74,0.3)] hover:shadow-[0_10px_40px_rgba(22,163,74,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        >
                            {checking ? 'Scanning Blockchain...' : 'Verify Transaction'}
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
                            <button onClick={() => router.push(`/affiliate?product=${searchParams.get('id')}`)} className="w-full py-3 rounded-xl border border-dashed border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 text-[9px] font-black uppercase tracking-widest transition-all">
                                🚀 Become an Affiliate (Earn 10%)
                            </button>
                        )}
                        
                        <div className="mt-6 flex justify-center items-center gap-4 opacity-30 grayscale">
                             <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold">Non-Custodial</span>
                             </div>
                             <div className="w-1 h-1 bg-white rounded-full"></div>
                             <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold">P2P Settlement</span>
                             </div>
                        </div>

                    </div>
                </div>
            )}

            {isPaid && !isValidating && (
                <div className="w-full max-w-[440px] bg-[#121214] p-10 rounded-[40px] border-2 border-green-500/30 text-center shadow-[0_0_100px_rgba(34,197,94,0.15)] animate-in zoom-in-95 duration-500 relative overflow-hidden">
                    
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        
                        <h1 className="text-3xl font-black mb-2 italic uppercase tracking-tighter text-white">Access Granted</h1>
                        <p className="text-green-500 text-[10px] mb-8 uppercase tracking-[4px] font-black">
                            Payment Verified on Blockchain
                        </p>
                        
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-8 text-left relative overflow-hidden group">
                             <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                             
                             <p className="text-[9px] text-zinc-500 uppercase font-black mb-2 tracking-wider">
                                {data.dt === 'file' ? 'Decrypted Content:' : 'Your Asset'}
                             </p>
                             {data.dt === 'file' ? (
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-bold truncate pr-4">{data.fn || 'Download File'}</span>
                                    <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="bg-white text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:scale-105 transition-transform">
                                        Download
                                    </a>
                                </div>
                             ) : (
                                <div>
                                    <p className="text-white font-mono text-sm break-all select-all leading-relaxed bg-black/50 p-3 rounded-lg border border-white/5">{data.i}</p>
                                    <p className="text-[8px] text-zinc-600 mt-2 text-right">Click text to select</p>
                                </div>
                             )}
                        </div>

                        <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest mb-8 flex items-center justify-center gap-2 transition-all">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                             Download Official Receipt
                        </button>

                        {!rating ? (
                            <div className="bg-black/40 p-5 rounded-[24px] border border-white/5">
                                <p className="text-[9px] text-zinc-500 uppercase font-black mb-4 tracking-widest">Quality Feedback</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setRating('pos')} className="flex-1 bg-zinc-900/50 hover:bg-green-500/10 rounded-2xl transition-all text-[10px] font-black uppercase border border-white/5 group border-b-2 border-b-transparent hover:border-b-green-500 p-5">
                                        <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">👍</span> Trusted
                                    </button>
                                    <button onClick={() => setRating('neg')} className="flex-1 bg-zinc-900/50 hover:bg-red-500/10 rounded-2xl transition-all text-[10px] font-black uppercase border border-white/5 group border-b-2 border-b-transparent hover:border-b-red-500 p-5">
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
                </div>
            )}
        </div>
    );
}

export default function UnlockPage() {
    return <Suspense fallback={null}><UnlockContent /></Suspense>;
}
