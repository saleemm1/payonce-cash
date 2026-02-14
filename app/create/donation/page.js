'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    title: "Create Donation Campaign",
    campTitle: "Campaign Title",
    descLabel: "Campaign Story / Description",
    organizer: "Organizer Name",
    email: "Support Email",
    coverLabel: "Campaign Banner (File or URL)",
    orUrl: "Or Image URL",
    rate: "BCH Rate:",
    wallet: "BCH Wallet Address",
    goal: "Funding Goal (BCH)",
    goalDesc: "Target amount to raise",
    suggested: "Suggested Donation ($)",
    viral: "Viral Mode",
    rec: "Recommended",
    comm: "10% reward for promoters",
    generate: "Launch Campaign",
    processing: "Creating Campaign...",
    copy: "Copy",
    done: "✅",
    optional: "Optional"
  },
  ar: {
    title: "إنشاء حملة تبرع",
    campTitle: "عنوان الحملة",
    descLabel: "قصة الحملة / الوصف",
    organizer: "اسم المنظم",
    email: "بريد الدعم",
    coverLabel: "بنر الحملة (ملف أو رابط)",
    orUrl: "أو رابط الصورة",
    rate: "سعر BCH:",
    wallet: "عنوان محفظة BCH",
    goal: "هدف التمويل (BCH)",
    goalDesc: "المبلغ المستهدف جمعه",
    suggested: "تبرع مقترح ($)",
    viral: "الوضع الفيروسي",
    rec: "موصى به",
    comm: "10% مكافأة للمسوقين",
    generate: "إطلاق الحملة",
    processing: "جاري إنشاء الحملة...",
    copy: "نسخ",
    done: "✅",
    optional: "اختياري"
  },
  zh: {
    title: "创建捐赠活动",
    campTitle: "活动标题",
    descLabel: "活动故事 / 描述",
    organizer: "组织者姓名",
    email: "支持邮箱",
    coverLabel: "活动横幅 (文件或链接)",
    orUrl: "或图片链接",
    rate: "BCH 汇率:",
    wallet: "BCH 钱包地址",
    goal: "筹款目标 (BCH)",
    goalDesc: "目标筹集金额",
    suggested: "建议捐款 ($)",
    viral: "病毒模式",
    rec: "推荐",
    comm: "10% 推广奖励",
    generate: "发起活动",
    processing: "正在创建活动...",
    copy: "复制",
    done: "✅",
    optional: "可选"
  }
};

export default function DonationUploadPage() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [usdPrice, setUsdPrice] = useState(10.0);
  const [fundingGoal, setFundingGoal] = useState('');
  const [wallet, setWallet] = useState('');
  const [bchPreview, setBchPreview] = useState('0.00');
  const [enableAffiliate, setEnableAffiliate] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('payonce_lang');
    if (savedLang) setLang(savedLang);

    const getBCH = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
        const data = await res.json();
        const price = parseFloat(usdPrice);
        if (!isNaN(price) && price > 0) {
          setBchPreview((price / data['bitcoin-cash'].usd).toFixed(8));
        }
      } catch (e) {}
    };
    getBCH();
  }, [usdPrice]);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('payonce_lang', l);
  };

  const t = translations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!wallet) return alert("Please enter wallet address");

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
        w: wallet,
        p: usdPrice,
        n: productName,
        d: description,
        sn: sellerName,
        se: sellerEmail,
        pr: finalPreview,
        i: 'donation', 
        fn: 'Donation Receipt',
        a: enableAffiliate,
        dt: 'link', 
        g: fundingGoal ? parseFloat(fundingGoal) : null,
      };

      const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      const link = `${window.location.origin}/unlock?id=${encodedId}`;
      setGeneratedLink(link);
      
      const history = JSON.parse(localStorage.getItem('payonce_history') || '[]');
      history.push({ title: productName, price: 'DONATION', url: link });
      localStorage.setItem('payonce_history', JSON.stringify(history));

    } catch (err) {
      alert("Error processing campaign");
    } finally {
      setUploading(false);
    }
  };

  const inputBaseStyles = "w-full p-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300 placeholder:text-zinc-600 hover:bg-zinc-900/80 hover:border-zinc-600";

  return (
    <div dir={dir} className={`min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-12 font-sans relative overflow-hidden ${lang === 'ar' ? 'font-arabic' : ''}`}>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-500/5 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="absolute top-6 right-6 flex gap-2 text-[10px] font-black uppercase z-50">
        <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
        <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
        <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
      </div>

      <form onSubmit={handleGenerate} className="relative z-10 w-full max-w-lg bg-[#18181b]/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/5 shadow-2xl shadow-black/50 space-y-6 transform transition-all hover:border-white/10">
        
        <Link href="/create" className={`absolute top-8 ${lang === 'ar' ? 'left-8' : 'right-8'} text-zinc-600 hover:text-white transition-colors cursor-pointer z-20`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </Link>

        <div className="text-center space-y-1">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500 uppercase italic tracking-tighter drop-shadow-sm">{t.title}</h1>
            <div className="h-1 w-20 bg-blue-500/50 rounded-full mx-auto"></div>
        </div>

        <div className="space-y-3">
             <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className={inputBaseStyles} placeholder={t.campTitle} />
             <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputBaseStyles} h-24 resize-none`} placeholder={t.descLabel}></textarea>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input required type="text" placeholder={t.organizer} onChange={(e)=>setSellerName(e.target.value)} className={inputBaseStyles} />
          <input required type="email" placeholder={t.email} onChange={(e)=>setSellerEmail(e.target.value)} className={inputBaseStyles} />
        </div>

        <div className="p-4 bg-zinc-800/20 rounded-xl border border-white/5 space-y-3">
          <label className="text-[10px] text-zinc-400 block uppercase text-center font-black tracking-widest opacity-70">{t.coverLabel}</label>
          <input type="file" accept="image/*" onChange={(e)=>setPreviewFile(e.target.files[0])} className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-zinc-700 file:text-white file:hover:bg-zinc-600 cursor-pointer transition-all" />
          <div className="relative">
              <div className={`absolute inset-y-0 ${lang === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}><span className="text-zinc-500 text-xs">🔗</span></div>
              <input type="url" placeholder={t.orUrl} value={previewLink} onChange={(e)=>setPreviewLink(e.target.value)} className={`${inputBaseStyles} ${lang === 'ar' ? 'pr-8' : 'pl-8'} py-2 text-xs`} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/30 to-zinc-900/50 p-4 rounded-xl border border-blue-500/30 flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-bold uppercase italic text-white flex items-center gap-2">
                         {t.goal} <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    </h3>
                    <p className="text-[9px] text-zinc-400">{t.goalDesc}</p>
                </div>
                <input 
                    type="number" 
                    step="any" 
                    placeholder="10 BCH" 
                    value={fundingGoal} 
                    onChange={(e) => setFundingGoal(e.target.value)} 
                    className="w-24 p-2 bg-black border border-zinc-700 rounded-lg text-center text-white outline-none focus:border-blue-500 font-bold"
                />
            </div>
        </div>

        <div className="relative bg-zinc-900/40 p-4 rounded-xl border border-zinc-800">
          <label className="text-[10px] text-green-400/80 mb-2 block italic font-bold text-center tracking-wide">
             {t.suggested} ({t.optional})
          </label>
          <div className="relative flex items-center group">
            <span className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} text-green-500 font-black text-lg pointer-events-none group-hover:scale-110 transition-transform`}>USD</span>
            <input type="number" step="any" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className={`w-full p-4 ${lang === 'ar' ? 'pr-16' : 'pl-16'} bg-zinc-900 border border-zinc-700 rounded-xl text-white text-2xl outline-none focus:border-green-500 text-center font-black transition-all shadow-inner`} />
          </div>
           <div className="text-center mt-2 text-[10px] text-zinc-500 font-mono">
              ≈ {bchPreview} BCH
           </div>
        </div>

        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className={inputBaseStyles} placeholder={t.wallet} />
        
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 flex items-center justify-between hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300">
          <div>
            <h3 className="text-sm font-bold uppercase italic text-white group flex items-center gap-1">{t.viral} <span className="text-[10px] bg-green-600/20 text-green-400 px-1.5 rounded ml-2 not-italic">{t.rec}</span></h3>
            <p className="text-[10px] text-zinc-400 leading-tight mt-1">{t.comm}</p>
          </div>
          <input type="checkbox" checked={enableAffiliate} onChange={(e) => setEnableAffiliate(e.target.checked)} className="w-5 h-5 accent-green-500 cursor-pointer rounded bg-zinc-700 border-zinc-600 focus:ring-green-500 focus:ring-offset-zinc-900" />
        </div>

        <button type="submit" disabled={uploading} className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400 py-4 rounded-xl font-black transition-all uppercase italic text-lg shadow-xl shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]">
          <span className="relative z-10 flex items-center justify-center gap-2">
            {uploading ? (
                <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {t.processing}
                </>
            ) : t.generate}
          </span>
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
        </button>

        {generatedLink && (
          <div className="mt-4 p-4 bg-black/80 rounded-xl border border-green-500/30 flex gap-3 animate-in fade-in slide-in-from-bottom-2 shadow-lg shadow-green-900/10">
            <input readOnly value={generatedLink} className="flex-1 bg-zinc-900/50 p-2 text-[10px] rounded border border-zinc-800 outline-none text-zinc-300 font-mono tracking-tight" />
            <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className={`px-4 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${copied ? 'bg-green-500 text-white' : 'bg-zinc-800 text-green-500 hover:bg-zinc-700'}`}>
                {copied ? t.done : t.copy}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
