'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const translations = {
  en: {
    back: "Back to Home",
    permissionless: "Permissionless Growth",
    hero1: "Become a",
    hero2: "Partner",
    desc: "Promote any PayOnce product and earn instant crypto commissions directly to your wallet. No sign-up required.",
    step1: "1. Paste Product Link",
    paste: "https://payonce.cash/unlock?cid=...",
    price: "Price:",
    comm: "Commission: 10%",
    unknown: "Unknown Product",
    step2: "2. Your Wallet Address (For Payouts)",
    wallet: "bitcoincash:qpm2q...",
    generate: "Generate Viral Link 🚀",
    unique: "Your Unique Affiliate Link",
    copied: "Copied!",
    copy: "Copy",
    note: "Share this link. When someone buys, the smart contract automatically routes 10% of the sale directly to your wallet instantly.",
    error: "Error generating link",
    invalid: "Invalid Link or Viral Mode not active.",
    disabled: "Viral Mode is DISABLED by the creator for this product.",
    fetching: "Fetching product details..."
  },
  ar: {
    back: "العودة للرئيسية",
    permissionless: "نمو بدون إذن",
    hero1: "كن",
    hero2: "شريكاً",
    desc: "روج لأي منتج PayOnce واربح عمولات فورية مباشرة لمحفظتك. لا تسجيل مطلوب.",
    step1: "1. الصق رابط المنتج",
    paste: "https://payonce.cash/unlock?cid=...",
    price: "السعر:",
    comm: "العمولة: 10%",
    unknown: "منتج غير معروف",
    step2: "2. عنوان محفظتك (للأرباح)",
    wallet: "bitcoincash:qpm2q...",
    generate: "إنشاء الرابط الفيروسي 🚀",
    unique: "رابط التسويق الخاص بك",
    copied: "تم النسخ!",
    copy: "نسخ",
    note: "شارك هذا الرابط. عندما يشتري شخص ما، يوجه العقد الذكي 10% من المبيعات مباشرة لمحفظتك فوراً.",
    error: "خطأ في إنشاء الرابط",
    invalid: "رابط غير صالح أو الوضع الفيروسي غير مفعل.",
    disabled: "الوضع الفيروسي معطل من قبل المنشئ لهذا المنتج.",
    fetching: "جاري جلب تفاصيل المنتج..."
  },
  zh: {
    back: "返回首页",
    permissionless: "无需许可的增长",
    hero1: "成为",
    hero2: "合作伙伴",
    desc: "推广任何 PayOnce 产品并直接赚取即时加密佣金到您的钱包。无需注册。",
    step1: "1. 粘贴产品链接",
    paste: "https://payonce.cash/unlock?cid=...",
    price: "价格:",
    comm: "佣金: 10%",
    unknown: "未知产品",
    step2: "2. 您的钱包地址 (用于收款)",
    wallet: "bitcoincash:qpm2q...",
    generate: "生成病毒链接 🚀",
    unique: "您的专属联盟链接",
    copied: "已复制！",
    copy: "复制",
    note: "分享此链接。当有人购买时，智能合约会自动将 10% 的销售额即时转入您的钱包。",
    error: "生成链接错误",
    invalid: "无效链接或病毒模式未激活。",
    disabled: "创建者已为此产品禁用病毒模式。",
    fetching: "正在获取产品详细信息..."
  }
};

function AffiliateContent() {
  const searchParams = useSearchParams();
  const urlProduct = searchParams.get('product'); 
  
  const [originalLink, setOriginalLink] = useState('');
  const [promoterWallet, setPromoterWallet] = useState('');
  const [viralLink, setViralLink] = useState('');
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('payonce_lang');
    if (savedLang) setLang(savedLang);

    if (urlProduct) {
        setOriginalLink(`${window.location.origin}/unlock?cid=${urlProduct}`);
    }
  }, [urlProduct]);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('payonce_lang', l);
  };

  const t = translations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (!originalLink) {
        setProductData(null);
        setError('');
        return;
    }

    const fetchProductFromIPFS = async () => {
        setIsFetching(true);
        setError('');
        setProductData(null);
        
        try {
            let cidParam = '';
            if (originalLink.includes('cid=')) {
                const urlObj = new URL(originalLink);
                cidParam = urlObj.searchParams.get('cid');
            } else {
                cidParam = originalLink.trim();
            }

            if (!cidParam) throw new Error("Invalid Link");

            const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cidParam}`);
            if (!res.ok) throw new Error("Fetch failed");
            
            const decoded = await res.json();
            
            if (!decoded.a) { 
                throw new Error(t.disabled);
            }

            setProductData(decoded);
            setError('');
        } catch (e) {
            setProductData(null);
            setError(e.message === t.disabled ? t.disabled : t.invalid);
        } finally {
            setIsFetching(false);
        }
    };

    const timerId = setTimeout(() => {
        fetchProductFromIPFS();
    }, 800);

    return () => clearTimeout(timerId);

  }, [originalLink, lang]);

  const generateViralLink = async (e) => {
    e.preventDefault();
    if (!productData || !promoterWallet) return;

    setIsGenerating(true);
    try {
        const newPayload = {
            ...productData,
            ref: promoterWallet 
        };

        const res = await fetch('/api/upload-json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPayload)
        });
        
        const jsonHashData = await res.json();
        
        if (!jsonHashData.cid) throw new Error("JSON Upload Failed");

        const newUrl = `${window.location.origin}/unlock?cid=${jsonHashData.cid}&ref=${promoterWallet}`;
        setViralLink(newUrl);
    } catch (e) {
        alert(t.error);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div dir={dir} className={`min-h-screen bg-[#09090b] text-white flex flex-col items-center py-20 px-6 font-sans ${lang === 'ar' ? 'font-arabic' : ''}`}>
      
      <div className="absolute top-6 right-6 flex gap-2 text-[10px] font-black uppercase z-50">
        <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
        <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
        <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
      </div>

      <nav className="absolute top-0 left-0 w-full p-6 z-40">
         <Link href="/">
           <div className="flex items-center gap-2 cursor-pointer group w-fit">
              <span className={`text-xl ${lang === 'ar' ? 'rotate-180' : ''}`}>←</span>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{t.back}</span>
           </div>
         </Link>
      </nav>

      <div className="text-center max-w-2xl mb-12 mt-10">
        <div className="inline-block bg-green-900/20 text-green-500 text-[10px] font-black uppercase tracking-[4px] px-4 py-2 rounded-full border border-green-500/20 mb-6">
            {t.permissionless}
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
          {t.hero1} <span className="text-green-500">{t.hero2}</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto">
          {t.desc}
        </p>
      </div>

      <div className="w-full max-w-3xl bg-[#18181b] border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
        <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-64 h-64 bg-green-500/5 blur-[80px] -z-10`}></div>

        <div className="space-y-8">
            <div>
                <label className="text-[11px] text-zinc-500 font-black uppercase tracking-wider mb-2 block">{t.step1}</label>
                <input 
                    type="text" 
                    value={originalLink}
                    onChange={(e) => setOriginalLink(e.target.value)}
                    placeholder={t.paste} 
                    className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-green-500 transition-all font-mono text-xs"
                />
                
                {isFetching && <p className="text-zinc-400 text-[10px] font-bold mt-2 uppercase animate-pulse">{t.fetching}</p>}
                
                {error && !isFetching && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide">⚠️ {error}</p>}
                
                {productData && !error && !isFetching && (
                    <div className="mt-4 bg-green-900/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-4 animate-fade-in">
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center text-xl">
                            🎁
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">{productData.n || t.unknown}</h4>
                            <div className="flex gap-3 text-[10px] text-green-400 font-mono mt-1">
                                <span>💰 {t.price} ${productData.p}</span>
                                <span>🚀 {t.comm}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={`transition-all duration-500 ${productData ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 blur-sm pointer-events-none'}`}>
                <label className="text-[11px] text-zinc-500 font-black uppercase tracking-wider mb-2 block">{t.step2}</label>
                <input 
                    type="text" 
                    value={promoterWallet}
                    onChange={(e) => setPromoterWallet(e.target.value)}
                    placeholder={t.wallet} 
                    className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-green-500 transition-all font-mono text-xs"
                />
            </div>

            <button 
                onClick={generateViralLink}
                disabled={!productData || !promoterWallet || isGenerating}
                className="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl text-xl uppercase italic shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:shadow-[0_0_60px_rgba(34,197,94,0.5)] transition-all disabled:opacity-50 disabled:shadow-none"
            >
                {isGenerating ? (
                    <svg className="animate-spin h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : t.generate}
            </button>

            {viralLink && (
                <div className="mt-8 pt-8 border-t border-white/5 animate-fade-in-up">
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest text-center mb-4">{t.unique}</p>
                    <div className="bg-black p-2 rounded-2xl border border-green-500/50 flex gap-2">
                        <input readOnly value={viralLink} className="flex-1 bg-transparent p-3 text-green-500 font-mono text-xs outline-none" />
                        <button 
                            onClick={() => {navigator.clipboard.writeText(viralLink); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} 
                            className="bg-green-600 hover:bg-green-500 text-black px-6 rounded-xl font-bold uppercase text-xs transition-all"
                        >
                            {copied ? t.done : t.copy}
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-zinc-600 mt-4 max-w-md mx-auto leading-relaxed">
                        {t.note}
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default function AffiliatePage() {
  return <Suspense fallback={null}><AffiliateContent /></Suspense>;
}
