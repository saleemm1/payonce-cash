'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    title: "Launch Crowdfunding",
    subtitle: "Turn your vision into reality with BCH",
    campTitle: "Campaign Title",
    descLabel: "Your Story (Why should people support?)",
    organizer: "Organizer Name",
    email: "Support Email",
    coverLabel: "Campaign Banner (File or URL)",
    orUrl: "Or Image URL",
    wallet: "BCH Wallet (To receive funds)",
    goal: "Funding Goal (BCH)",
    goalDesc: "Total amount needed to succeed",
    generate: "Launch Campaign",
    processing: "Deploying to Blockchain...",
    copy: "Copy Link",
    done: "Copied!",
    preview: "Live Preview",
    security: "Non-custodial. Funds go directly to you."
  },
  ar: {
    title: "إطلاق حملة تمويل",
    subtitle: "حول رؤيتك لواقع باستخدام BCH",
    campTitle: "عنوان الحملة",
    descLabel: "قصتك (لماذا يجب أن يدعموك؟)",
    organizer: "اسم المنظم",
    email: "بريد الدعم",
    coverLabel: "بنر الحملة (ملف أو رابط)",
    orUrl: "أو رابط الصورة",
    wallet: "محفظة BCH (لاستلام التبرعات)",
    goal: "هدف التمويل (BCH)",
    goalDesc: "المبلغ الإجمالي المطلوب للنجاح",
    generate: "إطلاق الحملة",
    processing: "جاري النشر على البلوكشين...",
    copy: "نسخ الرابط",
    done: "تم النسخ!",
    preview: "معاينة حية",
    security: "غير وصائي. الأموال تصلك مباشرة."
  },
  zh: {
    title: "发起众筹",
    subtitle: "用 BCH 实现您的愿景",
    campTitle: "活动标题",
    descLabel: "您的故事（为什么要支持？）",
    organizer: "组织者姓名",
    email: "支持邮箱",
    coverLabel: "活动横幅 (文件或链接)",
    orUrl: "或图片链接",
    wallet: "BCH 钱包 (接收资金)",
    goal: "筹款目标 (BCH)",
    goalDesc: "成功所需的总金额",
    generate: "发起活动",
    processing: "正在部署到区块链...",
    copy: "复制链接",
    done: "已复制!",
    preview: "实时预览",
    security: "非托管。资金直接归您所有。"
  }
};

export default function DonationCreatePage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');
  const [goal, setGoal] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
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

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!wallet || !goal) return alert("Wallet and Goal are required");

    setUploading(true);
    try {
      let finalPreview = previewLink;

      if (previewFile) {
        const imgData = new FormData();
        imgData.append("file", previewFile);
        const imgRes = await fetch("/api/upload", { method: "POST", body: imgData });
        const imgJson = await imgRes.json();
        if (imgJson.ipfsHash) finalPreview = `https://gateway.pinata.cloud/ipfs/${imgJson.ipfsHash}`;
      }

      const payload = {
        n: title,
        d: desc,
        sn: organizer,
        se: email,
        w: wallet,
        g: parseFloat(goal),
        pr: finalPreview,
        dt: 'donation'
      };

      const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      const link = `${window.location.origin}/unlock-donation?id=${encodedId}`;
      setGeneratedLink(link);
      
      const history = JSON.parse(localStorage.getItem('payonce_history') || '[]');
      history.push({ title: title, price: `${goal} BCH Goal`, url: link });
      localStorage.setItem('payonce_history', JSON.stringify(history));

    } catch (err) {
      alert("Error processing campaign");
    } finally {
      setUploading(false);
    }
  };

  const inputBaseStyles = "w-full p-4 bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300 placeholder:text-zinc-600 hover:bg-zinc-900/80 hover:border-zinc-600 font-medium";

  return (
    <div dir={dir} className={`min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-12 font-sans relative overflow-hidden ${lang === 'ar' ? 'font-arabic' : ''}`}>
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-600/5 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="absolute top-6 right-6 flex gap-2 text-[10px] font-black uppercase z-50">
        <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
        <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
        <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
      </div>

      <form onSubmit={handleGenerate} className="relative z-10 w-full max-w-xl bg-[#121214]/80 backdrop-blur-3xl p-8 rounded-[32px] border border-white/5 shadow-2xl shadow-black/80 space-y-6 transform transition-all">
        
        <Link href="/create" className={`absolute top-8 ${lang === 'ar' ? 'left-8' : 'right-8'} text-zinc-600 hover:text-white transition-colors cursor-pointer`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </Link>

        <div className="text-center space-y-2 mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <span className="text-2xl">📢</span>
            </div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">{t.title}</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{t.subtitle}</p>
        </div>

        <div className="space-y-4">
             <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputBaseStyles} placeholder={t.campTitle} />
             <textarea required value={desc} onChange={(e) => setDesc(e.target.value)} className={`${inputBaseStyles} h-32 resize-none`} placeholder={t.descLabel}></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input required type="text" placeholder={t.organizer} onChange={(e)=>setOrganizer(e.target.value)} className={inputBaseStyles} />
          <input required type="email" placeholder={t.email} onChange={(e)=>setEmail(e.target.value)} className={inputBaseStyles} />
        </div>

        <div className="p-5 bg-zinc-900/30 rounded-2xl border border-white/5 space-y-3 group hover:border-green-500/20 transition-colors">
          <label className="text-[10px] text-zinc-400 block uppercase text-center font-black tracking-widest opacity-70 group-hover:text-green-500 transition-colors">{t.coverLabel}</label>
          <input type="file" accept="image/*" onChange={(e)=>setPreviewFile(e.target.files[0])} className="w-full text-xs text-zinc-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-zinc-800 file:text-white file:font-bold file:hover:bg-zinc-700 cursor-pointer transition-all" />
          <div className="relative">
              <input type="url" placeholder={t.orUrl} value={previewLink} onChange={(e)=>setPreviewLink(e.target.value)} className={`${inputBaseStyles} py-3 text-xs`} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/10 to-transparent p-6 rounded-2xl border border-green-500/20 flex flex-col gap-4">
            <label className="text-[10px] text-green-500 font-black uppercase tracking-widest">{t.goal}</label>
            <div className="flex items-center gap-3">
                <input 
                    required
                    type="number" 
                    step="any" 
                    placeholder="100" 
                    value={goal} 
                    onChange={(e) => setGoal(e.target.value)} 
                    className="flex-1 p-4 bg-black border border-zinc-700 rounded-xl text-3xl text-white outline-none focus:border-green-500 font-black text-center tabular-nums"
                />
                <span className="text-2xl font-black text-zinc-600">BCH</span>
            </div>
            <p className="text-[10px] text-zinc-500 text-center">{t.goalDesc}</p>
        </div>

        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className={`${inputBaseStyles} text-center font-mono text-sm`} placeholder={t.wallet} />
        
        <button type="submit" disabled={uploading} className="w-full relative overflow-hidden group bg-green-600 hover:bg-green-500 py-5 rounded-2xl font-black transition-all uppercase italic text-xl shadow-[0_0_40px_rgba(34,197,94,0.2)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-95 text-black">
          <span className="relative z-10 flex items-center justify-center gap-2">
            {uploading ? t.processing : t.generate}
          </span>
        </button>

        <p className="text-[9px] text-zinc-600 text-center uppercase font-bold tracking-widest flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {t.security}
        </p>

        {generatedLink && (
          <div className="mt-6 p-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg shadow-green-900/20 animate-in slide-in-from-bottom-5">
            <div className="bg-[#121214] p-4 rounded-[14px] flex items-center gap-3">
                <input readOnly value={generatedLink} className="flex-1 bg-transparent text-[11px] outline-none text-zinc-300 font-mono tracking-tight" />
                <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-xs font-black text-black uppercase transition-all">
                    {copied ? t.done : t.copy}
                </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
