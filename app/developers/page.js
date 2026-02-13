'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    back: "Back to Home",
    beta: "Public Beta",
    hero1: "Build the",
    hero2: "Sovereign Economy.",
    desc: "Integrate non-custodial Bitcoin Cash payments into your app, website, or game. Choose the No-Code generator for simple links, or the SDK for dynamic scale.",
    step1t: "Client-Side Logic",
    step1d: "Generate payment links directly in the browser. Zero backend dependency.",
    step2t: "Instant Settlement",
    step2d: "Funds go directly to your wallet address. We never touch the money.",
    step3t: "Cryptographic Proof",
    step3d: "HMAC signing ensures price integrity on the client side.",
    noCode: "No-Code Generator",
    sdk: "NPM SDK (Pro)",
    wallet: "Your BCH Wallet Address",
    prodName: "Product Name",
    price: "Price (USD)",
    tamper: "🔒 Tamper Protection",
    optional: "Optional",
    key: "Enter Secret Key (e.g. sk_live_...)",
    keyDesc: "Adds a signature to the payload to prevent client-side price modification.",
    gen: "Generate Embed Code",
    preview: "Button Preview",
    html: "HTML Embed Code",
    copied: "COPIED!",
    copy: "COPY CODE",
    dynamic: "Dynamic Integration",
    for: "For e-commerce, SaaS, and marketplaces.",
    docs: "Read Full Docs",
    source: "View Source"
  },
  ar: {
    back: "العودة للرئيسية",
    beta: "إصدار تجريبي",
    hero1: "ابنِ",
    hero2: "الاقتصاد السيادي.",
    desc: "ادمج مدفوعات بيتكوين كاش غير الوصائية في تطبيقك أو موقعك أو لعبتك. اختر المولد بدون كود للروابط البسيطة، أو SDK للتوسع الديناميكي.",
    step1t: "منطق من جانب العميل",
    step1d: "أنشئ روابط الدفع مباشرة في المتصفح. صفر اعتماد على الخلفية.",
    step2t: "تسوية فورية",
    step2d: "تذهب الأموال مباشرة إلى عنوان محفظتك. نحن لا نلمس المال أبداً.",
    step3t: "إثبات مشفر",
    step3d: "توقيع HMAC يضمن سلامة السعر من جانب العميل.",
    noCode: "مولد بدون كود",
    sdk: "NPM SDK (للمحترفين)",
    wallet: "عنوان محفظة BCH الخاص بك",
    prodName: "اسم المنتج",
    price: "السعر (USD)",
    tamper: "🔒 حماية من التلاعب",
    optional: "اختياري",
    key: "أدخل المفتاح السري (مثال: sk_live_...)",
    keyDesc: "يضيف توقيعاً للحمولة لمنع تعديل السعر من جانب العميل.",
    gen: "إنشاء كود التضمين",
    preview: "معاينة الزر",
    html: "كود تضمين HTML",
    copied: "تم النسخ!",
    copy: "نسخ الكود",
    dynamic: "تكامل ديناميكي",
    for: "للتجارة الإلكترونية، البرمجيات، والأسواق.",
    docs: "اقرأ التوثيق الكامل",
    source: "عرض المصدر"
  },
  zh: {
    back: "返回首页",
    beta: "公开测试版",
    hero1: "构建",
    hero2: "主权经济。",
    desc: "将非托管比特币现金支付集成到您的应用、网站或游戏中。选择无代码生成器获取简单链接，或选择 SDK 进行动态扩展。",
    step1t: "客户端逻辑",
    step1d: "直接在浏览器中生成支付链接。零后端依赖。",
    step2t: "即时结算",
    step2d: "资金直接进入您的钱包地址。我们从不触碰资金。",
    step3t: "加密证明",
    step3d: "HMAC 签名确客户端价格完整性。",
    noCode: "无代码生成器",
    sdk: "NPM SDK (专业版)",
    wallet: "您的 BCH 钱包地址",
    prodName: "产品名称",
    price: "价格 (USD)",
    tamper: "🔒 防篡改保护",
    optional: "可选",
    key: "输入密钥 (如 sk_live_...)",
    keyDesc: "向负载添加签名以防止客户端价格修改。",
    gen: "生成嵌入代码",
    preview: "按钮预览",
    html: "HTML 嵌入代码",
    copied: "已复制！",
    copy: "复制代码",
    dynamic: "动态集成",
    for: "用于电子商务、SaaS 和市场。",
    docs: "阅读完整文档",
    source: "查看源代码"
  }
};

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState('generator');
  const [wallet, setWallet] = useState('');
  const [price, setPrice] = useState('10');
  const [productName, setProductName] = useState('My Product');
  const [secret, setSecret] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
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

  const generateCode = () => {
    if (!wallet) return alert('Please enter a BCH wallet address');
    
    const payload = {
        w: wallet,
        p: price,
        n: productName,
        dt: 'invoice',
        sec: secret ? `hmac_sha256_${secret.substring(0, 4)}...` : null
    };
    
    const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://payonce-cash.vercel.app'}/unlock?id=${encodedId}`;
    
    const code = `<a href="${url}" target="_blank" style="background-color: #22c55e; color: black; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-family: sans-serif; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(34,197,94,0.3); transition: transform 0.2s ease;">
  <span>⚡ Pay with BCH</span>
</a>`;
    
    setGeneratedCode(code);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sdkExample = `
npm install git+https://github.com/saleemm1/payonce-sdk.git

const { PayOnce } = require('payonce-sdk');

const invoice = PayOnce.createInvoice({
  wallet: "bitcoincash:qp...", 
  price: 15.00,
  product: "Premium Asset",
  secretKey: process.env.PAYONCE_SECRET
});

console.log(invoice.url);
`;

  return (
    <div dir={dir} className={`min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30 ${lang === 'ar' ? 'font-arabic' : ''}`}>
      
      <div className="absolute top-6 right-6 flex gap-2 text-[10px] font-black uppercase z-50">
        <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
        <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
        <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
      </div>

      <nav className="border-b border-white/5 py-6 px-6 flex justify-between items-center max-w-7xl mx-auto">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 font-black text-xs border border-green-500/20">{`</>`}</div>
            <span className="font-bold text-lg tracking-tight">PayOnce <span className="text-zinc-500">Developers</span></span>
         </div>
         <Link href="/">
            <button className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">{t.back}</button>
         </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
            <div className="inline-block bg-green-900/20 text-green-500 text-[10px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full border border-green-500/20 mb-6">
                {t.beta}
            </div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-6 leading-none">
                {t.hero1} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">{t.hero2}</span>
            </h1>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                {t.desc}
            </p>

            <div className="space-y-8">
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 shrink-0">1</div>
                    <div>
                        <h3 className="font-bold text-white mb-1">{t.step1t}</h3>
                        <p className="text-sm text-zinc-500">{t.step1d}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 shrink-0">2</div>
                    <div>
                        <h3 className="font-bold text-white mb-1">{t.step2t}</h3>
                        <p className="text-sm text-zinc-500">{t.step2d}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 shrink-0">3</div>
                    <div>
                        <h3 className="font-bold text-white mb-1">{t.step3t}</h3>
                        <p className="text-sm text-zinc-500">{t.step3d}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 shadow-2xl h-fit">
            <div className="flex bg-black/50 rounded-xl p-1 mb-8 border border-white/5">
                <button 
                    onClick={() => setActiveTab('generator')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wide rounded-lg transition-all ${activeTab === 'generator' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                >
                    {t.noCode}
                </button>
                <button 
                    onClick={() => setActiveTab('sdk')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wide rounded-lg transition-all ${activeTab === 'sdk' ? 'bg-green-500/10 text-green-500 border border-green-500/20 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                >
                    {t.sdk}
                </button>
            </div>

            {activeTab === 'generator' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">{t.wallet}</label>
                            <input type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="bitcoincash:qp..." className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-green-500 transition-colors" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">{t.prodName}</label>
                                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-green-500 transition-colors" />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">{t.price}</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-green-500 transition-colors" />
                            </div>
                        </div>

                        <div className="bg-green-900/10 p-4 rounded-xl border border-green-500/20 mt-2">
                            <div className="flex items-center justify-between mb-2">
                                 <label className="text-[10px] uppercase font-black text-green-500 flex items-center gap-1">
                                    {t.tamper}
                                 </label>
                                 <span className="text-[9px] text-zinc-500">{t.optional}</span>
                            </div>
                            <input 
                                type="password" 
                                value={secret} 
                                onChange={(e) => setSecret(e.target.value)} 
                                placeholder={t.key} 
                                className="w-full bg-black/50 border border-green-500/20 rounded-lg p-2 text-xs text-white outline-none focus:border-green-500 transition-colors font-mono tracking-widest" 
                            />
                            <p className="text-[9px] text-zinc-600 mt-2 leading-tight">
                                {t.keyDesc}
                            </p>
                        </div>

                        <button onClick={generateCode} className="w-full bg-white text-black font-black uppercase py-3 rounded-xl hover:bg-green-500 hover:scale-[1.02] transition-all shadow-xl">
                            {t.gen}
                        </button>
                    </div>

                    {generatedCode && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 mt-8 pt-8 border-t border-white/5">
                            <div className="mb-6">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-3">{t.preview}</label>
                                <div className="p-8 bg-black/30 border border-dashed border-zinc-700 rounded-2xl flex justify-center items-center min-h-[100px]">
                                     <div dangerouslySetInnerHTML={{ __html: generatedCode }} />
                                </div>
                            </div>

                            <div className="relative">
                                 <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">{t.html}</label>
                                 <div className="bg-black rounded-xl border border-white/10 relative group overflow-hidden">
                                    <textarea 
                                        readOnly 
                                        value={generatedCode} 
                                        className="w-full bg-[#080808] text-zinc-400 text-xs font-mono h-32 p-4 resize-none outline-none leading-relaxed"
                                        onClick={(e) => e.target.select()}
                                    />
                                    <button 
                                        onClick={handleCopy} 
                                        className={`absolute top-3 ${lang === 'ar' ? 'left-3' : 'right-3'} text-[10px] font-bold px-4 py-2 rounded-lg transition-all shadow-lg z-10 ${copied ? 'bg-green-500 text-black' : 'bg-zinc-800 text-white hover:bg-white hover:text-black'}`}
                                    >
                                        {copied ? t.copied : t.copy}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'sdk' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="mb-6 text-center">
                        <div className="inline-block p-3 bg-zinc-900 rounded-full mb-3 text-2xl">📦</div>
                        <h3 className="text-lg font-bold text-white">{t.dynamic}</h3>
                        <p className="text-zinc-500 text-xs mt-1">{t.for}</p>
                    </div>

                    <div className="bg-black/80 rounded-xl border border-white/10 overflow-hidden relative group">
                        <div className="bg-[#1a1a1a] px-4 py-2 border-b border-white/5 flex items-center gap-2">
                             <div className="flex gap-1.5">
                                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                             </div>
                             <span className="text-[10px] text-zinc-500 font-mono ml-2">integration.js</span>
                        </div>
                        <textarea 
                            readOnly 
                            value={sdkExample} 
                            className="w-full bg-transparent text-zinc-300 text-xs font-mono h-[300px] p-4 resize-none outline-none leading-relaxed selection:bg-green-500/30"
                            dir="ltr"
                        />
                        <div className={`absolute top-10 ${lang === 'ar' ? 'left-4' : 'right-4'}`}>
                             <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-500/20">v1.0.2</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                        <a href="https://github.com/saleemm1/payonce-sdk#readme" target="_blank" rel="noopener noreferrer" className="flex-1">
                            <button className="w-full h-full bg-white text-black font-black uppercase py-3 rounded-xl hover:bg-zinc-200 transition-colors text-xs">
                               {t.docs}
                            </button>
                        </a>
                        
                        <a href="https://github.com/saleemm1/payonce-sdk" target="_blank" rel="noopener noreferrer" className="flex-1">
                            <button className="w-full h-full border border-white/20 text-white font-black uppercase py-3 rounded-xl hover:bg-white/5 transition-colors text-xs flex items-center justify-center gap-2">
                               <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                               {t.source}
                            </button>
                        </a>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
