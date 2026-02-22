'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    back: "Back to Home",
    badge: "WEB3 LOYALTY PROGRAM",
    title1: "Token-Gated",
    title2: "Commerce",
    desc: "Empower your community with pure cryptographic proof. No emails, no passwords. Just verify their CashTokens on the BCH Mainnet and automatically unlock exclusive perks.",
    modesTitle: "Two Powerful Ways to Reward",
    mode1Title: "Discount Mode",
    mode1Desc: "Offer a secret percentage discount. Users who hold your specific Token ID will automatically pay less at checkout.",
    mode2Title: "Required Mode (Gated)",
    mode2Desc: "Lock your content completely. Only users who can mathematically prove they hold your token can access the payment page.",
    stepTitle: "How to launch in 3 steps?",
    step1: "1. Mint Your Token",
    step1Desc: "Use a BCH platform to mint your unique CashToken.",
    step2: "2. Create a Product",
    step2Desc: "Enable the 'CashTokens Rule' on any PayOnce product. Paste your Token ID and choose Discount or Gated mode.",
    step3: "3. Share & Verify",
    step3Desc: "Share your secure link. Buyers will verify their wallet address instantly on-chain to claim their reward.",
    ctaMint: "Mint Token on Studio",
    ctaSell: "Create a Product"
  },
  ar: {
    back: "العودة للرئيسية",
    badge: "برنامج ولاء WEB3",
    title1: "التجارة المشروطة",
    title2: "بالتوكنز",
    desc: "امنح مجتمعك قوة الإثبات المشفر. بدون إيميلات، وبدون كلمات سر. بمجرد التحقق من التوكن الخاص بهم على شبكة BCH، يتم تفعيل المكافآت الحصرية تلقائياً.",
    modesTitle: "طريقتان لمكافأة عملائك",
    mode1Title: "وضع الخصم (Discount)",
    mode1Desc: "قدم خصماً بنسبة مئوية. المستخدمون الذين يمتلكون التوكن الخاص بك سيدفعون مبلغاً أقل تلقائياً عند الدفع.",
    mode2Title: "الوصول المشروط (Gated)",
    mode2Desc: "اقفل محتواك بالكامل. فقط المستخدمون الذين يثبتون امتلاكهم للتوكن يمكنهم الوصول إلى صفحة الدفع.",
    stepTitle: "كيف تطلق برنامجك في 3 خطوات؟",
    step1: "1. اصنع التوكن الخاص بك",
    step1Desc: "استخدم منصات BCH لإنشاء توكن CashToken خاص بعلامتك التجارية.",
    step2: "2. أنشئ منتجك",
    step2Desc: "فعل 'قواعد CashTokens' في أي منتج على PayOnce. أدخل معرف التوكن (ID) واختر نوع المكافأة.",
    step3: "3. شارك وتحقق",
    step3Desc: "شارك رابطك الآمن. سيقوم المشترون بالتحقق من محافظهم فوراً على البلوكشين للحصول على المكافأة.",
    ctaMint: "اصنع توكن عبر Studio",
    ctaSell: "أنشئ منتجاً الآن"
  },
  zh: {
    back: "返回首页",
    badge: "WEB3 忠诚度计划",
    title1: "代币门控",
    title2: "商业",
    desc: "用纯粹的密码学证明赋能您的社区。没有电子邮件，没有密码。只需在 BCH 主网上验证他们的 CashTokens，即可自动解锁独家福利。",
    modesTitle: "两种强大的奖励方式",
    mode1Title: "折扣模式 (Discount)",
    mode1Desc: "提供秘密的百分比折扣。持有您特定代币 ID 的用户在结账时将自动支付更少的费用。",
    mode2Title: "必须模式 (Gated)",
    mode2Desc: "完全锁定您的内容。只有能够用数学证明他们持有您代币的用户才能访问支付页面。",
    stepTitle: "只需 3 步即可启动",
    step1: "1. 铸造您的代币",
    step1Desc: "使用 BCH 平台铸造您独特的 CashToken。",
    step2: "2. 创建产品",
    step2Desc: "在任何 PayOnce 产品上启用“CashTokens 规则”。粘贴您的代币 ID 并选择折扣或门控模式。",
    step3: "3. 分享与验证",
    step3Desc: "分享您的安全链接。买家将在链上立即验证其钱包地址以领取奖励。",
    ctaMint: "在 Studio 上铸造代币",
    ctaSell: "创建产品"
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
    <div dir={dir} className={`min-h-screen bg-[#09090b] text-white font-sans relative overflow-x-hidden ${lang === 'ar' ? 'font-arabic' : ''}`}>
      
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[600px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <nav className="relative z-50 flex justify-between items-center p-6 lg:px-12 max-w-7xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`group-hover:-translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:translate-x-1' : ''}`}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {t.back}
        </Link>
        <div className="flex gap-1 text-[10px] font-black uppercase bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
          <button onClick={() => changeLang('en')} className={`px-3 py-1.5 rounded-md transition-all ${lang === 'en' ? 'bg-zinc-800 text-green-400' : 'text-zinc-500 hover:text-white'}`}>EN</button>
          <button onClick={() => changeLang('ar')} className={`px-3 py-1.5 rounded-md transition-all ${lang === 'ar' ? 'bg-zinc-800 text-green-400' : 'text-zinc-500 hover:text-white'}`}>AR</button>
          <button onClick={() => changeLang('zh')} className={`px-3 py-1.5 rounded-md transition-all ${lang === 'zh' ? 'bg-zinc-800 text-green-400' : 'text-zinc-500 hover:text-white'}`}>CN</button>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-24">
        
        <section className="text-center max-w-3xl mx-auto mb-24 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                {t.badge}
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-6">
                {t.title1} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">{t.title2}</span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                {t.desc}
            </p>
        </section>

        <div className="mb-24">
            <h2 className="text-sm font-black text-zinc-500 uppercase tracking-widest text-center mb-8">{t.modesTitle}</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/40 p-8 rounded-3xl border border-white/5 hover:border-green-500/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-6 border border-green-500/20">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <h3 className="text-lg font-black uppercase italic text-white mb-3">{t.mode1Title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{t.mode1Desc}</p>
                </div>
                
                <div className="bg-zinc-900/40 p-8 rounded-3xl border border-white/5 hover:border-green-500/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-6 border border-green-500/20">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <h3 className="text-lg font-black uppercase italic text-white mb-3">{t.mode2Title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{t.mode2Desc}</p>
                </div>
            </div>
        </div>

        <section className="bg-gradient-to-b from-zinc-900 to-[#09090b] rounded-[2.5rem] p-8 md:p-16 border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] pointer-events-none"></div>
            
            <h2 className="text-2xl md:text-3xl font-black uppercase italic text-center mb-12 relative z-10">{t.stepTitle}</h2>

            <div className="grid md:grid-cols-3 gap-10 relative z-10">
                
                <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 bg-black border border-zinc-800 text-zinc-500 rounded-full flex items-center justify-center font-black text-2xl mb-6 group-hover:text-green-500 group-hover:border-green-500/50 transition-colors">1</div>
                    <h3 className="text-lg font-black text-white mb-3">{t.step1}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-6">{t.step1Desc}</p>
                    <a href="https://cashtokens.studio/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-green-500 hover:text-green-400 flex items-center gap-1">
                        {t.ctaMint} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                </div>

                <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 bg-black border border-zinc-800 text-zinc-500 rounded-full flex items-center justify-center font-black text-2xl mb-6 group-hover:text-green-500 group-hover:border-green-500/50 transition-colors">2</div>
                    <h3 className="text-lg font-black text-white mb-3">{t.step2}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-6">{t.step2Desc}</p>
                    <Link href="/create" className="text-[10px] font-black uppercase tracking-widest text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors">
                        {t.ctaSell}
                    </Link>
                </div>

                <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 bg-black border border-zinc-800 text-zinc-500 rounded-full flex items-center justify-center font-black text-2xl mb-6 group-hover:text-green-500 group-hover:border-green-500/50 transition-colors">3</div>
                    <h3 className="text-lg font-black text-white mb-3">{t.step3}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">{t.step3Desc}</p>
                </div>

            </div>
        </section>

      </main>
    </div>
  );
}
