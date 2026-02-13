'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const translations = {
  en: {
    back: "Back to Home",
    title1: "What do you want to",
    title2: "SELL?",
    subtitle: "Decentralized Payment Infrastructure for Bitcoin Cash",
    business: "Business & Retail Solutions",
    merchant: "Merchant",
    terminal: "Terminal",
    merchantDesc: "Deploy a real-world BCH payment system for your business. Accept Bitcoin Cash instantly — in-store or online.",
    posMode: "POS Mode",
    retail: "In-store Retail",
    personal: "Personal",
    billing: "1-on-1 Billing",
    digiShop: "Digital Shop",
    public: "Public Listing",
    openTerm: "Open Terminal",
    livePos: "Live Web POS",
    posDesc: "Turn any smartphone or tablet into a Bitcoin Cash Point of Sale. No hardware required.",
    assetLock: "Digital Asset Locking",
    more: "More assets",
    soon: "Coming Soon",
    custodial: "Non-Custodial",
    instant: "Instant Settlement",
    zero: "Zero Fees",
    powered: "Powered by Bitcoin Cash",
    assets: {
      code: "Source Code",
      link: "Secure Link",
      folder: "Secure Folder",
      pdf: "PDF Document",
      office: "Office Files",
      video: "Video Content",
      mini: "Mini-Course",
      books: "Digital Book",
      ticket: "Event Ticket",
      game: "Game Card",
      app: "App License",
      codeDesc: "Scripts, plugins, or software",
      linkDesc: "Zoom, Forms, or Invites",
      folderDesc: "Archives & bulk data",
      pdfDesc: "E-books, guides, or reports",
      officeDesc: "Word, Excel, & PowerPoint docs",
      videoDesc: "Tutorials, movies, or clips",
      miniDesc: "Structured learning lessons",
      booksDesc: "Full length digital publications",
      ticketDesc: "Access to exclusive events",
      gameDesc: "In-game items and assets",
      appDesc: "Software activation keys",
    }
  },
  ar: {
    back: "العودة للرئيسية",
    title1: "ماذا تريد أن",
    title2: "تبيع؟",
    subtitle: "بنية الدفع اللامركزية لبيتكوين كاش",
    business: "حلول الأعمال والتجزئة",
    merchant: "محطة",
    terminal: "التاجر",
    merchantDesc: "انشر نظام دفع بيتكوين كاش حقيقي لعملك. اقبل بيتكوين كاش فوراً - في المتجر أو عبر الإنترنت.",
    posMode: "نظام POS",
    retail: "بيع بالتجزئة",
    personal: "شخصي",
    billing: "فواتير مباشرة",
    digiShop: "متجر رقمي",
    public: "قائمة عامة",
    openTerm: "فتح المحطة",
    livePos: "نقطة بيع ويب",
    posDesc: "حول أي هاتف ذكي أو جهاز لوحي إلى نقطة بيع بيتكوين كاش. لا أجهزة مطلوبة.",
    assetLock: "قفل الأصول الرقمية",
    more: "المزيد من الأصول",
    soon: "قريباً",
    custodial: "غير وصائي",
    instant: "تسوية فورية",
    zero: "صفر رسوم",
    powered: "مدعوم بواسطة بيتكوين كاش",
    assets: {
      code: "كود برمجي",
      link: "رابط آمن",
      folder: "مجلد آمن",
      pdf: "ملف PDF",
      office: "ملفات أوفيس",
      video: "محتوى فيديو",
      mini: "دورة مصغرة",
      books: "كتاب رقمي",
      ticket: "تذكرة حدث",
      game: "بطاقة ألعاب",
      app: "رخصة تطبيق",
      codeDesc: "سكربتات، إضافات، أو برامج",
      linkDesc: "زوم، نماذج، أو دعوات",
      folderDesc: "أرشيف وبيانات ضخمة",
      pdfDesc: "كتب إلكترونية، أدلة، تقارير",
      officeDesc: "وورد، إكسل، باوربوينت",
      videoDesc: "شروحات، أفلام، مقاطع",
      miniDesc: "دروس تعليمية منظمة",
      booksDesc: "منشورات رقمية كاملة",
      ticketDesc: "وصول لأحداث حصرية",
      gameDesc: "عناصر وأصول داخل اللعبة",
      appDesc: "مفاتيح تفعيل البرامج",
    }
  },
  zh: {
    back: "返回首页",
    title1: "您想出售",
    title2: "什么？",
    subtitle: "比特币现金的去中心化支付基础设施",
    business: "商业与零售解决方案",
    merchant: "商户",
    terminal: "终端",
    merchantDesc: "为您的业务部署真实的 BCH 支付系统。即时接受比特币现金——店内或在线。",
    posMode: "POS 模式",
    retail: "店内零售",
    personal: "个人",
    billing: "一对一计费",
    digiShop: "数字商店",
    public: "公开列表",
    openTerm: "打开终端",
    livePos: "网页 POS",
    posDesc: "将任何智能手机或平板电脑变成比特币现金销售点。无需硬件。",
    assetLock: "数字资产锁定",
    more: "更多资产",
    soon: "即将推出",
    custodial: "非托管",
    instant: "即时结算",
    zero: "零费用",
    powered: "由比特币现金驱动",
    assets: {
      code: "源代码",
      link: "安全链接",
      folder: "安全文件夹",
      pdf: "PDF 文档",
      office: "办公文件",
      video: "视频内容",
      mini: "迷你课程",
      books: "电子书",
      ticket: "活动门票",
      game: "游戏卡",
      app: "应用授权",
      codeDesc: "脚本、插件或软件",
      linkDesc: "Zoom、表格或邀请",
      folderDesc: "存档和批量数据",
      pdfDesc: "电子书、指南或报告",
      officeDesc: "Word、Excel 和 PPT",
      videoDesc: "教程、电影或片段",
      miniDesc: "结构化学习课程",
      booksDesc: "完整版数字出版物",
      ticketDesc: "独家活动入场券",
      gameDesc: "游戏内物品和资产",
      appDesc: "软件激活密钥",
    }
  }
};

export default function CreatePage() {
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

  const digitalAssets = [
    { name: t.assets.code, slug: 'code', icon: '💻', desc: t.assets.codeDesc },
    { name: t.assets.link, slug: 'link', icon: '🔗', desc: t.assets.linkDesc },
    { name: t.assets.folder, slug: 'folder', icon: '📁', desc: t.assets.folderDesc },
    { name: t.assets.pdf, slug: 'pdf', icon: '📄', desc: t.assets.pdfDesc },
    { name: t.assets.office, slug: 'office', icon: '📊', desc: t.assets.officeDesc },
    { name: t.assets.video, slug: 'video', icon: '🎬', desc: t.assets.videoDesc },
    { name: t.assets.mini, slug: 'mini-course', icon: '🎓', desc: t.assets.miniDesc },
    { name: t.assets.books, slug: 'books', icon: '📚', desc: t.assets.booksDesc },
    { name: t.assets.ticket, slug: 'ticket', icon: '🎟️', desc: t.assets.ticketDesc },
    { name: t.assets.game, slug: 'game-card', icon: '🎮', desc: t.assets.gameDesc },
    { name: t.assets.app, slug: 'app-activate-card', icon: '🔑', desc: t.assets.appDesc },
  ];

  return (
    <div dir={dir} className={`min-h-screen bg-[#09090b] text-white flex flex-col items-center py-20 px-6 relative overflow-hidden font-sans ${lang === 'ar' ? 'font-arabic' : ''}`}>
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.08)_0%,_transparent_70%)] -z-10"></div>
      
      <div className="absolute top-6 right-6 flex gap-2 text-[10px] font-black uppercase z-50">
        <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
        <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
        <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
      </div>

      <div className="text-center max-w-3xl mb-16">
        <Link href="/">
          <div className="inline-flex items-center gap-2 mb-8 group cursor-pointer">
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 group-hover:border-green-500/50 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={lang === 'ar' ? 'rotate-180' : ''}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">{t.back}</span>
          </div>
        </Link>
        
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 uppercase italic leading-none">
          {t.title1} <span className="text-green-500"> {t.title2}</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">{t.subtitle}</p>
      </div>

      <div className="w-full max-w-5xl mb-16">
        <div className="flex items-center gap-4 mb-8">
           <span className="text-[11px] uppercase font-black tracking-[4px] text-green-500 whitespace-nowrap">{t.business}</span>
           <div className="h-[1px] bg-gradient-to-r from-green-500/50 to-transparent flex-1"></div>
        </div>

        <Link
            href="/create/invoice"
            className="group relative w-full bg-[#121214] border border-white/5 hover:border-green-500/40 p-1 rounded-[40px] transition-all duration-500 hover:-translate-y-2 block mb-6"
          >
            <div className="bg-zinc-950/50 rounded-[38px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden relative">
              <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-64 h-64 bg-green-600/5 blur-[100px] -z-10`}></div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                <div className="text-6xl bg-zinc-900 w-28 h-28 flex items-center justify-center rounded-3xl border border-white/5 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  🧾
                </div>
                <div className={`text-center ${lang === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
                   <h3 className="text-3xl md:text-4xl font-black mb-3 tracking-tighter text-white uppercase italic">
                   {t.merchant} <span className="text-green-500 text-shadow-glow">{t.terminal}</span>
                   </h3>
                   <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-xl mb-6">
                      {t.merchantDesc}
                   </p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-zinc-900/80 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">🏪</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-green-500 uppercase">{t.posMode}</span>
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">{t.retail}</span>
                        </div>
                      </div>
                      <div className="bg-zinc-900/80 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">👤</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-blue-400 uppercase">{t.personal}</span>
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">{t.billing}</span>
                        </div>
                      </div>
                      <div className="bg-zinc-900/80 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">📦</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-purple-400 uppercase">{t.digiShop}</span>
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">{t.public}</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="relative z-10 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-tighter flex items-center gap-3 group-hover:bg-green-500 transition-all shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap">
                  {t.openTerm} <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={lang === 'ar' ? 'rotate-180' : ''}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
        </Link>

        
        <Link href="/pos" className="group w-full bg-[#121214] border border-white/5 hover:border-green-500/40 p-6 rounded-[32px] transition-all hover:-translate-y-1 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-full bg-green-500/5 blur-[60px]"></div>
            <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center text-4xl border border-white/5 group-hover:scale-110 transition-transform shadow-2xl">
                📱
            </div>
            <div className={`text-center ${lang === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
                <h4 className="text-2xl font-black uppercase italic text-white group-hover:text-green-500 transition-colors">
                    {t.livePos}
                </h4>
                <p className="text-sm text-zinc-400 font-medium mt-1 max-w-lg">
                    {t.posDesc}
                </p>
            </div>
            <div className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${lang === 'ar' ? 'translate-x-2' : '-translate-x-2'} group-hover:translate-x-0 hidden md:block`}>
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={lang === 'ar' ? 'rotate-180' : ''}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
            </div>
        </Link>
      </div>

      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
           <span className="text-[11px] uppercase font-black tracking-[4px] text-zinc-600 whitespace-nowrap">{t.assetLock}</span>
           <div className="h-[1px] bg-zinc-800 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {digitalAssets.map((type) => (
            <Link
              key={type.slug}
              href={`/create/${type.slug}`}
              className="group relative bg-[#121214] hover:bg-zinc-900/50 border border-white/5 hover:border-white/20 p-8 rounded-[32px] transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative z-10">
                <div className="text-4xl mb-6 bg-zinc-900 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  {type.icon}
                </div>
                
                <h3 className="text-xl font-black mb-2 tracking-tight group-hover:text-green-500 transition-colors uppercase italic">
                  {type.name}
                </h3>
                
                <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-4">
                  {type.desc}
                </p>
                
                <div className={`mt-6 flex ${lang === 'ar' ? 'justify-start' : 'justify-end'} opacity-0 group-hover:opacity-100 transition-all ${lang === 'ar' ? '-translate-x-4' : 'translate-x-4'} group-hover:translate-x-0`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={lang === 'ar' ? 'rotate-180' : ''}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}

          <div className="border-2 border-dashed border-white/5 p-8 rounded-[32px] flex flex-col items-center justify-center text-center group hover:bg-zinc-900/20 transition-all">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-zinc-700 font-bold group-hover:scale-110 transition-transform">
                  +
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-600">{t.more}<br/>{t.soon}</span>
          </div>
        </div>
      </div>

      <footer className="mt-32 flex flex-col items-center gap-4">
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[3px] text-zinc-700">
            <span>{t.custodial}</span>
            <span className="text-green-900">•</span>
            <span>{t.instant}</span>
            <span className="text-green-900">•</span>
            <span>{t.zero}</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[5px] text-green-500/40">{t.powered}</p>
      </footer>

      <style jsx>{`
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
        }
      `}</style>

    </div>
  );
}
