'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function UnlockContent() {
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
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoError, setPromoError] = useState('');
    const [currentPrice, setCurrentPrice] = useState(null);
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState('');
    const initialTxHistory = useRef(new Set());
    const isHistoryLoaded = useRef(false);

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            try {
                const decoded = JSON.parse(decodeURIComponent(escape(atob(id))));
                setData(decoded);
                setCurrentPrice(parseFloat(decoded.p));
            } catch {
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
                } catch {
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

    const validateTransaction = async (hash) => {
        setTxHash(hash);
        setChecking(false);
        setIsValidating(true);
        setSecurityStep(0);
        try {
            setTimeout(() => setSecurityStep(1), 1000);
            const res = await fetch(`https://api.blockchair.com/bitcoin-cash/dashboards/transaction/${hash}`);
            const json = await res.json();
            const txData = json.data[hash];
            if (txData && !txData.is_double_spend_detected) {
                setTimeout(() => setSecurityStep(2), 2500);
                setTimeout(() => {
                    setIsValidating(false);
                    setIsPaid(true);
                }, 4000);
            } else {
                setIsValidating(false);
                alert("Double Spend Detected! Payment Rejected.");
            }
        } catch {
            setTimeout(() => setSecurityStep(2), 2500);
            setTimeout(() => {
                setIsValidating(false);
                setIsPaid(true);
            }, 4000);
        }
    };

    useEffect(() => {
        let interval;
        const loadInitialHistory = async () => {
            if (!data?.w) return;
            const rawAddr = data.w;
            const sellerClean = rawAddr.includes(':') ? rawAddr.split(':')[1] : rawAddr;
            try {
                const res = await fetch(`https://rest.mainnet.cash/v1/address/history/${sellerClean}`);
                const history = await res.json();
                history.forEach(tx => initialTxHistory.current.add(tx.tx_hash));
                isHistoryLoaded.current = true;
            } catch {}
        };
        if (data?.w && !isHistoryLoaded.current) loadInitialHistory();

        if (checking && !isPaid && !isValidating && data?.w && bchPrice) {
            const rawAddr = data.w;
            const sellerClean = rawAddr.includes(':') ? rawAddr.split(':')[1] : rawAddr;
            const expectedSats = Math.floor(parseFloat(bchPrice) * 100000000) - 1000;
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`https://rest.mainnet.cash/v1/address/history/${sellerClean}`);
                    const history = await res.json();
                    const newTx = history.find(tx =>
                        !initialTxHistory.current.has(tx.tx_hash) &&
                        tx.value >= expectedSats
                    );
                    if (newTx) {
                        clearInterval(interval);
                        validateTransaction(newTx.tx_hash);
                    }
                } catch {}
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [checking, isPaid, isValidating, data, bchPrice]);

    useEffect(() => {
        const affiliateAddr = searchParams.get('ref');
        const rawAddr = data?.w || '';
        const sellerClean = rawAddr.includes(':') ? rawAddr.split(':')[1] : rawAddr;
        if (data?.a && affiliateAddr && affiliateAddr !== sellerClean) setQrMode('smart');
        else setQrMode('address');
    }, [data, searchParams]);

    if (error) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black uppercase tracking-tighter">{error}</div>;
    if (!data) return <div className="min-h-screen bg-[#09090b] text-white flex justify-center items-center animate-pulse font-black italic tracking-[10px]">LOADING...</div>;

    const rawAddr = data.w || '';
    const cleanAddr = (rawAddr.includes(':') ? rawAddr.split(':')[1] : rawAddr).trim().toLowerCase();
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

    const openWallet = (link) => {
        window.location.href = link;
        setTimeout(() => alert("If wallet didn't open automatically, please copy the address manually."), 1500);
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-12 font-sans relative overflow-hidden">
            {isValidating && <div className="absolute inset-0 flex items-center justify-center text-white">Validating Payment...</div>}
            {!isPaid && !isValidating && (
                <div className="w-full max-w-[480px] bg-[#121214] rounded-[32px] p-8">
                    <h1 className="text-2xl font-black mb-4">{data.n}</h1>
                    <div className="flex justify-center mb-4">
                        <img src={data.pr} className="w-48 h-48 object-cover rounded-xl" />
                    </div>
                    <p className="text-[10px] text-zinc-400 mb-4">{data.d}</p>
                    <div className="mb-4">
                        <button onClick={() => openWallet(standardLink)} className="w-full bg-green-600 py-3 rounded-xl font-black mb-2">Pay with Wallet</button>
                        {isViral && <button onClick={() => openWallet(smartViralLink)} className="w-full bg-green-500 py-3 rounded-xl font-black">Smart Pay (Affiliate)</button>}
                    </div>
                    <p className="text-[9px] text-zinc-500">Amount: {fullPriceBch} BCH (~${currentPrice} USD)</p>
                </div>
            )}
            {isPaid && <div className="w-full max-w-[440px] p-8 bg-green-900 text-black rounded-xl text-center">Payment Received ✅</div>}
        </div>
    );
}

