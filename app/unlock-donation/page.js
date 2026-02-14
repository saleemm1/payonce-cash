'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, useRef } from 'react';

const translations = {
  en: {
    loading: "LOADING CAMPAIGN...",
    invalid: "Campaign Not Found",
    organizer: "Organizer",
    raised: "Raised So Far",
    goal: "Goal",
    contributors: "Recent Contributors",
    donate: "Donate Now",
    custom: "Custom Amount",
    copy: "Copy Address",
    copied: "Copied!",
    verify: "Checking Blockchain...",
    thankYou: "Thank you for your support!",
    openWallet: "Open in Wallet",
    scan: "Scan to Donate",
    progress: "Progress",
    anonymous: "Anonymous"
  },
  ar: {
    loading: "جاري تحميل الحملة...",
    invalid: "الحملة غير موجودة",
    organizer: "المنظم",
    raised: "تم جمع",
    goal: "الهدف",
    contributors: "آخر المساهمين",
    donate: "تبرع الآن",
    custom: "مبلغ مخصص",
    copy: "نسخ العنوان",
    copied: "تم النسخ!",
    verify: "فحص البلوكشين...",
    thankYou: "شكراً لدعمك!",
    openWallet: "فتح المحفظة",
    scan: "امسح للتبرع",
    progress: "التقدم",
    anonymous: "مجهول"
  },
  zh: {
    loading: "加载活动中...",
    invalid: "未找到活动",
    organizer: "组织者",
    raised: "已筹集",
    goal: "目标",
    contributors: "最近贡献者",
    donate: "立即捐赠",
    custom: "自定义金额",
    copy: "复制地址",
    copied: "已复制!",
    verify: "正在检查区块链...",
    thankYou: "感谢您的支持！",
    openWallet: "在钱包中打开",
    scan: "扫描捐赠",
    progress: "进度",
    anonymous: "匿名"
  }
};

function DonationContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [stats, setStats] = useState({ raised: 0, count: 0, txs: [] });
  const [bchPrice, setBchPrice] = useState(0);
  const [donateAmount, setDonateAmount] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem('payonce_lang');
    if (savedLang) setLang(savedLang);

    const id = searchParams.get('id');
    if (id) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(id))));
        setData(decoded);
      } catch (e) {
        setLoading(false);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!data?.w) return;

    const fetchData = async () => {
      try {
        const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
        const priceJson = await priceRes.json();
        setBchPrice(priceJson['bitcoin-cash'].usd);

        const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
        const historyRes = await fetch(`https://rest.mainnet.cash/v1/address/history/${cleanAddr}`);
        const history = await historyRes.json();

        let totalSats = 0;
        const incomingTxs = [];

        for (const tx of history) {
            if (tx.value > 0) {
                totalSats += tx.value;
                incomingTxs.push({
                    hash: tx.tx_hash,
                    amount: tx.value / 100000000,
                    time: tx.height 
                });
            }
        }

        setStats({
            raised: totalSats / 100000000,
            count: incomingTxs.length,
            txs: incomingTxs.slice(0, 5) 
        });
        setLoading(false);

      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, [data]);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('payonce_lang', l);
  };

  const copyAddr = () => {
    const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
    navigator.clipboard.writeText(cleanAddr);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const t = translations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  if (!data && !loading) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black uppercase">{t.invalid}</div>;
  if (loading) return <div className="min-h-screen bg-[#09090b] text-white flex justify-center items-center font-black italic tracking-[5px] animate-pulse">{t.loading}</div>;

  const percentage = Math.min(100, (stats.raised / data.g) * 100).toFixed(1);
  const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;

  return (
    <div dir={dir} className={`min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden ${lang === 'ar' ? 'font-arabic' : ''}`}>
      
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-green-900/20 to-[#09090b] pointer-events-none"></div>

      <div className="absolute top-6 right-6 flex gap-2 text-[10px] font-black uppercase z-50">
        <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
        <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
        <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
            
            <div className="space-y-6">
                {data.pr ? (
                    <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative group">
                        <img src={data.pr} alt="Campaign" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <h1 className="text-3xl font-black italic uppercase leading-none text-white mb-2">{data.n}</h1>
                            <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                <span>{t.organizer}:</span>
                                <span className="text-green-500">{data.sn}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-64 bg-zinc-900 rounded-[32px] flex items-center justify-center border border-white/5">
                        <h1 className="text-3xl font-black italic uppercase text-zinc-700">{data.n}</h1>
                    </div>
                )}

                <div className="bg-zinc-900/50 p-6 rounded-[24px] border border-white/5 backdrop-blur-md">
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{data.d}</p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                        <span>{data.se}</span>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-[24px] border border-white/5">
                    <h3 className="text-xs font-black uppercase text-zinc-400 mb-4 tracking-widest">{t.contributors}</h3>
                    <div className="space-y-3">
                        {stats.txs.length > 0 ? stats.txs.map((tx, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">👤</div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-white">{t.anonymous}</span>
                                        <span className="text-[8px] text-zinc-500 font-mono">{tx.hash.substring(0, 12)}...</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-black text-green-500 block">+{tx.amount.toFixed(4)} BCH</span>
                                    <span className="text-[8px] text-zinc-600 block">≈ ${(tx.amount * bchPrice).toFixed(2)}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-[10px] text-zinc-600 italic py-4">No contributions yet. Be the first!</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="sticky top-8 space-y-6">
                <div className="bg-[#121214] p-8 rounded-[32px] border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.1)] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
                        <div className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]" style={{width: `${percentage}%`}}></div>
                    </div>

                    <div className="mb-8">
                        <span className="text-5xl font-black text-white tracking-tighter block">{stats.raised.toFixed(3)}</span>
                        <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest block mt-1">BCH {t.raised}</span>
                    </div>

                    <div className="w-full bg-zinc-900 rounded-full h-4 mb-2 overflow-hidden border border-white/5 relative">
                        <div className="h-full bg-gradient-to-r from-green-600 to-green-400 relative" style={{width: `${percentage}%`}}>
                            <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-8 uppercase tracking-wider">
                        <span>{percentage}% {t.progress}</span>
                        <span>{t.goal}: {data.g} BCH</span>
                    </div>

                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                             {[5, 10, 25].map(amt => (
                                 <button key={amt} onClick={() => setDonateAmount((amt / bchPrice).toFixed(5))} className="py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold text-white transition-colors border border-white/5 hover:border-green-500/50">
                                     ${amt}
                                 </button>
                             ))}
                        </div>
                        
                        <div className="relative">
                             <input 
                                type="number" 
                                placeholder={t.custom} 
                                value={donateAmount}
                                onChange={(e) => setDonateAmount(e.target.value)}
                                className="w-full p-4 bg-black/50 border border-zinc-700 rounded-xl text-white text-center font-bold outline-none focus:border-green-500 transition-colors"
                             />
                             <span className="absolute right-4 top-4 text-zinc-500 text-xs font-black pointer-events-none">BCH</span>
                        </div>

                        <a 
                            href={`bitcoincash:${cleanAddr}?amount=${donateAmount}`} 
                            className={`block w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-green-500/20 active:scale-95 flex items-center justify-center gap-2 ${donateAmount ? 'bg-green-500 hover:bg-green-400 text-black' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                        >
                            <span>{t.donate}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>

                <div className="bg-[#121214] p-6 rounded-[32px] border border-white/5 flex flex-col items-center">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-4">{t.scan}</p>
                    <div className="bg-white p-2 rounded-xl mb-4">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bitcoincash:${cleanAddr}`} alt="QR" className="w-32 h-32 mix-blend-multiply" />
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-lg border border-white/5 w-full">
                        <input readOnly value={cleanAddr} className="bg-transparent text-[10px] text-zinc-400 font-mono flex-1 outline-none truncate pl-2" />
                        <button onClick={copyAddr} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-[10px] text-white font-bold transition-colors">
                            {isCopied ? t.copied : t.copy}
                        </button>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}

export default function DonationUnlockPage() {
  return <Suspense fallback={null}><DonationContent /></Suspense>;
}
