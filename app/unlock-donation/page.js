'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

const translations = {
  en: {
    loading: "INITIALIZING...",
    notFound: "Campaign Not Found",
    organizer: "Organizer",
    raised: "Raised",
    goal: "Target",
    donors: "Contributors",
    recent: "Recent Donations",
    donate: "Make a Donation",
    custom: "Enter amount",
    pay: "Pay with Wallet",
    scan: "Scan to Pay",
    copy: "Copy Address",
    copied: "Copied!",
    thankYou: "Transaction Detected! Thank You!",
    anonymous: "Anonymous",
    back: "Create Your Own",
    live: "LIVE",
    of: "of",
    feedback: "Quality Feedback",
    trusted: "Trusted",
    avoid: "Avoid",
    recorded: "Verification Recorded"
  },
  ar: {
    loading: "جاري تحميل الحملة...",
    notFound: "الحملة غير موجودة",
    organizer: "المنظم",
    raised: "تم جمع",
    goal: "الهدف",
    donors: "المساهمين",
    recent: "أحدث التبرعات",
    donate: "تبرع الآن",
    custom: "أدخل المبلغ",
    pay: "ادفع بالمحفظة",
    scan: "امسح للدفع",
    copy: "نسخ العنوان",
    copied: "تم النسخ!",
    thankYou: "تم كشف المعاملة! شكراً لك!",
    anonymous: "فاعل خير",
    back: "أنشئ حملتك",
    live: "مباشر",
    of: "من",
    feedback: "تقييم الجودة",
    trusted: "موثوق",
    avoid: "تجنب",
    recorded: "تم تسجيل التوثيق"
  },
  zh: {
    loading: "正在初始化...",
    notFound: "未找到活动",
    organizer: "组织者",
    raised: "已筹集",
    goal: "目标",
    donors: "贡献者",
    recent: "最近捐款",
    donate: "立即捐赠",
    custom: "输入金额",
    pay: "钱包支付",
    scan: "扫描支付",
    copy: "复制地址",
    copied: "已复制!",
    thankYou: "检测到交易！谢谢！",
    anonymous: "匿名",
    back: "创建您的活动",
    live: "实时",
    of: "的",
    feedback: "质量反馈",
    trusted: "信任",
    avoid: "避免",
    recorded: "验证已记录"
  }
};

function DonationContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [stats, setStats] = useState({ raised: 0, txs: [] });
  const [bchPrice, setBchPrice] = useState(0);
  const [amount, setAmount] = useState('');
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('payonce_lang');
    if (saved) setLang(saved);
    const id = searchParams.get('id');
    if (id) {
        try {
            const decoded = JSON.parse(decodeURIComponent(escape(atob(id))));
            setData(decoded);
        } catch(e) { setLoading(false); }
    }
  }, [searchParams]);

  useEffect(() => {
      if (!data?.w) return;
      
      const refreshData = async () => {
          try {
              const pRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
              const pJson = await pRes.json();
              const price = pJson['bitcoin-cash'].usd;
              setBchPrice(price);

              const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
              const hRes = await fetch(`https://rest.mainnet.cash/v1/address/history/${cleanAddr}`);
              const hJson = await hRes.json();
              
              let total = 0;
              const txs = [];
              
              hJson.forEach(tx => {
                  if (tx.value > 0) {
                      total += tx.value;
                      txs.push({
                          hash: tx.tx_hash,
                          val: tx.value / 100000000,
                          usd: (tx.value / 100000000) * price
                      });
                  }
              });

              if (total > (stats.raised * 100000000) && stats.raised !== 0) {
                  setCelebrate(true);
                  setTimeout(() => setCelebrate(false), 5000);
              }

              setStats({
                  raised: total / 100000000,
                  txs: txs.slice(0, 7)
              });
              setLoading(false);

          } catch(e) { setLoading(false); }
      };

      refreshData();
      const timer = setInterval(refreshData, 5000);
      return () => clearInterval(timer);
  }, [data, stats.raised]);

  const handlePreset = (usdVal) => {
      setActivePreset(usdVal);
      if (bchPrice > 0) {
          const bchVal = (usdVal / bchPrice).toFixed(8);
          setAmount(bchVal);
      }
  };

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

  if (!data && !loading) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black uppercase">{t.notFound}</div>;
  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black italic tracking-widest animate-pulse">{t.loading}</div>;

  const percentage = Math.min(100, (stats.raised / (data.g || 1)) * 100);
  const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
  const payLink = `bitcoincash:${cleanAddr}?amount=${amount}`;

  return (
    <div dir={dir} className={`min-h-screen bg-[#050505] text-white font-sans ${lang === 'ar' ? 'font-arabic' : ''} selection:bg-green-500/30`}>
        
        {celebrate && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                <div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm animate-in fade-in duration-300"></div>
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-white italic uppercase animate-bounce drop-shadow-[0_0_30px_rgba(34,197,94,0.8)]">
                    {t.thankYou}
                </h1>
            </div>
        )}

        <div className="fixed inset-0 pointer-events-none opacity-30">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]"></div>
        </div>

        <nav className="relative z-50 flex justify-between items-center p-6 max-w-7xl mx-auto">
            <Link href="/" className="text-sm font-black tracking-widest text-zinc-500 hover:text-white transition-colors uppercase">
               PAYONCE
            </Link>
            <div className="flex gap-3 text-[10px] font-black uppercase">
                <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
                <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
                <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
            </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8 lg:gap-16 relative z-10">
            
            <div className="lg:col-span-7 space-y-8">
                {data.pr ? (
                    <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl group">
                         <img src={data.pr} className="w-full h-auto object-cover max-h-[500px]" alt="Cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                         <div className="absolute bottom-0 left-0 w-full p-8">
                            <div className="inline-flex items-center gap-2 bg-red-600/90 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase mb-4 animate-pulse">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div> {t.live}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-none mb-2 text-white drop-shadow-lg">{data.n}</h1>
                            <p className="text-zinc-400 font-bold uppercase tracking-wider text-xs">{t.organizer}: <span className="text-green-500">{data.sn}</span></p>
                         </div>
                    </div>
                ) : (
                    <div className="h-64 bg-zinc-900 rounded-[32px] flex items-center justify-center border border-white/5">
                        <h1 className="text-4xl font-black italic uppercase text-zinc-800">{data.n}</h1>
                    </div>
                )}

                <div className="bg-zinc-900/50 p-8 rounded-[32px] border border-white/5 backdrop-blur-md">
                    <p className="text-base md:text-lg text-zinc-300 leading-relaxed font-medium whitespace-pre-wrap">{data.d}</p>
                </div>

                <div className="bg-zinc-900/30 p-8 rounded-[32px] border border-white/5">
                    <h3 className="text-sm font-black uppercase text-zinc-500 mb-6 tracking-widest">{t.recent}</h3>
                    <div className="space-y-4">
                        {stats.txs.map((tx, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-2xl border border-white/5 hover:border-green-500/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg">❤️</div>
                                    <div>
                                        <p className="text-xs font-bold text-white">{t.anonymous}</p>
                                        <p className="text-[10px] text-zinc-600 font-mono">{tx.hash.substring(0,8)}...{tx.hash.substring(tx.hash.length-8)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-green-500">+{tx.val.toFixed(4)} BCH</p>
                                    <p className="text-[10px] text-zinc-500 font-bold">≈ ${tx.usd.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                        {stats.txs.length === 0 && <p className="text-zinc-600 italic text-center text-sm">Be the first to donate!</p>}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-5 relative">
                <div className="sticky top-8 space-y-6">
                    
                    <div className="bg-[#121214] p-8 rounded-[40px] border border-green-500/20 shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-800">
                             <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_15px_#22c55e]" style={{width: `${percentage}%`}}></div>
                        </div>

                        <div className="text-center mb-8 mt-2">
                             <span className="text-6xl font-black text-white tracking-tighter block tabular-nums">{stats.raised.toFixed(3)}</span>
                             <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest block mt-2">BCH {t.raised} {t.of} {data.g}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[5, 25, 50].map(val => (
                                <button 
                                    key={val}
                                    onClick={() => handlePreset(val)}
                                    className={`py-4 rounded-2xl text-sm font-black transition-all ${activePreset === val ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-105' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}
                                >
                                    ${val}
                                </button>
                            ))}
                        </div>

                        <div className="relative mb-6">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg font-black">$</span>
                            <input 
                                type="number" 
                                placeholder={t.custom}
                                value={activePreset && amount ? (amount * bchPrice).toFixed(2) : (amount ? (amount * bchPrice).toFixed(2) : '')}
                                onChange={(e) => {
                                    setActivePreset(null);
                                    const val = parseFloat(e.target.value);
                                    if(val && bchPrice) setAmount((val / bchPrice).toFixed(8));
                                    else setAmount('');
                                }}
                                className="w-full bg-black/50 border border-zinc-700 rounded-2xl p-4 pl-8 text-white font-bold outline-none focus:border-green-500 transition-colors"
                            />
                        </div>

                        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 mb-6 text-center">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">{t.scan}</p>
                            <div className="bg-white p-2 rounded-xl inline-block mb-3">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(payLink)}`} alt="QR" className="w-32 h-32 mix-blend-multiply" />
                            </div>
                             <p className="text-xs font-black text-white">{amount ? amount : '0.00'} BCH</p>
                        </div>

                        <a 
                            href={payLink}
                            className={`block w-full py-5 rounded-2xl font-black uppercase italic tracking-wider text-center text-lg transition-all shadow-xl ${amount ? 'bg-green-600 hover:bg-green-500 text-black hover:scale-[1.02]' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
                        >
                            {t.pay}
                        </a>
                    </div>

                    <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase">{t.organizer}</p>
                            <p className="text-xs text-white truncate font-mono">{cleanAddr}</p>
                        </div>
                        <button onClick={() => {navigator.clipboard.writeText(cleanAddr); setIsCopied(true); setTimeout(()=>setIsCopied(false),2000)}} className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg text-[10px] font-bold transition-colors">
                            {isCopied ? t.copied : t.copy}
                        </button>
                    </div>

                    {!rating ? (
                        <div className="bg-black/40 p-5 rounded-[24px] border border-white/5">
                            <p className="text-[9px] text-zinc-500 uppercase font-black mb-4 tracking-widest">{t.feedback}</p>
                            <div className="flex gap-3">
                                <button onClick={() => setRating('pos')} className="flex-1 bg-zinc-900/50 hover:bg-green-500/10 rounded-2xl transition-all text-[10px] font-black uppercase border border-white/5 group border-b-2 border-b-transparent hover:border-b-green-500 p-5">
                                    <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">👍</span> {t.trusted}
                                </button>
                                <button onClick={() => setRating('neg')} className="flex-1 bg-zinc-900/50 hover:bg-red-500/10 rounded-2xl transition-all text-[10px] font-black uppercase border border-white/5 group border-b-2 border-b-transparent hover:border-b-red-500 p-5">
                                    <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">👎</span> {t.avoid}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-5 bg-green-600/10 text-green-500 border border-green-500/20 rounded-2xl font-black text-[10px] uppercase italic tracking-[2px] animate-pulse text-center">
                            {t.recorded}
                        </div>
                    )}

                </div>
            </div>

        </main>
    </div>
  );
}

export default function DonationUnlockPage() {
  return <Suspense fallback={null}><DonationContent /></Suspense>;
}
