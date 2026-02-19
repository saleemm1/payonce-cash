'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    header: "Start a Movement",
    subHeader: "Crowdfund your dream with Bitcoin Cash.",
    titleLabel: "Campaign Title",
    descLabel: "The Story",
    organizerLabel: "Organizer",
    emailLabel: "Email",
    walletLabel: "BCH Wallet",
    goalLabel: "Funding Goal",
    coverLabel: "Cover Image URL",
    fileLabel: "Or Upload Image",
    launch: "Launch Campaign",
    processing: "Deploying...",
    preview: "Live Preview",
    copy: "Copy Link",
    done: "Copied",
    goalDesc: "Total needed",
    cardTitle: "Your Campaign",
    raised: "0.00 BCH raised",
    support: "Support this campaign",
    approx: "≈"
  },
  ar: {
    header: "ابدأ حراكاً",
    subHeader: "موّل حلمك باستخدام Bitcoin Cash.",
    titleLabel: "عنوان الحملة",
    descLabel: "القصة",
    organizerLabel: "المنظم",
    emailLabel: "البريد",
    walletLabel: "محفظة BCH",
    goalLabel: "هدف التمويل",
    coverLabel: "رابط صورة الغلاف",
    fileLabel: "أو رفع صورة",
    launch: "إطلاق الحملة",
    processing: "جاري النشر...",
    preview: "معاينة حية",
    copy: "نسخ الرابط",
    done: "تم النسخ",
    goalDesc: "المبلغ الإجمالي المطلوب",
    cardTitle: "حملتك",
    raised: "تم جمع 0.00 BCH",
    support: "ادعم هذه الحملة",
    approx: "تقريباً"
  },
  zh: {
    header: "发起运动",
    subHeader: "用 Bitcoin Cash 为您的梦想众筹。",
    titleLabel: "活动标题",
    descLabel: "故事",
    organizerLabel: "组织者",
    emailLabel: "电子邮件",
    walletLabel: "BCH 钱包",
    goalLabel: "目标",
    coverLabel: "封面图片链接",
    fileLabel: "或上传图片",
    launch: "发起活动",
    processing: "正在部署...",
    preview: "实时预览",
    copy: "复制链接",
    done: "已复制",
    goalDesc: "所需总额",
    cardTitle: "您的活动",
    raised: "已筹集 0.00 BCH",
    support: "支持此活动",
    approx: "约"
  }
};

export default function DonationCreatePage() {
  const [formData, setFormData] = useState({
    title: '', desc: '', organizer: '', email: '', wallet: '', goal: '', coverUrl: ''
  });
  const [goalCurrency, setGoalCurrency] = useState('BCH');
  const [previewFile, setPreviewFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [bchPrice, setBchPrice] = useState(0);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('payonce_lang');
    if (saved) setLang(saved);
    
    const fetchPrice = async () => {
        try {
            const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
            const data = await res.json();
            setBchPrice(data['bitcoin-cash'].usd);
        } catch(e) {}
    };
    fetchPrice();
  }, []);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('payonce_lang', l);
  };

  const t = translations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCurrency = () => {
    setGoalCurrency(prev => prev === 'BCH' ? 'USD' : 'BCH');
    setFormData(prev => ({...prev, goal: ''}));
  };

  const getFinalBchGoal = () => {
    const val = parseFloat(formData.goal);
    if (isNaN(val)) return 0;
    return goalCurrency === 'USD' && bchPrice > 0 ? val / bchPrice : val;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.wallet || !formData.title || !formData.goal) return alert("All fields are required");

    setUploading(true);
    try {
      let finalCover = formData.coverUrl;

      if (previewFile) {
        const imgData = new FormData();
        imgData.append("file", previewFile);
        const imgRes = await fetch("/api/upload", { method: "POST", body: imgData });
        const imgJson = await imgRes.json();
        if (imgJson.ipfsHash) finalCover = `https://gateway.pinata.cloud/ipfs/${imgJson.ipfsHash}`;
      }

      const finalGoal = getFinalBchGoal();

      const payload = {
        n: formData.title,
        d: formData.desc,
        sn: formData.organizer,
        se: formData.email,
        w: formData.wallet,
        g: finalGoal,
        pr: finalCover,
        dt: 'donation'
      };

      const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      const link = `${window.location.origin}/unlock-donation?id=${encodedId}`;
      setGeneratedLink(link);
      
      const history = JSON.parse(localStorage.getItem('payonce_history') || '[]');
      history.push({ title: formData.title, price: 'DONATION', url: link });
      localStorage.setItem('payonce_history', JSON.stringify(history));

    } catch (err) {
      alert("Error");
    } finally {
      setUploading(false);
    }
  };

  const inputStyle = "w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all";

  return (
    <div dir={dir} className={`min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30 ${lang === 'ar' ? 'font-arabic' : ''}`}>
      
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px]"></div>
      </div>

      <nav className="relative z-50 flex justify-between items-center p-6 max-w-7xl mx-auto">
         <Link href="/create" className="text-zinc-400 hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
         </Link>
         <div className="flex gap-2 text-[10px] font-black uppercase">
            <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
            <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
            <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
         </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
              
              <div className="space-y-8">
                  <div>
                      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-2 italic uppercase tracking-tighter">
                          {t.header}
                      </h1>
                      <p className="text-zinc-500 text-sm font-medium">{t.subHeader}</p>
                  </div>

                  <form onSubmit={handleGenerate} className="space-y-5">
                      <div className="space-y-4">
                          <input required name="title" value={formData.title} onChange={handleChange} placeholder={t.titleLabel} className={inputStyle} />
                          <textarea name="desc" value={formData.desc} onChange={handleChange} placeholder={t.descLabel} className={`${inputStyle} h-32 resize-none`} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <input name="organizer" value={formData.organizer} onChange={handleChange} placeholder={t.organizerLabel} className={inputStyle} />
                          <input name="email" value={formData.email} onChange={handleChange} placeholder={t.emailLabel} className={inputStyle} />
                      </div>

                      <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800 space-y-3 overflow-hidden">
                          <div className="flex justify-between items-center">
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t.goalLabel}</p>
                          </div>
                          <div className="flex items-center gap-3 w-full">
                              <input 
                                  required
                                  type="number" 
                                  step="any" 
                                  name="goal"
                                  value={formData.goal} 
                                  onChange={handleChange} 
                                  placeholder="0.00" 
                                  className="flex-1 min-w-0 bg-transparent text-3xl font-black text-white outline-none placeholder:text-zinc-700 tabular-nums"
                              />
                              <button 
                                  type="button" 
                                  onClick={toggleCurrency}
                                  className="shrink-0 flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-2 rounded-xl border border-zinc-800 hover:border-green-500 transition-all active:scale-95 shadow-sm group"
                              >
                                  <span className="text-sm font-black group-hover:text-green-500 transition-colors">{goalCurrency}</span>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 group-hover:text-green-500 transition-colors"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l-4-4M17 20l4-4"/></svg>
                              </button>
                          </div>
                          {formData.goal && bchPrice > 0 && (
                              <p className="text-xs text-zinc-400 font-mono text-right truncate">
                                  {t.approx} {goalCurrency === 'BCH' ? `$${(formData.goal * bchPrice).toLocaleString()} USD` : `${(formData.goal / bchPrice).toFixed(8)} BCH`}
                              </p>
                          )}
                      </div>

                      <div className="space-y-3">
                           <div className="flex gap-2">
                               <input type="file" accept="image/*" onChange={(e)=>setPreviewFile(e.target.files[0])} className="flex-1 text-[10px] text-zinc-400 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-white file:font-bold hover:file:bg-zinc-700 cursor-pointer" />
                               <input name="coverUrl" value={formData.coverUrl} onChange={handleChange} placeholder={t.coverLabel} className={`${inputStyle} flex-1`} />
                           </div>
                           <input required name="wallet" value={formData.wallet} onChange={handleChange} placeholder={t.walletLabel} className={`${inputStyle} text-center font-mono`} />
                      </div>

                      <button type="submit" disabled={uploading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-black py-4 rounded-xl text-lg uppercase italic tracking-wider transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]">
                          {uploading ? t.processing : t.launch}
                      </button>
                  </form>

                  {generatedLink && (
                      <div className="bg-black border border-green-500/30 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
                          <input readOnly value={generatedLink} className="flex-1 min-w-0 bg-transparent text-xs text-green-500 font-mono outline-none" />
                          <button onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="shrink-0 text-[10px] font-black bg-green-500/10 hover:bg-green-500/20 text-green-500 px-3 py-1.5 rounded-lg uppercase transition-colors">
                              {copied ? t.done : t.copy}
                          </button>
                      </div>
                  )}
              </div>

              <div className="hidden lg:block sticky top-8">
                  <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                      <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{t.preview}</span>
                  </div>
                  
                  <div className="bg-[#121214] rounded-[32px] overflow-hidden border border-zinc-800 shadow-2xl relative">
                       <div className="relative h-64 bg-zinc-900">
                           {(previewFile || formData.coverUrl) ? (
                               <img 
                                 src={previewFile ? URL.createObjectURL(previewFile) : formData.coverUrl} 
                                 className="w-full h-full object-cover" 
                               />
                           ) : (
                               <div className="w-full h-full flex items-center justify-center text-zinc-700 font-black italic text-4xl uppercase">
                                   IMG
                               </div>
                           )}
                           <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent"></div>
                       </div>
                       
                       <div className="p-8 relative -mt-12">
                           <div className="inline-block bg-green-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase mb-4 shadow-lg shadow-green-500/20">
                               {t.cardTitle}
                           </div>
                           <h2 className="text-3xl font-black italic uppercase text-white leading-none mb-2 break-words">
                               {formData.title || "Your Campaign Title"}
                           </h2>
                           <p className="text-zinc-500 text-xs font-bold mb-6">{t.organizerLabel}: <span className="text-white">{formData.organizer || "Name"}</span></p>
                           
                           <div className="w-full bg-zinc-800 h-2 rounded-full mb-2 overflow-hidden">
                               <div className="w-1/3 h-full bg-gradient-to-r from-green-600 to-green-400"></div>
                           </div>
                           <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-6">
                               <span>{t.raised}</span>
                               <span>{getFinalBchGoal() > 0 ? getFinalBchGoal().toFixed(4) : "0"} BCH</span>
                           </div>

                           <div className="w-full py-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center gap-2 text-zinc-500 font-black text-xs uppercase">
                               {t.support}
                           </div>
                       </div>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
}
