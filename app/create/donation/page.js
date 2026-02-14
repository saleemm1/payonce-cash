'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    header: "Create Donation Campaign",
    subHeader: "Raise funds with the power of Bitcoin Cash.",
    titleLabel: "Campaign Title",
    descLabel: "Why are you raising funds?",
    organizerLabel: "Organizer Name",
    emailLabel: "Support Email",
    walletLabel: "Your BCH Wallet Address",
    goalLabel: "Goal Amount (BCH)",
    coverLabel: "Campaign Image URL",
    fileLabel: "Or Upload Image",
    launch: "Launch Campaign",
    processing: "Creating...",
    preview: "Live Preview",
    copy: "Copy Link",
    done: "Copied!",
    goalDesc: "Total BCH needed",
    optional: "Optional",
    cardTitle: "Campaign Preview",
    raised: "0.00 BCH Raised",
    support: "Support Campaign",
    security: "Funds go directly to your wallet. Non-custodial."
  },
  ar: {
    header: "إنشاء حملة تبرع",
    subHeader: "اجمع التبرعات بقوة البيتكوين كاش.",
    titleLabel: "عنوان الحملة",
    descLabel: "لماذا تجمع التبرعات؟ (القصة)",
    organizerLabel: "اسم المنظم",
    emailLabel: "بريد الدعم",
    walletLabel: "عنوان محفظة BCH الخاصة بك",
    goalLabel: "مبلغ الهدف (BCH)",
    coverLabel: "رابط صورة الحملة",
    fileLabel: "أو رفع صورة",
    launch: "إطلاق الحملة",
    processing: "جاري الإنشاء...",
    preview: "معاينة حية",
    copy: "نسخ الرابط",
    done: "تم النسخ!",
    goalDesc: "إجمالي BCH المطلوب",
    optional: "اختياري",
    cardTitle: "معاينة الحملة",
    raised: "تم جمع 0.00 BCH",
    support: "ادعم الحملة",
    security: "الأموال تصل لمحفظتك مباشرة. غير وصائي."
  },
  zh: {
    header: "创建捐赠活动",
    subHeader: "利用 Bitcoin Cash 的力量筹集资金。",
    titleLabel: "活动标题",
    descLabel: "您为什么要筹集资金？",
    organizerLabel: "组织者姓名",
    emailLabel: "支持邮箱",
    walletLabel: "您的 BCH 钱包地址",
    goalLabel: "目标金额 (BCH)",
    coverLabel: "活动图片链接",
    fileLabel: "或上传图片",
    launch: "发起活动",
    processing: "正在创建...",
    preview: "实时预览",
    copy: "复制链接",
    done: "已复制！",
    goalDesc: "所需 BCH 总额",
    optional: "可选",
    cardTitle: "活动预览",
    raised: "已筹集 0.00 BCH",
    support: "支持活动",
    security: "资金直接进入您的钱包。非托管。"
  }
};

export default function DonationCreatePage() {
  const [formData, setFormData] = useState({
    title: '', desc: '', organizer: '', email: '', wallet: '', goal: '', coverUrl: ''
  });
  const [previewFile, setPreviewFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('payonce_lang');
    if (saved) setLang(saved);
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

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.wallet || !formData.title) return alert("Title and Wallet are required");

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

      const payload = {
        n: formData.title,
        d: formData.desc,
        sn: formData.organizer,
        se: formData.email,
        w: formData.wallet,
        g: formData.goal ? parseFloat(formData.goal) : null,
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
      alert("Error creating link");
    } finally {
      setUploading(false);
    }
  };

  const inputStyle = "w-full bg-black/40 border border-zinc-800 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all backdrop-blur-sm";

  return (
    <div dir={dir} className={`min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30 ${lang === 'ar' ? 'font-arabic' : ''}`}>
      
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-green-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px]"></div>
      </div>

      <nav className="relative z-50 flex justify-between items-center p-6 max-w-7xl mx-auto">
         <Link href="/create" className="text-zinc-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
         </Link>
         <div className="flex gap-2 text-[10px] font-black uppercase">
            <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
            <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
            <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
         </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
              
              <div className="space-y-8">
                  <div>
                      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 mb-2 italic uppercase tracking-tighter drop-shadow-sm">
                          {t.header}
                      </h1>
                      <p className="text-zinc-500 text-sm font-medium tracking-wide">{t.subHeader}</p>
                  </div>

                  <form onSubmit={handleGenerate} className="space-y-6">
                      <div className="space-y-4">
                          <div>
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">{t.titleLabel}</label>
                              <input required name="title" value={formData.title} onChange={handleChange} className={inputStyle} />
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">{t.descLabel}</label>
                              <textarea name="desc" value={formData.desc} onChange={handleChange} className={`${inputStyle} h-32 resize-none`} />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">{t.organizerLabel}</label>
                              <input name="organizer" value={formData.organizer} onChange={handleChange} className={inputStyle} />
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">{t.emailLabel}</label>
                              <input name="email" value={formData.email} onChange={handleChange} className={inputStyle} />
                          </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-900/10 to-transparent p-1 rounded-2xl border border-green-500/20">
                          <div className="bg-black/80 p-5 rounded-[14px]">
                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{t.goalLabel}</span>
                                  <span className="text-[9px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">{t.optional}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                  <input 
                                      type="number" 
                                      step="any" 
                                      name="goal"
                                      value={formData.goal} 
                                      onChange={handleChange} 
                                      placeholder="10" 
                                      className="flex-1 bg-transparent text-4xl font-black text-white outline-none placeholder:text-zinc-800 tabular-nums"
                                  />
                                  <span className="text-xl font-black text-zinc-600">BCH</span>
                              </div>
                          </div>
                      </div>

                      <div className="space-y-4">
                           <div className="flex gap-2">
                               <input type="file" accept="image/*" onChange={(e)=>setPreviewFile(e.target.files[0])} className="flex-1 text-[10px] text-zinc-400 file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-zinc-800 file:text-white file:font-bold hover:file:bg-zinc-700 cursor-pointer" />
                               <input name="coverUrl" value={formData.coverUrl} onChange={handleChange} placeholder={t.coverLabel} className={`${inputStyle} flex-1 py-2`} />
                           </div>
                           <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">{t.walletLabel}</label>
                                <input required name="wallet" value={formData.wallet} onChange={handleChange} className={`${inputStyle} text-center font-mono text-green-400`} />
                           </div>
                      </div>

                      <button type="submit" disabled={uploading} className="w-full bg-white hover:bg-zinc-200 text-black font-black py-4 rounded-xl text-lg uppercase italic tracking-wider transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]">
                          {uploading ? t.processing : t.launch}
                      </button>
                      
                      <p className="text-center text-[10px] text-zinc-600 font-medium">{t.security}</p>
                  </form>

                  {generatedLink && (
                      <div className="bg-[#121214] border border-green-500/30 p-4 rounded-2xl flex flex-col gap-3 animate-in slide-in-from-bottom-4 shadow-xl">
                          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest text-center">Campaign Ready 🚀</span>
                          <div className="flex items-center gap-2 bg-black/50 p-2 rounded-xl">
                             <input readOnly value={generatedLink} className="flex-1 bg-transparent text-xs text-zinc-300 font-mono outline-none px-2" />
                             <button onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="text-[10px] font-black bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-lg uppercase transition-colors">
                                 {copied ? t.done : t.copy}
                             </button>
                          </div>
                      </div>
                  )}
              </div>

              <div className="hidden lg:block sticky top-8">
                  <div className="flex items-center gap-2 mb-4 justify-end">
                      <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{t.preview}</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="bg-[#0a0a0a] rounded-[32px] overflow-hidden border border-zinc-800/50 shadow-2xl relative">
                       <div className="relative h-72 bg-zinc-900">
                           {(previewFile || formData.coverUrl) ? (
                               <img 
                                 src={previewFile ? URL.createObjectURL(previewFile) : formData.coverUrl} 
                                 className="w-full h-full object-cover" 
                               />
                           ) : (
                               <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-800 font-black italic text-6xl uppercase tracking-tighter">
                                   COVER
                               </div>
                           )}
                           <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                       </div>
                       
                       <div className="p-8 relative -mt-20">
                           <div className="inline-block bg-white text-black text-[10px] font-black px-3 py-1 rounded-full uppercase mb-4 shadow-lg">
                               {t.cardTitle}
                           </div>
                           <h2 className="text-4xl font-black italic uppercase text-white leading-none mb-3 break-words drop-shadow-md">
                               {formData.title || "Campaign Title"}
                           </h2>
                           <p className="text-zinc-400 text-xs font-bold mb-8 flex items-center gap-2">
                               <span className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-[10px]">👤</span>
                               {formData.organizer || "Organizer Name"}
                           </p>
                           
                           <div className="bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                               <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                   <span className="text-white">{t.raised}</span>
                                   <span>{formData.goal || "0"} BCH</span>
                               </div>
                               <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                   <div className="w-1/3 h-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                               </div>
                           </div>

                           <div className="w-full py-4 mt-6 bg-white rounded-xl flex items-center justify-center gap-2 text-black font-black text-sm uppercase italic tracking-wider opacity-50">
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
