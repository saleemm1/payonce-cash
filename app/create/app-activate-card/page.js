'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    title: "App Activation Key",
    appName: "App/Software Name",
    textCode: "Text Code",
    licenseFile: "License File",
    uploadLabel: "Upload License/Key File",
    pasteKeys: "Paste activation keys here...",
    iconLabel: "App Icon/Preview (File or URL) (Optional)",
    orUrl: "Or Icon URL",
    devName: "Dev Name",
    email: "Support Email",
    rate: "BCH Rate:",
    wallet: "BCH Wallet Address",
    promo: "Promo Code",
    discount: "Offer a secret discount",
    viral: "Viral Mode",
    rec: "Recommended",
    comm: "10% promoter commission",
    generate: "Generate License Link",
    processing: "Processing...",
    copy: "Copy",
    done: "✅",
    supply: "Supply Limit",
    unlimited: "Leave empty for unlimited",
    qty: "Qty:",
    tokenRule: "CashTokens Rule",
    tokenDesc: "Web3 Token-Gated Commerce",
    discountMode: "💸 Discount",
    gatedMode: "🔒 Required",
    tokenId: "Token Category ID",
    tokenName: "Token Name (e.g. GURU)",
    tokenPct: "Discount %"
  },
  ar: {
    title: "مفتاح تفعيل التطبيق",
    appName: "اسم التطبيق/البرنامج",
    textCode: "كود نصي",
    licenseFile: "ملف رخصة",
    uploadLabel: "رفع ملف الرخصة/المفتاح",
    pasteKeys: "الصق مفاتيح التفعيل هنا...",
    iconLabel: "أيقونة التطبيق/معاينة (ملف أو رابط) (اختياري)",
    orUrl: "أو رابط الأيقونة",
    devName: "اسم المطور",
    email: "بريد الدعم",
    rate: "سعر BCH:",
    wallet: "عنوان محفظة BCH",
    promo: "كود خصم",
    discount: "قدم خصماً سرياً",
    viral: "الوضع الفيروسي",
    rec: "موصى به",
    comm: "10% عمولة للمسوق",
    generate: "إنشاء رابط الرخصة",
    processing: "جاري المعالجة...",
    copy: "نسخ",
    done: "✅",
    supply: "حد المخزون",
    unlimited: "اتركه فارغاً لعدد لا نهائي",
    qty: "العدد:",
    tokenRule: "قواعد CashTokens",
    tokenDesc: "تجارة مشروطة بالتوكنز Web3",
    discountMode: "💸 خصم",
    gatedMode: "🔒 وصول مشروط",
    tokenId: "معرف التوكن (Category ID)",
    tokenName: "اسم التوكن (مثال: GURU)",
    tokenPct: "نسبة الخصم %"
  },
  zh: {
    title: "应用激活密钥",
    appName: "应用/软件名称",
    textCode: "文本代码",
    licenseFile: "许可文件",
    uploadLabel: "上传许可/密钥文件",
    pasteKeys: "在此粘贴激活密钥...",
    iconLabel: "应用图标/预览 (文件或链接) (可选)",
    orUrl: "或图标链接",
    devName: "开发者名称",
    email: "支持邮箱",
    rate: "BCH 汇率:",
    wallet: "BCH 钱包地址",
    promo: "优惠码",
    discount: "提供秘密折扣",
    viral: "病毒模式",
    rec: "推荐",
    comm: "10% 推广佣金",
    generate: "生成许可链接",
    processing: "处理中...",
    copy: "复制",
    done: "✅",
    supply: "供应限制",
    unlimited: "留空表示无限",
    qty: "数量:",
    tokenRule: "CashTokens 规则",
    tokenDesc: "Web3 代币门控商业",
    discountMode: "💸 折扣",
    gatedMode: "🔒 必须",
    tokenId: "代币类别 ID",
    tokenName: "代币名称 (例如 GURU)",
    tokenPct: "折扣 %"
  }
};

export default function AppLicensePage() {
  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [usdPrice, setUsdPrice] = useState(99.99);
  const [wallet, setWallet] = useState('');
  const [bchPreview, setBchPreview] = useState('0.00');
  const [deliveryType, setDeliveryType] = useState('code');
  const [textCode, setTextCode] = useState('');
  const [file, setFile] = useState(null);
  const [enableAffiliate, setEnableAffiliate] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [enablePromo, setEnablePromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('');
  const [maxSupply, setMaxSupply] = useState('');
  
  const [enableToken, setEnableToken] = useState(false);
  const [tokenMode, setTokenMode] = useState('discount');
  const [tokenId, setTokenId] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenDiscount, setTokenDiscount] = useState('');

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

  const t = translations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    let fileToUpload = file;
    if (deliveryType === 'code') {
      if (!textCode) return alert("Please enter the keys");
      fileToUpload = new File([textCode], "license_keys.txt", { type: "text/plain" });
    } else if (!file) {
      return alert("Please upload the license file");
    }

    if (enableToken) {
        if (!tokenId) return alert("Please enter the Token Category ID");
        if (!tokenName) return alert("Please enter the Token Name");
        if (tokenMode === 'discount' && !tokenDiscount) return alert("Please enter the discount percentage");
    }

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

      const formData = new FormData();
      formData.append("file", fileToUpload);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      
      if (!json.ipfsHash) throw new Error("Upload Failed");

      let tkRule = null;
      if (enableToken) {
          tkRule = { 
              type: tokenMode, 
              id: tokenId.trim(),
              name: tokenName.trim()
          };
          if (tokenMode === 'discount') tkRule.discount = tokenDiscount;
      }

      const payload = {
        w: wallet,
        p: usdPrice,
        n: productName,
        fn: fileToUpload.name,
        sn: sellerName,
        se: sellerEmail,
        pr: finalPreview,
        i: json.ipfsHash,
        a: enableAffiliate,
        dt: 'file',
        l: maxSupply ? parseInt(maxSupply) : null,
        pc: enablePromo && promoCode && promoDiscount ? { code: promoCode.toUpperCase(), discount: promoDiscount } : null,
        tk: tkRule
      };

      const jsonRes = await fetch('/api/upload-json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });
      const jsonHashData = await jsonRes.json();
      if (!jsonHashData.cid) throw new Error("JSON Upload Failed");

      const link = `${window.location.origin}/unlock?cid=${jsonHashData.cid}`;
      setGeneratedLink(link);
      
      const history = JSON.parse(localStorage.getItem('payonce_history') || '[]');
      history.push({ title: productName, price: usdPrice + ' USD', url: link });
      localStorage.setItem('payonce_history', JSON.stringify(history));

    } catch (err) {
      alert("Error: Processing Failed");
    } finally {
      setUploading(false);
    }
  };

  const inputBaseStyles = "w-full p-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300 placeholder:text-zinc-600 hover:bg-zinc-900/80 hover:border-zinc-600";

  return (
    <div dir={dir} className={`min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-12 font-sans relative overflow-hidden ${lang === 'ar' ? 'font-arabic' : ''}`}>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-600/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-500/5 rounded-full blur-[128px] pointer-events-none"></div>

      <form onSubmit={handleGenerate} className="relative z-10 w-full max-w-lg bg-[#18181b]/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/5 shadow-2xl shadow-black/50 space-y-6 transform transition-all hover:border-white/10">
        
        <Link href="/create" className={`absolute top-8 ${lang === 'ar' ? 'left-8' : 'right-8'} text-zinc-600 hover:text-white transition-colors cursor-pointer z-20`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </Link>

        <div className="text-center space-y-1">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 uppercase italic tracking-tighter drop-shadow-sm">{t.title}</h1>
            <div className="h-1 w-20 bg-green-500/50 rounded-full mx-auto"></div>
        </div>

        <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className={inputBaseStyles} placeholder={t.appName} />
        
        <div className="flex bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-700/50 gap-2 backdrop-blur-sm">
          <button type="button" onClick={() => setDeliveryType('code')} className={`flex-1 py-3 text-[11px] font-black uppercase italic rounded-lg transition-all duration-300 ${deliveryType === 'code' ? 'bg-gradient-to-br from-green-600 to-green-500 text-white shadow-lg shadow-green-900/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>{t.textCode}</button>
          <button type="button" onClick={() => setDeliveryType('file')} className={`flex-1 py-3 text-[11px] font-black uppercase italic rounded-lg transition-all duration-300 ${deliveryType === 'file' ? 'bg-gradient-to-br from-green-600 to-green-500 text-white shadow-lg shadow-green-900/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>{t.licenseFile}</button>
        </div>

        {deliveryType === 'file' ? (
          <div className="bg-zinc-900/30 p-4 rounded-xl border border-dashed border-zinc-700 group hover:border-green-500/50 transition-colors duration-300">
            <label className="text-[11px] text-zinc-400 mb-2 block uppercase font-bold tracking-wider text-center group-hover:text-green-400 transition-colors">{t.uploadLabel}</label>
            <input required type="file" onChange={(e)=>setFile(e.target.files[0])} className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-green-600 file:text-white hover:file:bg-green-500 file:transition-colors cursor-pointer" />
          </div>
        ) : (
          <textarea required value={textCode} onChange={(e)=>setTextCode(e.target.value)} placeholder={t.pasteKeys} className={`${inputBaseStyles} h-32 resize-none`}></textarea>
        )}

        <div className="p-4 bg-zinc-800/20 rounded-xl border border-white/5 space-y-3">
          <label className="text-[10px] text-zinc-400 block uppercase text-center font-black tracking-widest opacity-70">{t.iconLabel}</label>
          <input type="file" accept="image/*" onChange={(e)=>setPreviewFile(e.target.files[0])} className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-zinc-700 file:text-white file:hover:bg-zinc-600 cursor-pointer transition-all" />
          <div className="relative">
              <div className={`absolute inset-y-0 ${lang === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}><span className="text-zinc-500 text-xs">🔗</span></div>
              <input type="url" placeholder={t.orUrl} value={previewLink} onChange={(e)=>setPreviewLink(e.target.value)} className={`${inputBaseStyles} ${lang === 'ar' ? 'pr-8' : 'pl-8'} py-2 text-xs`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input required type="text" placeholder={t.devName} onChange={(e)=>setSellerName(e.target.value)} className={inputBaseStyles} />
          <input required type="email" placeholder={t.email} onChange={(e)=>setSellerEmail(e.target.value)} className={inputBaseStyles} />
        </div>

        <div className="relative bg-zinc-900/40 p-4 rounded-xl border border-zinc-800">
          <label className="text-[10px] text-green-400/80 mb-2 block italic font-bold text-center tracking-wide">
              {t.rate} <span className="text-white bg-zinc-800 px-1.5 py-0.5 rounded ml-1">{bchPreview}</span>
          </label>
          <div className="relative flex items-center group">
            <span className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} text-green-500 font-black text-lg pointer-events-none group-hover:scale-110 transition-transform`}>USD</span>
            <input required type="number" step="any" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className={`w-full p-4 ${lang === 'ar' ? 'pr-16' : 'pl-16'} bg-zinc-900 border border-zinc-700 rounded-xl text-white text-2xl outline-none focus:border-green-500 text-center font-black transition-all shadow-inner`} />
          </div>
        </div>

        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div>
                <h3 className="text-sm font-bold uppercase italic text-white">{t.supply}</h3>
                <p className="text-[10px] text-zinc-500">{t.unlimited}</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-500">{t.qty}</span>
                <input 
                    type="number" 
                    min="1" 
                    placeholder="∞" 
                    value={maxSupply} 
                    onChange={(e) => setMaxSupply(e.target.value)} 
                    className="w-16 p-2 bg-black border border-zinc-700 rounded-lg text-center text-white outline-none focus:border-green-500 font-bold"
                />
            </div>
        </div>
        
        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className={inputBaseStyles} placeholder={t.wallet} />
        
        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-4 rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 transition-colors flex flex-col gap-3 group">
            <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-sm font-bold uppercase italic text-white flex items-center gap-2">{t.promo} {enablePromo && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}</h3>
                   <p className="text-[9px] text-zinc-500 group-hover:text-zinc-400 transition-colors">{t.discount}</p>
                </div>
                <div className={`relative inline-block w-10 ${lang === 'ar' ? 'ml-2' : 'mr-2'} align-middle select-none transition duration-200 ease-in`}>
                    <input type="checkbox" checked={enablePromo} onChange={(e) => setEnablePromo(e.target.checked)} className={`toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer ${lang === 'ar' ? 'checked:left-0 left-5' : 'checked:right-0 right-5'} checked:border-green-500 border-zinc-600 transition-all duration-300`}/>
                    <label className="toggle-label block overflow-hidden h-5 rounded-full bg-zinc-700 cursor-pointer"></label>
                </div>
            </div>
            {enablePromo && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <input type="text" maxLength={5} placeholder="CODE" value={promoCode} onChange={(e)=>setPromoCode(e.target.value.toUpperCase())} className="flex-1 p-2 bg-black/50 border border-zinc-700 rounded-lg text-xs text-white uppercase outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 tracking-widest font-bold" />
                    <input type="number" placeholder="%" min="1" max="100" value={promoDiscount} onChange={(e)=>setPromoDiscount(e.target.value)} className="w-20 p-2 bg-black/50 border border-zinc-700 rounded-lg text-xs text-white outline-none focus:border-green-500 text-center font-bold" />
                </div>
            )}
        </div>

        <div className={`bg-gradient-to-br from-[#0c1610] to-[#09090b] p-4 rounded-xl border border-dashed transition-all duration-300 ${enableToken ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-zinc-700 hover:border-green-900/50'}`}>
            <div className="flex items-center justify-between mb-2">
                <div>
                   <h3 className="text-sm font-bold uppercase italic text-white flex items-center gap-2">
                       {t.tokenRule} 
                       {enableToken && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]"></span>}
                   </h3>
                   <p className="text-[9px] text-green-500/70">{t.tokenDesc}</p>
                </div>
                <div className={`relative inline-block w-10 ${lang === 'ar' ? 'ml-2' : 'mr-2'} align-middle select-none transition duration-200 ease-in`}>
                    <input type="checkbox" checked={enableToken} onChange={(e) => setEnableToken(e.target.checked)} className={`toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer ${lang === 'ar' ? 'checked:left-0 left-5' : 'checked:right-0 right-5'} checked:border-green-500 border-zinc-600 transition-all duration-300`}/>
                    <label className="toggle-label block overflow-hidden h-5 rounded-full bg-zinc-700 cursor-pointer"></label>
                </div>
            </div>
            
            {enableToken && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3 mt-3 border-t border-green-900/30 pt-3">
                    <div className="flex bg-black/50 p-1 rounded-lg border border-green-900/50 gap-1">
                        <button type="button" onClick={() => setTokenMode('discount')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-md transition-all duration-300 ${tokenMode === 'discount' ? 'bg-green-600 text-black shadow-md' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>{t.discountMode}</button>
                        <button type="button" onClick={() => setTokenMode('gated')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-md transition-all duration-300 ${tokenMode === 'gated' ? 'bg-green-600 text-black shadow-md' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>{t.gatedMode}</button>
                    </div>

                    <div className="space-y-2">
                        <input type="text" placeholder={t.tokenName} value={tokenName} onChange={(e)=>setTokenName(e.target.value)} className="w-full p-2 bg-black border border-zinc-800 rounded-lg text-xs text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                        <div className="flex gap-2">
                            <input type="text" placeholder={t.tokenId} value={tokenId} onChange={(e)=>setTokenId(e.target.value)} className="flex-1 p-2 bg-black border border-zinc-800 rounded-lg text-xs text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono tracking-tighter" />
                            {tokenMode === 'discount' && (
                                <input type="number" placeholder={t.tokenPct} min="1" max="100" value={tokenDiscount} onChange={(e)=>setTokenDiscount(e.target.value)} className="w-24 p-2 bg-black border border-zinc-800 rounded-lg text-xs text-white outline-none focus:border-green-500 text-center font-bold" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 flex items-center justify-between hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300">
          <div>
            <h3 className="text-sm font-bold uppercase italic text-white group flex items-center gap-1">{t.viral} <span className="text-[10px] bg-green-600/20 text-green-400 px-1.5 rounded ml-2 not-italic">{t.rec}</span></h3>
            <p className="text-[10px] text-zinc-400 leading-tight mt-1">{t.comm}</p>
          </div>
          <input type="checkbox" checked={enableAffiliate} onChange={(e) => setEnableAffiliate(e.target.checked)} className="w-5 h-5 accent-green-500 cursor-pointer rounded bg-zinc-700 border-zinc-600 focus:ring-green-500 focus:ring-offset-zinc-900" />
        </div>

        <button type="submit" disabled={uploading} className="w-full relative overflow-hidden group bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 py-4 rounded-xl font-black transition-all uppercase italic text-lg shadow-xl shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]">
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
