'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    back: "Back to Home",
    badge: "WEB3 COMMERCE ENGINE",
    title1: "The Future of",
    title2: "Customer Loyalty",
    desc: "Ditch emails, passwords, and points. Empower your community with pure cryptographic proof using Bitcoin Cash CashTokens. Real ownership, real rewards.",
    card1Title: "Zero Friction",
    card1Desc: "Customers simply hold your token in their wallet to automatically unlock discounts. No sign-ups required.",
    card2Title: "Cryptographic Proof",
    card2Desc: "Instant, permissionless verification on the BCH Mainnet. 100% fake-proof and transparent.",
    card3Title: "Global Ecosystem",
    card3Desc: "Your loyalty tokens can be traded, gifted, or held as collectibles across the entire Bitcoin Cash network.",
    stepTitle: "How to Launch Your Web3 Loyalty Program?",
    step1: "1. Mint Your Token",
    step1Desc: "Use a native BCH platform to mint your brand's unique CashToken.",
    step2: "2. Create a Product",
    step2Desc: "Use PayOnce to create a payment link and attach your Token ID for a secret discount or full access.",
    step3: "3. Reward Holders",
    step3Desc: "Share your link! Only users holding your token will get the VIP treatment.",
    ctaMint: "Mint Token Now ↗",
    ctaSell: "Start Selling"
  },
  ar: {
    back: "العودة للرئيسية",
    badge: "محرك تجارة WEB3",
    title1: "مستقبل",
    title2: "ولاء العملاء",
    desc: "تخلص من الإيميلات وكلمات السر. امنح مجتمعك قوة الإثبات المشفر باستخدام توكنز شبكة بيتكوين كاش (CashTokens). ملكية حقيقية، ومكافآت حقيقية.",
    card1Title: "بدون أي تعقيد",
    card1Desc: "يحتفظ عملاؤك بالتوكن في محافظهم لفتح الخصومات تلقائياً. لا حاجة لإنشاء حسابات.",
    card2Title: "إثبات مشفر",
    card2Desc: "تحقق فوري ولامركزي على شبكة BCH الرئيسية. شفاف 100% ومستحيل التزوير.",
    card3Title: "نظام بيئي عالمي",
    card3Desc: "يمكن تداول توكنز الولاء الخاصة بك، إهداؤها، أو الاحتفاظ بها كأصول رقمية على مستوى العالم.",
    stepTitle: "كيف تطلق برنامج الولاء الخاص بك؟",
    step1: "1. اصنع التوكن الخاص بك",
    step1Desc: "استخدم منصات BCH لإنشاء توكن CashToken خاص بعلامتك التجارية.",
    step2: "2. أنشئ منتجك",
    step2Desc: "استخدم PayOnce لإنشاء رابط دفع واربطه بمعرف التوكن الخاص بك لتقديم خصم سري.",
    step3: "3. كافئ مجتمعك",
    step3Desc: "شارك الرابط! فقط من يمتلك التوكن الخاص بك سيحصل على تجربة الـ VIP.",
    ctaMint: "اصنع التوكن الآن ↗",
    ctaSell: "ابدأ البيع"
  },
  zh: {
    back: "返回首页",
    badge: "WEB3 商业引擎",
    title1: "客户忠诚度的",
    title2: "未来",
    desc: "抛弃电子邮件、密码和积分。使用比特币现金 CashTokens，通过纯密码学证明为您的社区赋能。真正的所有权，真正的奖励。",
    card1Title: "零摩擦",
    card1Desc: "客户只需在钱包中持有您的代币即可自动解锁折扣。无需注册。",
    card2Title: "密码学证明",
    card2Desc: "在 BCH 主网上进行即时、无需许可的验证。100% 防伪且透明。",
    card3Title: "全球生态系统",
    card3Desc: "您的忠诚度代币可以在整个比特币现金网络中进行交易、赠送或作为收藏品持有。",
    stepTitle: "如何启动您的 Web3 忠诚度计划？",
    step1: "1. 铸造您的代币",
    step1Desc: "使用原生的 BCH 平台铸造您品牌的独特 CashToken。",
    step2: "2. 创建产品",
    step2Desc: "使用 PayOnce 创建支付链接，并附加您的代币 ID 以提供秘密折扣或完全访问权限。",
    step3: "3. 奖励持有者",
    step3Desc: "分享您的链接！只有持有您代币的用户才能获得 VIP 待遇。",
    ctaMint: "立即铸造代币 ↗",
    ctaSell: "开始销售"
  }
};

export default function LoyaltyPage() {
  const [lang, setLang] = useState('en');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const savedLang = localStorage.getItem('payonce_lang');
    if (savedLang) setLang(savedLang);

    const handleMouseMove = (e) => {
        setMousePos({
            x: (e.clientX / window.innerWidth) * 100,
            y: (e.clientY / window.innerHeight) * 100,
        });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('payonce_lang', l);
  };

  const t = translations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div dir={dir} className={`min-h-screen bg-[#050505] text-white font-sans relative overflow-x-hidden selection:bg-green-500/30 ${lang === 'ar' ? 'font-arabic' : ''}`}>
      
      <div 
        className="fixed inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none transition-all duration-300 ease-out"
        style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)`
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-green-500/10 blur-[120px] rounded-[100%] pointer-events-none z-0"></div>

      <nav className="relative z-50 flex justify-between items-center p-6 lg:px-12 backdrop-blur-md border-b border-white/5 sticky top-0">
        <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest group">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-green-500/50 group-hover:text-green-500 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={lang === 'ar' ? 'rotate-180' : ''}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </div>
            <span className="hidden sm:block">{t.back}</span>
        </Link>
        <div className="flex gap-2 text-[10px] font-black uppercase bg-zinc-900/50 p-1.5 rounded-full border border-zinc-800">
          <button onClick={() => changeLang('en')} className={`px-3 py-1.5 rounded-full transition-all ${lang === 'en' ? 'bg-green-500 text-black' : 'text-zinc-500 hover:text-white'}`}>EN</button>
          <button onClick={() => changeLang('ar')} className={`px-3 py-1.5 rounded-full transition-all ${lang === 'ar' ? 'bg-green-500 text-black' : 'text-zinc-500 hover:text-white'}`}>AR</button>
          <button onClick={() => changeLang('zh')} className={`px-3 py-1.5 rounded-full transition-all ${lang === 'zh' ? 'bg-green-500 text-black' : 'text-zinc-500 hover:text-white'}`}>CN</button>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32">
        
        <section className="text-center max-w-4xl mx-auto mb-32 animate-in slide-in-from-bottom-8 fade-in duration-1000">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 text-green-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {t.badge}
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] mb-8">
                {t.title1} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-400 via-green-500 to-green-800 drop-shadow-lg">{t.title2}</span>
            </h1>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                {t.desc}
            </p>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-32 relative">
            <div className="bg-[#0a0a0c] p-8 rounded-[2rem] border border-white/5 hover:border-green-500/30 hover:bg-[#0d1410] transition-all duration-500 group shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-[50px] group-hover:bg-green-500/10 transition-colors"></div>
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:bg-green-500/20 border border-white/5 group-hover:border-green-500/30 transition-all duration-500 shadow-lg">
                    ⚡
                </div>
                <h3 className="text-2xl font-black uppercase italic text-white mb-4 tracking-tight">{t.card1Title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{t.card1Desc}</p>
            </div>
            
            <div className="bg-[#0a0a0c] p-8 rounded-[2rem] border border-white/5 hover:border-green-500/30 hover:bg-[#0d1410] transition-all duration-500 group shadow-2xl overflow-hidden relative md:-translate-y-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-[50px] group-hover:bg-green-500/10 transition-colors"></div>
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:bg-green-500/20 border border-white/5 group-hover:border-green-500/30 transition-all duration-500 shadow-lg">
                    🔐
                </div>
                <h3 className="text-2xl font-black uppercase italic text-white mb-4 tracking-tight">{t.card2Title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{t.card2Desc}</p>
            </div>

            <div className="bg-[#0a0a0c] p-8 rounded-[2rem] border border-white/5 hover:border-green-500/30 hover:bg-[#0d1410] transition-all duration-500 group shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-[50px] group-hover:bg-green-500/10 transition-colors"></div>
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:bg-green-500/20 border border-white/5 group-hover:border-green-500/30 transition-all duration-500 shadow-lg">
                    🌍
                </div>
                <h3 className="text-2xl font-black uppercase italic text-white mb-4 tracking-tight">{t.card3Title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{t.card3Desc}</p>
            </div>
        </section>

        <section className="max-w-5xl mx-auto bg-gradient-to-b from-[#0f1115] to-[#0a0a0c] rounded-[3rem] p-10 md:p-20 border border-zinc-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-4xl font-black uppercase italic text-center mb-16 relative z-10 tracking-tighter">{t.stepTitle}</h2>

            <div className="space-y-16 relative z-10">
                
                <div className="flex flex-col md:flex-row gap-8 items-start group">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30 text-green-400 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 shadow-[0_0_30px_rgba(34,197,94,0.15)] group-hover:scale-110 transition-transform duration-500">1</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{t.step1}</h3>
                        <p className="text-zinc-400 text-base mb-6 leading-relaxed max-w-xl">{t.step1Desc}</p>
                        <a href="https://cashtokens.studio/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-green-400 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border border-green-500/20 hover:border-green-500/50 shadow-lg">
                            {t.ctaMint}
                        </a>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start group">
                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 group-hover:scale-110 group-hover:border-zinc-600 transition-transform duration-500">2</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{t.step2}</h3>
                        <p className="text-zinc-400 text-base mb-6 leading-relaxed max-w-xl">{t.step2Desc}</p>
                        <Link href="/create" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-xl hover:shadow-white/20">
                            {t.ctaSell}
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start group">
                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 group-hover:scale-110 group-hover:border-zinc-600 transition-transform duration-500">3</div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{t.step3}</h3>
                        <p className="text-zinc-400 text-base leading-relaxed max-w-xl">{t.step3Desc}</p>
                    </div>
                </div>

            </div>
        </section>

      </main>
    </div>
  );
}
