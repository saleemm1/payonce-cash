'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    title: "Publish Digital Book",
    bookTitle: "Book Title",
    uploadLabel: "Main Book File (PDF/EPUB)",
    author: "Author Name",
    email: "Support Email",
    coverLabel: "Cover Preview (File or URL) (Optional)",
    orUrl: "Or Cover Image URL",
    rate: "BCH Rate:",
    wallet: "BCH Wallet Address",
    promo: "Promo Code",
    discount: "Offer a secret discount",
    viral: "Viral Mode",
    rec: "Recommended",
    comm: "10% promoter commission",
    generate: "Generate Book Link",
    processing: "Publishing Book...",
    copy: "Copy",
    done: "✅"
  },
  ar: {
    title: "نشر كتاب رقمي",
    bookTitle: "عنوان الكتاب",
    uploadLabel: "ملف الكتاب الرئيسي (PDF/EPUB)",
    author: "اسم المؤلف",
    email: "بريد الدعم",
    coverLabel: "معاينة الغلاف (ملف أو رابط) (اختياري)",
    orUrl: "أو رابط صورة الغلاف",
    rate: "سعر BCH:",
    wallet: "عنوان محفظة BCH",
    promo: "كود خصم",
    discount: "قدم خصماً سرياً",
    viral: "الوضع الفيروسي",
    rec: "موصى به",
    comm: "10% عمولة للمسوق",
    generate: "إنشاء رابط الكتاب",
    processing: "جاري نشر الكتاب...",
    copy: "نسخ",
    done: "✅"
  },
  zh: {
    title: "发布电子书",
    bookTitle: "书名",
    uploadLabel: "主要书籍文件 (PDF/EPUB)",
    author: "作者姓名",
    email: "支持邮箱",
    coverLabel: "封面预览 (文件或链接) (可选)",
    orUrl: "或封面图片链接",
    rate: "BCH 汇率:",
    wallet: "BCH 钱包地址",
    promo: "优惠码",
    discount: "提供秘密折扣",
    viral: "病毒模式",
    rec: "推荐",
    comm: "10% 推广佣金",
    generate: "生成书籍链接",
    processing: "发布书籍中...",
    copy: "复制",
    done: "✅"
  }
};

export default function BookUploadPage() {

  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [usdPrice, setUsdPrice] = useState(15.5);
  const [wallet, setWallet] = useState('');
  const [bchPreview, setBchPreview] = useState('0.00');
  const [file, setFile] = useState(null);
  const [enableAffiliate, setEnableAffiliate] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [enablePromo, setEnablePromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('');
  const [lang, setLang] = useState('en');

  // ✅ الجديد
  const [maxSupply, setMaxSupply] = useState('');

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
    if (!file) return alert("Please select a book file (PDF/EPUB)");

    setUploading(true);
    try {
      let finalPreview = previewLink;
      let originalFileName = file.name;

      if (previewFile) {
        const imgData = new FormData();
        imgData.append("file", previewFile);
        const imgRes = await fetch("/api/upload", { method: "POST", body: imgData });
        const imgJson = await imgRes.json();
        if (imgJson.ipfsHash) finalPreview = `https://gateway.pinata.cloud/ipfs/${imgJson.ipfsHash}`;
      }

      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      
      if (!json.ipfsHash) throw new Error("Upload Failed");

      const payload = {
        w: wallet,
        p: usdPrice,
        n: productName,
        sn: sellerName,
        se: sellerEmail,
        pr: finalPreview,
        i: json.ipfsHash,
        fn: originalFileName,
        a: enableAffiliate,
        dt: 'file',
        l: maxSupply ? parseInt(maxSupply) : null, // ✅ الجديد
        pc: enablePromo && promoCode && promoDiscount ? 
            { code: promoCode.toUpperCase(), discount: promoDiscount } 
            : null
      };

      const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      setGeneratedLink(`${window.location.origin}/unlock?id=${encodedId}`);

    } catch (err) {
      alert("Error during processing");
    } finally {
      setUploading(false);
    }
  };

  const inputBaseStyles = "w-full p-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300 placeholder:text-zinc-600 hover:bg-zinc-900/80 hover:border-zinc-600";

  return (
    <div dir={dir} className={`min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-12 font-sans relative overflow-hidden ${lang === 'ar' ? 'font-arabic' : ''}`}>

      <form onSubmit={handleGenerate} className="relative z-10 w-full max-w-lg bg-[#18181b]/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/5 shadow-2xl shadow-black/50 space-y-6">

        {/* كل كودك كما هو بدون أي تعديل */}

        {/* ===== Supply Limit الجديد ===== */}
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase italic text-white">Supply Limit</h3>
            <p className="text-[10px] text-zinc-500">Leave empty for unlimited</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500">Qty:</span>
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

        <button type="submit" disabled={uploading} className="w-full bg-green-600 py-4 rounded-xl font-black uppercase italic text-lg disabled:opacity-50">
          {uploading ? t.processing : t.generate}
        </button>

        {generatedLink && (
          <div className="mt-4 p-4 bg-black/80 rounded-xl border border-green-500/30 flex gap-3">
            <input readOnly value={generatedLink} className="flex-1 bg-zinc-900/50 p-2 text-[10px] rounded border border-zinc-800 outline-none text-zinc-300 font-mono tracking-tight" />
            <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="px-4 py-1 rounded-lg text-xs font-bold bg-zinc-800 text-green-500">
              {copied ? t.done : t.copy}
            </button>
          </div>
        )}

      </form>
    </div>
  );
}
