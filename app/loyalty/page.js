'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const translations = {
  en: {
    back: "Back to PayOnce",
    beta: "Beta Access",
    soon: "Coming Soon",
    shop: "Shop & Earn",
    assets: "Real Assets.",
    desc: "The first Shop-to-Earn protocol built on Bitcoin Cash. Receive tradable CashTokens instantly in your wallet every time you pay with PayOnce.",
    success: "Payment Success",
    justNow: "Just now via PayOnce",
    unlocked: "Reward Unlocked",
    received: "You received PAY Tokens",
    notJust: "Not Just Points",
    pointsDesc: "Unlike database points, these are real on-chain assets you can trade, swap, or hold.",
    airdrop: "Automated Airdrops",
    airdropDesc: "Merchants set the rules. The protocol airdrops tokens instantly upon payment.",
    loyalty: "Loyalty 3.0",
    loyaltyDesc: "Create exclusive access, discount NFTs, or voting rights for your top customers.",
    dev: "Feature In Development"
  },
  ar: {
    back: "العودة لـ PayOnce",
    beta: "وصول تجريبي",
    soon: "قريباً",
    shop: "تسوق واربح",
    assets: "أصول حقيقية.",
    desc: "أول بروتوكول تسوق واربح مبني على بيتكوين كاش. احصل على توكنات كاش قابلة للتداول فوراً في محفظتك كل مرة تدفع فيها عبر PayOnce.",
    success: "نجاح الدفع",
    justNow: "الآن عبر PayOnce",
    unlocked: "تم فتح المكافأة",
    received: "لقد استلمت توكنات PAY",
    notJust: "ليست مجرد نقاط",
    pointsDesc: "على عكس نقاط قواعد البيانات، هذه أصول حقيقية على البلوكشين يمكنك تداولها، استبدالها، أو الاحتفاظ بها.",
    airdrop: "توزيع آلي",
    airdropDesc: "التجار يحددون القواعد. البروتوكول يوزع التوكنات فوراً عند الدفع.",
    loyalty: "ولاء 3.0",
    loyaltyDesc: "أنشئ وصولاً حصرياً، خصومات NFT، أو حقوق تصويت لعملائك المميزين.",
    dev: "الميزة قيد التطوير"
  },
  zh: {
    back: "返回 PayOnce",
    beta: "测试版访问",
    soon: "即将推出",
    shop: "购物赚取",
    assets: "真实资产。",
    desc: "首个建立在比特币现金上的购物赚取协议。每次使用 PayOnce 支付时，您的钱包都会即时收到可交易的 CashTokens。",
    success: "支付成功",
    justNow: "刚刚通过 PayOnce",
    unlocked: "奖励解锁",
    received: "您收到了 PAY 代币",
    notJust: "不仅仅是积分",
    pointsDesc: "与数据库积分不同，这些是可以交易、交换或持有的真实链上资产。",
    airdrop: "自动空投",
    airdropDesc: "商家设定规则。协议在付款时即时空投代币。",
    loyalty: "忠诚度 3.0",
    loyaltyDesc: "为您的顶级客户创建独家访问权、折扣 NFT 或投票权。",
    dev: "功能开发中"
  }
};

export default function LoyaltyPage() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('payonce_lang');
    if (savedLang) setLang(savedLang);
  }, []);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('payonce_lang', l);
  };

  const t = translations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div dir={dir} className={`min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden ${lang === 'ar' ? 'font-arabic' : ''}`}>
      
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-yellow-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-green-600/5 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="absolute top-6 right-6 flex gap-2 text-[10px] font-black uppercase z-50">
        <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
        <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
        <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
      </div>

      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-sm border-b border-white/5">
         <Link href="/">
           <div className="flex items-center gap-2 cursor-pointer group">
              <span className={`text-xl ${lang === 'ar' ? 'rotate-180' : ''}`}>←</span>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{t.back}</span>
           </div>
         </Link>
         <div className="text-[10px] font-black uppercase tracking-widest text-yellow-500 border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 rounded-full">
            {t.beta}
         </div>
      </nav>

      <main className="pt-40 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
         
         <div className="mb-8 animate-pulse">
            <span className="text-[10px] font-black uppercase tracking-[6px] text-yellow-500">{t.soon}</span>
         </div>

         <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 leading-none">
            <span className="text-white">{t.shop}</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">{t.assets}</span>
         </h1>

         <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
            {t.desc}
         </p>

         <div className="relative w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl mb-20 transform hover:scale-105 transition-transform duration-500">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                       <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M11 7h2v6h-2zm0 8h2v2h-2z"/></svg>
                    </div>
                    <div className="text-start">
                       <div className="text-xs font-bold">{t.success}</div>
                       <div className="text-[10px] text-zinc-500">{t.justNow}</div>
                    </div>
                </div>
                <div className="text-xs font-mono text-green-400" dir="ltr">-$15.00</div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                      🎁
                   </div>
                   <div className="text-start">
                      <div className="text-xs font-black uppercase text-yellow-500">{t.unlocked}</div>
                      <div className="text-[10px] text-zinc-400">{t.received}</div>
                   </div>
                </div>
                <div className="text-lg font-black italic text-white" dir="ltr">+15.00 PAY</div>
            </div>
            
            <div className="mt-4 text-[9px] text-zinc-600 text-center font-mono">
               Hash: 349a...8f2b • Settled in 0-Conf
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-start">
             <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-yellow-500/20 transition-all">
                 <div className="text-3xl mb-4">💎</div>
                 <h3 className="text-lg font-bold mb-2 text-white">{t.notJust}</h3>
                 <p className="text-zinc-500 text-sm">{t.pointsDesc}</p>
             </div>
             <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-yellow-500/20 transition-all">
                 <div className="text-3xl mb-4">⚡</div>
                 <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white">{t.airdrop}</h3>
                 </div>
                 <p className="text-zinc-500 text-sm">{t.airdropDesc}</p>
             </div>
             <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-yellow-500/20 transition-all">
                 <div className="text-3xl mb-4">🤝</div>
                 <h3 className="text-lg font-bold mb-2 text-white">{t.loyalty}</h3>
                 <p className="text-zinc-500 text-sm">{t.loyaltyDesc}</p>
             </div>
         </div>

         <div className="mt-20 mb-20">
             <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-zinc-800 to-zinc-700">
                 <button className="bg-[#050505] text-zinc-300 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 transition-all">
                   {t.dev}
                 </button>
             </div>
         </div>

      </main>

    </div>
  );
}
