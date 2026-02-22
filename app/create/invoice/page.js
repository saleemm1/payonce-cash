'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    retail: "Retail / POS",
    personal: "Freelance",
    digital: "Digital Shop",
    quick: "Quick Bill",
    pInv: "Personal Invoice",
    dInv: "Sell Digital Asset",
    forRetail: "For Restaurants, Cafes & Stores",
    forPersonal: "For Services & Contractors",
    forDigital: "For Files, Codes & Content",
    itemName: "Item Name (e.g. Lunch Combo)",
    invTitle: "Invoice Title",
    customer: "Customer Name (Bill To)",
    ref: "Table # / Order ID / Student ID (Optional)",
    descRetail: "Order details, items list...",
    descInv: "Description, Terms & Conditions...",
    upload: "Upload File",
    secret: "Secret Link/Text",
    paste: "Paste Secure Link or Content",
    coverRetail: "Cover Image (Menu/Shop Logo) - Optional",
    coverDigital: "Cover Preview - Required",
    orUrl: "Or Image URL",
    merchName: "Merchant Name",
    email: "Email",
    total: "Total Amount",
    approx: "APPROX BCH",
    wallet: "Your BCH Wallet Address (bitcoincash:qp...)",
    promo: "Promo Code",
    discount: "Offer a secret discount",
    viral: "Viral Mode 🚀",
    comm: "10% Commission",
    generating: "Creating Bill...",
    genQuick: "Generate Quick Bill ⚡",
    create: "Create Invoice",
    ready: "Payment Link Ready",
    done: "✅",
    copy: "📋",
    supply: "Supply Limit",
    unlimited: "Leave empty for unlimited",
    qty: "Qty:",
    tokenRule: "CashTokens Rule",
    tokenDesc: "Web3 Token-Gated Commerce",
    discountMode: "💸 Discount",
    gatedMode: "🔒 Required",
    tokenId: "Token Category ID",
    tokenName: "Token Name (e.g. VIP)",
    tokenPct: "Discount %",
    verifyExplorer: "Verify ID on Explorer ↗",
    evmWarning: "⚠️ Native CashToken IDs are 64 characters and do not start with 0x."
  },
  ar: {
    retail: "تجزئة / POS",
    personal: "عمل حر",
    digital: "متجر رقمي",
    quick: "فاتورة سريعة",
    pInv: "فاتورة شخصية",
    dInv: "بيع أصل رقمي",
    forRetail: "للمطاعم والمقاهي والمتاجر",
    forPersonal: "للخدمات والمقاولين",
    forDigital: "للملفات والأكواد والمحتوى",
    itemName: "اسم العنصر (مثل: وجبة غداء)",
    invTitle: "عنوان الفاتورة",
    customer: "اسم العميل (المرسل إليه)",
    ref: "رقم الطاولة / الطلب (اختياري)",
    descRetail: "تفاصيل الطلب، القائمة...",
    descInv: "الوصف، الشروط والأحكام...",
    upload: "رفع ملف",
    secret: "رابط/نص سري",
    paste: "الصق الرابط الآمن أو المحتوى",
    coverRetail: "صورة الغلاف (شعار المتجر) - اختياري",
    coverDigital: "معاينة الغلاف - مطلوب",
    orUrl: "أو رابط الصورة",
    merchName: "اسم التاجر",
    email: "البريد الإلكتروني",
    total: "المبلغ الإجمالي",
    approx: "تقريباً BCH",
    wallet: "عنوان محفظة BCH الخاص بك",
    promo: "كود خصم",
    discount: "قدم خصماً سرياً",
    viral: "الوضع الفيروسي 🚀",
    comm: "10% عمولة",
    generating: "جاري إنشاء الفاتورة...",
    genQuick: "إنشاء فاتورة سريعة ⚡",
    create: "إنشاء الفاتورة",
    ready: "رابط الدفع جاهز",
    done: "✅",
    copy: "📋",
    supply: "حد المخزون",
    unlimited: "اتركه فارغاً لعدد لا نهائي",
    qty: "العدد:",
    tokenRule: "قواعد CashTokens",
    tokenDesc: "تجارة مشروطة بالتوكنز Web3",
    discountMode: "💸 خصم",
    gatedMode: "🔒 وصول مشروط",
    tokenId: "معرف التوكن (Category ID)",
    tokenName: "اسم التوكن (مثال: VIP)",
    tokenPct: "نسبة الخصم %",
    verifyExplorer: "تحقق من المعرف على المستكشف ↗",
    evmWarning: "⚠️ معرف CashToken الأصلي يتكون من 64 حرفاً ولا يبدأ بـ 0x."
  },
  zh: {
    retail: "零售 / POS",
    personal: "自由职业",
    digital: "数字商店",
    quick: "快速账单",
    pInv: "个人发票",
    dInv: "出售数字资产",
    forRetail: "适用于餐馆、咖啡馆和商店",
    forPersonal: "适用于服务和承包商",
    forDigital: "适用于文件、代码和内容",
    itemName: "项目名称 (如午餐套餐)",
    invTitle: "发票标题",
    customer: "客户名称 (收票人)",
    ref: "桌号 / 订单 ID (可选)",
    descRetail: "订单详情，物品清单...",
    descInv: "描述，条款和条件...",
    upload: "上传文件",
    secret: "秘密链接/文本",
    paste: "粘贴安全链接或内容",
    coverRetail: "封面图片 (菜单/店铺 Logo) - 可选",
    coverDigital: "封面预览 - 必填",
    orUrl: "或图片链接",
    merchName: "商户名称",
    email: "电子邮件",
    total: "总金额",
    approx: "约合 BCH",
    wallet: "您的 BCH 钱包地址",
    promo: "优惠码",
    discount: "提供秘密折扣",
    viral: "病毒模式 🚀",
    comm: "10% 佣金",
    generating: "创建账单中...",
    genQuick: "生成快速账单 ⚡",
    create: "创建发票",
    ready: "支付链接就绪",
    done: "✅",
    copy: "📋",
    supply: "供应限制",
    unlimited: "留空表示无限",
    qty: "数量:",
    tokenRule: "CashTokens 规则",
    tokenDesc: "Web3 代币门控商业",
    discountMode: "💸 折扣",
    gatedMode: "🔒 必须",
    tokenId: "代币类别 ID",
    tokenName: "代币名称 (例如 VIP)",
    tokenPct: "折扣 %",
    verifyExplorer: "在浏览器中验证 ID ↗",
    evmWarning: "⚠️ 原生 CashToken ID 为 64 个字符，且不以 0x 开头。"
  }
};

export default function InvoiceUploadPage() {
  const [invoiceType, setInvoiceType] = useState('personal'); 
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [orderRef, setOrderRef] = useState(''); 
  const [productDesc, setProductDesc] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [usdPrice, setUsdPrice] = useState(12.50);
  const [wallet, setWallet] = useState('');
  const [bchPreview, setBchPreview] = useState('0.00');
  const [deliveryType, setDeliveryType] = useState('receipt'); 
  const [file, setFile] = useState(null);
  const [linkOrText, setLinkOrText] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [previewLink, setPreviewLink] = useState('');
  const [enableAffiliate, setEnableAffiliate] = useState(false);
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

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('payonce_lang', l);
  };

  const t = translations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (invoiceType === 'personal') {
      setEnableAffiliate(false);
      setDeliveryType('link');
    } else if (invoiceType === 'retail') {
      setEnableAffiliate(false); 
      setDeliveryType('receipt'); 
      setEnableToken(false);
    } else {
      setDeliveryType('file');
    }
  }, [invoiceType]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (invoiceType === 'digital' && !previewLink && !previewFile) {
      return alert("Preview Link or File is required for Digital Products");
    }

    if (enableToken && invoiceType !== 'retail') {
        if (!tokenId) return alert("Please enter the Token Category ID");
        if (tokenId.startsWith('0x')) return alert(t.evmWarning);
        if (!tokenName) return alert("Please enter the Token Name");
        if (tokenMode === 'discount' && !tokenDiscount) return alert("Please enter the discount percentage");
    }
    
    setUploading(true);
    try {
      let assetId = linkOrText;
      let originalFileName = "";

      if (invoiceType === 'retail') {
        assetId = `OFFICIAL RECEIPT\nOrder Ref: ${orderRef || 'N/A'}\nItem: ${productName}\nStatus: PAID ✅\n\nPlease show this screen to the vendor.`;
        originalFileName = "Proof_of_Payment.txt";
      } 
      else if (deliveryType === 'file' && file) {
        originalFileName = file.name;
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await res.json();
        
        if (!json.ipfsHash) throw new Error("Upload Failed");
        assetId = json.ipfsHash;
      }

      let finalPreview = previewLink;
      if (previewFile) {
        const imgData = new FormData();
        imgData.append("file", previewFile);
        const imgRes = await fetch("/api/upload", { method: "POST", body: imgData });
        const imgJson = await imgRes.json();
        finalPreview = `https://gateway.pinata.cloud/ipfs/${imgJson.ipfsHash}`;
      }

      let tkRule = null;
      if (enableToken && invoiceType !== 'retail') {
          tkRule = { 
              type: tokenMode, 
              id: tokenId.trim(),
              name: tokenName.trim()
          };
          if (tokenMode === 'discount') tkRule.discount = tokenDiscount;
      }

      const payload = {
        w: wallet, p: usdPrice, n: productName, sn: sellerName,
        se: sellerEmail, i: assetId, fn: originalFileName, a: enableAffiliate,
        cn: invoiceType === 'personal' ? customerName : (orderRef ? `Ref: ${orderRef}` : ''), 
        d: productDesc, pr: finalPreview, dt: invoiceType === 'retail' ? 'text' : deliveryType, ty: invoiceType,
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
      alert("Error generating invoice");
    } finally {
      setUploading(false);
    }
  };

  const inputBaseStyles = "w-full p-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300 placeholder:text-zinc-600 hover:bg-zinc-900/80 hover:border-zinc-600";

  return (
    <div dir={dir} className={`min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-12 font-sans relative overflow-hidden ${lang === 'ar' ? 'font-arabic' : ''}`}>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-600/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-500/5 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="absolute top-6 right-6 flex gap-2 text-[10px] font-black uppercase z-50">
        <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
        <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
        <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
      </div>

      <form onSubmit={handleGenerate} className="relative z-10 w-full max-w-lg bg-[#18181b]/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/5 shadow-2xl shadow-black/50 space-y-5 transform transition-all hover:border-white/10">
        
        <Link href="/create" className={`absolute top-8 ${lang === 'ar' ? 'left-8' : 'right-8'} text-zinc-600 hover:text-white transition-colors cursor-pointer`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </Link>

        <div className="grid grid-cols-3 gap-2 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
          <button type="button" onClick={() => setInvoiceType('retail')} className={`py-3 text-[9px] font-black uppercase rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${invoiceType === 'retail' ? 'bg-gradient-to-br from-green-600 to-green-500 text-black shadow-lg shadow-green-900/20 scale-105' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}>
            <span className="text-lg">🏪</span> {t.retail}
          </button>
          <button type="button" onClick={() => setInvoiceType('personal')} className={`py-3 text-[9px] font-black uppercase rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${invoiceType === 'personal' ? 'bg-gradient-to-br from-green-600 to-green-500 text-black shadow-lg shadow-green-900/20 scale-105' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}>
            <span className="text-lg">👤</span> {t.personal}
          </button>
          <button type="button" onClick={() => setInvoiceType('digital')} className={`py-3 text-[9px] font-black uppercase rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${invoiceType === 'digital' ? 'bg-gradient-to-br from-green-600 to-green-500 text-black shadow-lg shadow-green-900/20 scale-105' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}>
            <span className="text-lg">📦</span> {t.digital}
          </button>
        </div>

        <div className="text-center mb-2">
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter drop-shadow-sm">
            {invoiceType === 'retail' && <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">{t.quick}</span>}
            {invoiceType === 'personal' && <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">{t.pInv}</span>}
            {invoiceType === 'digital' && <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">{t.dInv}</span>}
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
            {invoiceType === 'retail' && t.forRetail}
            {invoiceType === 'personal' && t.forPersonal}
            {invoiceType === 'digital' && t.forDigital}
          </p>
        </div>
        
        <div className="space-y-3">
          <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className={inputBaseStyles} placeholder={invoiceType === 'retail' ? t.itemName : t.invTitle} />
          
          {invoiceType === 'personal' && (
            <input required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={`${inputBaseStyles} animate-in fade-in slide-in-from-top-1`} placeholder={t.customer} />
          )}

          {invoiceType === 'retail' && (
            <input type="text" value={orderRef} onChange={(e) => setOrderRef(e.target.value)} className={`${inputBaseStyles} animate-in fade-in slide-in-from-top-1`} placeholder={t.ref} />
          )}
        </div>

        <textarea required value={productDesc} onChange={(e) => setProductDesc(e.target.value)} className={`${inputBaseStyles} h-24 resize-none`} placeholder={invoiceType === 'retail' ? t.descRetail : t.descInv}></textarea>

        {invoiceType !== 'retail' && (
          <div className="animate-in fade-in slide-in-from-top-2">
              <div className="flex bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-700/50 gap-2 mb-3 backdrop-blur-sm">
                <button type="button" onClick={() => setDeliveryType('file')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all duration-300 ${deliveryType === 'file' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>{t.upload}</button>
                <button type="button" onClick={() => setDeliveryType('link')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all duration-300 ${deliveryType === 'link' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>{t.secret}</button>
              </div>

              {deliveryType === 'file' ? (
                <div className="bg-zinc-900/30 p-3 rounded-xl border border-dashed border-zinc-700 group hover:border-green-500/50 transition-colors">
                    <input type="file" onChange={(e)=>setFile(e.target.files[0])} className={`w-full text-xs text-zinc-400 file:bg-green-600 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-black ${lang === 'ar' ? 'file:ml-3' : 'file:mr-3'} cursor-pointer hover:file:bg-green-500 file:transition-colors`} />
                </div>
              ) : (
                <input required type="text" value={linkOrText} onChange={(e)=>setLinkOrText(e.target.value)} className={inputBaseStyles} placeholder={t.paste} />
              )}
          </div>
        )}

        {(invoiceType === 'digital' || invoiceType === 'retail') && (
          <div className="p-4 bg-zinc-800/20 rounded-xl border border-white/5 animate-in fade-in space-y-2">
            <label className="text-[9px] text-zinc-400 block uppercase font-black tracking-wider text-center">
              {invoiceType === 'retail' ? t.coverRetail : t.coverDigital}
            </label>
            <div className="flex gap-2 items-center">
              <input type="file" accept="image/*" onChange={(e)=>setPreviewFile(e.target.files[0])} className="w-1/2 text-[10px] text-zinc-500 file:bg-zinc-700 file:text-white file:border-0 file:rounded-lg file:px-2 file:hover:bg-zinc-600 cursor-pointer transition-colors" />
              <input type="url" value={previewLink} onChange={(e)=>setPreviewLink(e.target.value)} placeholder={t.orUrl} className={`${inputBaseStyles} py-2 text-xs`} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <input required type="text" placeholder={t.merchName} onChange={(e)=>setSellerName(e.target.value)} className={inputBaseStyles} />
          <input required type="email" placeholder={t.email} onChange={(e)=>setSellerEmail(e.target.value)} className={inputBaseStyles} />
        </div>

        <div className="relative bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 group">
          <div className={`absolute -top-3 ${lang === 'ar' ? 'right-4' : 'left-4'} bg-[#18181b] px-2 text-[9px] text-green-500 font-black uppercase tracking-widest z-10 border border-zinc-800 rounded-full`}>{t.total}</div>
          <div className="relative flex items-center">
            <span className={`absolute ${lang === 'ar' ? 'right-5' : 'left-5'} text-white font-black text-lg pointer-events-none`}>$</span>
            <input required type="number" step="any" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className={`w-full p-4 ${lang === 'ar' ? 'pr-10' : 'pl-10'} bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 text-2xl font-black transition-all group-hover:border-green-500/50 shadow-inner`} />
            <div className={`absolute ${lang === 'ar' ? 'left-5 text-left' : 'right-5 text-right'} pointer-events-none`}>
               <span className="block text-[10px] text-zinc-500 font-black">{t.approx}</span>
               <span className="block text-sm text-green-500 font-mono font-bold bg-zinc-800 px-2 rounded">{bchPreview}</span>
            </div>
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

        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className={`${inputBaseStyles} text-xs font-mono text-center tracking-tight`} placeholder={t.wallet} />

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

        {invoiceType !== 'retail' && (
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
                                <input type="text" placeholder={t.tokenId} value={tokenId} onChange={(e)=>setTokenId(e.target.value)} className={`flex-1 p-2 bg-black border rounded-lg text-xs text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono tracking-tighter ${tokenId.startsWith('0x') ? 'border-red-500' : 'border-zinc-800'}`} />
                                {tokenMode === 'discount' && (
                                    <input type="number" placeholder={t.tokenPct} min="1" max="100" value={tokenDiscount} onChange={(e)=>setTokenDiscount(e.target.value)} className="w-24 p-2 bg-black border border-zinc-800 rounded-lg text-xs text-white outline-none focus:border-green-500 text-center font-bold" />
                                )}
                            </div>
                            {tokenId.startsWith('0x') && (
                                <p className="text-[9px] text-red-500 font-bold mt-1 bg-red-500/10 p-2 rounded-lg">{t.evmWarning}</p>
                            )}
                            {tokenId.length > 20 && !tokenId.startsWith('0x') && (
                                <a href={`https://explorer.salemkode.com/token/${tokenId}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-zinc-800/50 hover:bg-zinc-800 text-green-500 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all border border-zinc-700 hover:border-green-500/50">
                                    {t.verifyExplorer}
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )}

        {invoiceType === 'digital' && (
           <div className="bg-gradient-to-r from-zinc-900 to-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 flex items-center justify-between hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300 animate-in fade-in">
             <div>
               <h3 className="text-xs font-black uppercase text-white flex items-center gap-1">{t.viral}</h3>
               <p className="text-[9px] text-zinc-400 mt-0.5">{t.comm}</p>
             </div>
             <input type="checkbox" checked={enableAffiliate} onChange={(e) => setEnableAffiliate(e.target.checked)} className="w-5 h-5 accent-green-500 cursor-pointer rounded bg-zinc-700 border-zinc-600 focus:ring-green-500 focus:ring-offset-zinc-900" />
           </div>
        )}

        <button type="submit" disabled={uploading} className="w-full relative overflow-hidden group bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black py-5 rounded-2xl font-black transition-all uppercase italic text-xl shadow-[0_10px_40px_rgba(22,163,74,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95">
          <span className="relative z-10 flex items-center justify-center gap-2 text-white shadow-black drop-shadow-md">
             {uploading ? (
                <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 {t.generating}
                </>
             ) : invoiceType === 'retail' ? t.genQuick : t.create}
          </span>
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
        </button>

        {generatedLink && (
          <div className="mt-4 p-4 bg-black/80 rounded-2xl border border-green-500/30 flex flex-col gap-2 animate-in slide-in-from-bottom-5 shadow-lg shadow-green-900/10">
            <span className="text-[9px] text-green-500 uppercase font-black tracking-widest text-center">{t.ready}</span>
            <div className="flex gap-2">
               <input readOnly value={generatedLink} className="flex-1 bg-zinc-900/50 p-3 text-[10px] rounded-xl border border-zinc-800 outline-none text-zinc-300 font-mono text-center tracking-tight" />
               <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className={`px-4 rounded-xl text-lg font-bold transition-all duration-200 ${copied ? 'bg-green-500 text-white' : 'bg-zinc-800 text-green-500 hover:bg-zinc-700'}`}>
                   {copied ? t.done : t.copy}
               </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
