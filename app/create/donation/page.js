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
    goalLabel: "Funding Goal",
    coverLabel: "Campaign Image URL",
    fileLabel: "Or Upload Image",
    launch: "Launch Campaign",
    processing: "Creating...",
    preview: "Live Preview",
    copy: "Copy Link",
    done: "Copied!",
    goalDesc: "Total needed",
    cardTitle: "Campaign Preview",
    raised: "0.00 BCH Raised",
    support: "Support Campaign",
    security: "Funds go directly to your wallet. Non-custodial.",
    approx: "≈",
    currency: "Currency"
  },
  ar: {
    header: "إنشاء حملة تبرع",
    subHeader: "اجمع التبرعات بقوة البيتكوين كاش.",
    titleLabel: "عنوان الحملة",
    descLabel: "لماذا تجمع التبرعات؟ (القصة)",
    organizerLabel: "اسم المنظم",
    emailLabel: "بريد الدعم",
    walletLabel: "عنوان محفظة BCH الخاصة بك",
    goalLabel: "هدف التمويل",
    coverLabel: "رابط صورة الحملة",
    fileLabel: "أو رفع صورة",
    launch: "إطلاق الحملة",
    processing: "جاري الإنشاء...",
    preview: "معاينة حية",
    copy: "نسخ الرابط",
    done: "تم النسخ!",
    goalDesc: "المبلغ المطلوب",
    cardTitle: "معاينة الحملة",
    raised: "تم جمع 0.00 BCH",
    support: "ادعم الحملة",
    security: "الأموال تصل لمحفظتك مباشرة. غير وصائي.",
    approx: "تقريباً",
    currency: "العملة"
  },
  zh: {
    header: "创建捐赠活动",
    subHeader: "利用 Bitcoin Cash 的力量筹集资金。",
    titleLabel: "活动标题",
    descLabel: "您为什么要筹集资金？",
    organizerLabel: "组织者姓名",
    emailLabel: "支持邮箱",
    walletLabel: "您的 BCH 钱包地址",
    goalLabel: "筹款目标",
    coverLabel: "活动图片链接",
    fileLabel: "或上传图片",
    launch: "发起活动",
    processing: "正在创建...",
    preview: "实时预览",
    copy: "复制链接",
    done: "已复制！",
    goalDesc: "所需总额",
    cardTitle: "活动预览",
    raised: "已筹集 0.00 BCH",
    support: "支持活动",
    security: "资金直接进入您的钱包。非托管。",
    approx: "约",
    currency: "货币"
  }
};

export default function DonationCreatePage() {
  const [formData, setFormData] = useState({
    title: '', desc: '', organizer: '', email: '', wallet: '', goal: '', coverUrl: ''
  });
  const [inputGoal, setInputGoal] = useState('');
  const [isUsdMode, setIsUsdMode] = useState(true);
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

  const handleGoalChange = (e) => {
      const val = e.target.value;
      setInputGoal(val);
      if (!val) {
          setFormData(prev => ({ ...prev, goal: '' }));
          return;
      }
      
      if (isUsdMode && bchPrice > 0) {
          const bchVal = parseFloat(val) / bchPrice;
          setFormData(prev => ({ ...prev, goal: bchVal.toFixed(8) }));
      } else {
          setFormData(prev => ({ ...prev, goal: val }));
      }
  };

  const toggleCurrency = () => {
      setIsUsdMode(!isUsdMode);
      setInputGoal('');
      setFormData(prev => ({ ...prev, goal: '' }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.wallet || !formData.title || !formData.goal) return alert("Title, Wallet and Goal are required");

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
        g: parseFloat(formData.goal),
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

                      <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800 space-y-3">
                          <div className="flex justify-between items-center">
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t.goalLabel}</p>
                              <button type="button" onClick={toggleCurrency} className="text-[10px] font-black uppercase bg-zinc-800 px-2 py-1 rounded text-green-500 hover:bg-zinc-700 transition-colors">
                                  {isUsdMode ? 'Input: USD ($)' : 'Input: BCH'}
                              </button>
                          </div>
                          
                          <div className="flex items-center gap-3">
                              <input 
                                  required
                                  type="number" 
                                  step="any" 
                                  value={inputGoal} 
                                  onChange={handleGoalChange} 
                                  placeholder="0.00" 
                                  className="flex-1 bg-transparent text-3xl font-black text-white outline-none placeholder:text-zinc-700 tabular-nums"
                              />
                              <span className="text-xl font-black text-zinc-500">{isUsdMode ? 'USD' : 'BCH'}</span>
                          </div>
                          
                          {formData.goal && bchPrice > 0 && (
                              <p className="text-xs text-green-500 font-mono text-right animate-pulse">
                                  {isUsdMode 
                                      ? `${t.approx} ${parseFloat(formData.goal).toFixed(4)} BCH` 
                                      : `${t.approx} $${(parseFloat(formData.goal) * bchPrice).toLocaleString()} USD`
                                  }
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
                      
                      <p className="text-center text-[10px] text-zinc-600 font-medium">{t.security}</p>
                  </form>

                  {generatedLink && (
                      <div className="bg-black border border-green-500/30 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
                          <input readOnly value={generatedLink} className="flex-1 bg-transparent text-xs text-green-500 font-mono outline-none" />
                          <button onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="text-[10px] font-black bg-green-500/10 hover:bg-green-500/20 text-green-500 px-3 py-1.5 rounded-lg uppercase transition-colors">
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
                               <span>{formData.goal ? parseFloat(formData.goal).toFixed(4) : "0"} BCH</span>
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
