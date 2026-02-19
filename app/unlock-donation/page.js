'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, useRef } from 'react';

const translations = {
  en: {
    loading: "INITIALIZING...",
    notFound: "Campaign Not Found",
    organizer: "Organizer",
    raised: "RAISED",
    goal: "GOAL",
    donors: "Recent Contributors",
    donate: "Donate Now",
    custom: "Enter amount",
    pay: "Pay with Wallet",
    scan: "Scan to Pay",
    copy: "Copy Address",
    copied: "Copied!",
    thankYou: "DONATION RECEIVED! THANK YOU!",
    anonymous: "Anonymous Supporter",
    back: "Create Your Own",
    live: "LIVE",
    of: "OF",
    feedback: "Quality Feedback",
    trusted: "Trusted",
    avoid: "Avoid",
    recorded: "Feedback Recorded",
    currency: "USD",
    totalUsd: "Total Value"
  },
  ar: {
    loading: "جاري التحميل...",
    notFound: "الحملة غير موجودة",
    organizer: "المنظم",
    raised: "تم جمع",
    goal: "الهدف",
    donors: "أحدث المساهمين",
    donate: "تبرع الآن",
    custom: "أدخل المبلغ",
    pay: "ادفع بالمحفظة",
    scan: "امسح للدفع",
    copy: "نسخ العنوان",
    copied: "تم النسخ!",
    thankYou: "تم استلام التبرع! شكراً لك!",
    anonymous: "فاعل خير",
    back: "أنشئ حملتك",
    live: "مباشر",
    of: "من",
    feedback: "تقييم الجودة",
    trusted: "موثوق",
    avoid: "تجنب",
    recorded: "تم تسجيل التقييم",
    currency: "USD",
    totalUsd: "القيمة الإجمالية"
  },
  zh: {
    loading: "正在初始化...",
    notFound: "未找到活动",
    organizer: "组织者",
    raised: "已筹集",
    goal: "目标",
    donors: "最近贡献者",
    donate: "立即捐赠",
    custom: "输入金额",
    pay: "钱包支付",
    scan: "扫描支付",
    copy: "复制地址",
    copied: "已复制!",
    thankYou: "收到捐款！谢谢！",
    anonymous: "匿名支持者",
    back: "创建您的活动",
    live: "实时",
    of: " / ",
    feedback: "质量反馈",
    trusted: "信任",
    avoid: "避免",
    recorded: "反馈已记录",
    currency: "USD",
    totalUsd: "总价值"
  }
};

function DonationContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [stats, setStats] = useState({ raised: 0, txs: [] });
  const [bchPrice, setBchPrice] = useState(0);
  const [amount, setAmount] = useState(''); 
  const [inputUsd, setInputUsd] = useState(''); 
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
      setInputUsd(usdVal.toString());
      if (bchPrice > 0) {
          const bchVal = (usdVal / bchPrice).toFixed(8);
          setAmount(bchVal);
      }
  };

  const handleInputChange = (e) => {
      const val = e.target.value;
      setInputUsd(val);
      setActivePreset(null);
      if (val && !isNaN(val) && bchPrice > 0) {
          setAmount((parseFloat(val) / bchPrice).toFixed(8));
      } else {
          setAmount('');
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

  if (!data && !loading) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black uppercase text-xl">{t.notFound}</div>;
  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black italic tracking-[10px] animate-pulse">{t.loading}</div>;

  const percentage = data.g ? Math.min(100, (stats.raised / data.g) * 100) : 0;
  const cleanAddr = data.w.includes(':') ? data.w.split(':')[1] : data.w;
  const payLink = `bitcoincash:${cleanAddr}?amount=${amount}`;

  return (
    <div dir={dir} className={`min-h-screen bg-[#050505] text-white font-sans ${lang === 'ar' ? 'font-arabic' : ''} overflow-x-hidden selection:bg-green-500/30`}>
        
        {celebrate && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none backdrop-blur-md bg-black/50 animate-in fade-in duration-300">
                <div className="text-center animate-bounce">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-4xl md:text-6xl font-black text-green-500 italic uppercase drop-shadow-[0_0_30px_rgba(34,197,94,1)]">
                        {t.thankYou}
                    </h1>
                </div>
            </div>
        )}

        <div className="fixed inset-0 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        </div>

        <nav className="relative z-50 flex justify-between items-center p-6 max-w-7xl mx-auto">
            <h1 className="text-sm font-black tracking-widest text-zinc-500 uppercase">PAYONCE</h1>
            <div className="flex gap-2 text-[10px] font-black uppercase bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
                <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-400' : 'text-zinc-500 hover:text-white'}`}>EN</button>
                <span className="text-zinc-700">|</span>
                <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-400' : 'text-zinc-500 hover:text-white'}`}>AR</button>
                <span className="text-zinc-700">|</span>
                <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-400' : 'text-zinc-500 hover:text-white'}`}>CN</button>
            </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-12 gap-10 relative z-10">
            
            <div className="lg:col-span-7 space-y-8">
                {data.pr ? (
                    <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-white/10 group">
                         <img src={data.pr} className="w-full h-auto object-cover max-h-[450px]" alt="Cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                         <div className="absolute bottom-0 left-0 w-full p-8">
                            <div className="inline-flex items-center gap-2 bg-green-600/90 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase mb-4 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                                <div className="w-1.5 h-1.5 bg-black rounded-full"></div> {t.live}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black italic uppercase leading-none mb-3 text-white drop-shadow-xl">{data.n}</h1>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">👑</div>
                                <p className="text-zinc-300 font-bold uppercase tracking-wider text-xs">{data.sn}</p>
                            </div>
                         </div>
                    </div>
                ) : (
                    <div className="h-48 bg-zinc-900 rounded-[32px] flex items-center justify-center border border-white/5">
                        <h1 className="text-3xl font-black italic uppercase text-zinc-700">{data.n}</h1>
                    </div>
                )}

                <div className="bg-[#0a0a0a]/80 p-8 rounded-[32px] border border-white/5 backdrop-blur-md">
                    <p className="text-base text-zinc-300 leading-relaxed font-medium whitespace-pre-wrap">{data.d}</p>
                </div>

                <div className="bg-[#0a0a0a]/80 p-8 rounded-[32px] border border-white/5 backdrop-blur-md">
                    <h3 className="text-xs font-black uppercase text-zinc-500 mb-6 tracking-[3px]">{t.donors}</h3>
                    <div className="space-y-3">
                        {stats.txs.map((tx, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-[#121214] rounded-2xl border border-white/5 hover:border-green-500/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-sm shadow-inner text-green-500">❤️</div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white mb-0.5">{t.anonymous}</span>
                                        <span className="text-[9px] text-zinc-600 font-mono">{tx.hash.substring(0,6)}...{tx.hash.substring(tx.hash.length-6)}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-black text-white block">+{tx.val.toFixed(4)} BCH</span>
                                    <span className="text-[10px] text-green-500 font-bold block">≈ ${tx.usd.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                        {stats.txs.length === 0 && <p className="text-zinc-600 italic text-center text-xs py-4">Be the first to create impact!</p>}
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
                             <span className="text-sm font-bold text-green-500 uppercase tracking-widest block mt-2">
                                BCH {t.raised} {t.of} {Number(data.g).toFixed(4)}
                             </span>
                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mt-1">
                                {t.totalUsd}: ${(stats.raised * bchPrice).toFixed(2)} / ${(data.g * bchPrice).toFixed(2)}
                             </span>
                        </div>

                        <div className="w-full bg-zinc-900 rounded-full h-3 mb-8 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-600 to-green-400 shadow-[0_0_15px_#22c55e]" style={{width: `${percentage}%`}}></div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {[5, 20, 50].map(val => (
                                <button 
                                    key={val}
                                    onClick={() => handlePreset(val)}
                                    className={`py-3 rounded-xl text-sm font-black transition-all border ${activePreset === val ? 'bg-white text-black border-white shadow-lg scale-105' : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'}`}
                                >
                                    ${val}
                                </button>
                            ))}
                        </div>

                        <div className="relative mb-6">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-bold">$</span>
                            <input 
                                type="number" 
                                placeholder={t.custom}
                                value={inputUsd}
                                onChange={handleInputChange}
                                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 pl-8 text-white font-bold outline-none focus:border-green-500 transition-colors"
                            />
                            {amount && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-[10px] font-mono">≈ {amount} BCH</span>}
                        </div>

                        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-zinc-800 mb-6 text-center group hover:border-green-500/30 transition-colors cursor-pointer" onClick={()=>window.location.assign(payLink)}>
                            <div className="bg-white p-2 rounded-lg inline-block mb-3 shadow-inner">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(payLink)}`} alt="QR" className="w-32 h-32 mix-blend-multiply" />
                            </div>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{t.scan}</p>
                        </div>

                        <a 
                            href={payLink}
                            className={`block w-full py-5 rounded-2xl font-black uppercase italic tracking-wider text-center text-lg transition-all shadow-xl ${amount ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:scale-[1.02] shadow-green-900/20' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
                        >
                            {t.donate}
                        </a>
                    </div>

                    <div className="flex items-center gap-3 bg-[#0a0a0a] p-3 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500">
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wide">{t.organizer}</p>
                            <p className="text-[10px] text-zinc-300 truncate font-mono">{cleanAddr}</p>
                        </div>
                        <button onClick={copyAddr} className="bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-colors">
                            {isCopied ? t.copied : t.copy}
                        </button>
                    </div>

                    {!rating ? (
                        <div className="bg-[#0a0a0a] p-4 rounded-[24px] border border-white/5 flex justify-between items-center gap-4">
                            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">{t.feedback}</p>
                            <div className="flex gap-2">
                                <button onClick={() => setRating('pos')} className="bg-zinc-900 hover:bg-green-500/20 text-zinc-400 hover:text-green-500 w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all">👍</button>
                                <button onClick={() => setRating('neg')} className="bg-zinc-900 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all">👎</button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-[24px] text-center">
                            <p className="text-[10px] font-black text-green-500 uppercase italic tracking-widest">{t.recorded}</p>
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
