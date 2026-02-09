'use client';
import { useState, useEffect } from 'react';

export default function PDFUploadPage() {
  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [usdPrice, setUsdPrice] = useState(10.5);
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

  useEffect(() => {
    const getBCH = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
        const data = await res.json();
        const price = parseFloat(usdPrice);
        if (!isNaN(price) && price > 0) {
          setBchPreview((price / data['bitcoin-cash'].usd).toFixed(8));
        }
      } catch {}
    };
    getBCH();
  }, [usdPrice]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

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
        pc: enablePromo && promoCode && promoDiscount ? { code: promoCode.toUpperCase(), discount: promoDiscount } : null
      };

      const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      setGeneratedLink(`${window.location.origin}/unlock?id=${encodedId}`);
    } catch {
      alert("Error during processing");
    } finally {
      setUploading(false);
    }
  };

  const inputBaseStyles =
    "w-full p-3 bg-zinc-900/60 backdrop-blur border border-zinc-700/60 rounded-xl text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/40 transition-all duration-300 placeholder:text-zinc-600 hover:bg-zinc-900/80";

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[30rem] h-[30rem] bg-green-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[30rem] h-[30rem] bg-green-500/10 rounded-full blur-[160px]" />
      </div>

      <form
        onSubmit={handleGenerate}
        className="relative z-10 w-full max-w-lg bg-[#18181b]/85 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] space-y-6 transition-all"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 uppercase italic tracking-tight">
            Sell PDF Document
          </h1>
          <div className="mx-auto w-24 h-[3px] bg-gradient-to-r from-transparent via-green-500/70 to-transparent rounded-full" />
        </div>

        <input required value={productName} onChange={e => setProductName(e.target.value)} className={inputBaseStyles} placeholder="Document Title" />

        <div className="p-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 hover:border-green-500/40 transition">
          <label className="block mb-2 text-[11px] uppercase font-bold tracking-wider text-zinc-400">Main File (.pdf only)</label>
          <input required type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])}
            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-green-600 file:text-white hover:file:bg-green-500 transition cursor-pointer" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="Seller Name" onChange={e => setSellerName(e.target.value)} className={inputBaseStyles} />
          <input required type="email" placeholder="Support Email" onChange={e => setSellerEmail(e.target.value)} className={inputBaseStyles} />
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-zinc-800/20 space-y-3">
          <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-400 text-center">
            Cover Preview (File or URL) (Optional)
          </label>
          <input type="file" accept="image/*" onChange={e => setPreviewFile(e.target.files[0])}
            className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-zinc-700 file:text-white hover:file:bg-zinc-600 cursor-pointer transition" />
          <input value={previewLink} onChange={e => setPreviewLink(e.target.value)}
            placeholder="Or Image URL" className={`${inputBaseStyles} text-xs`} />
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2">
          <div className="text-center text-[10px] font-bold italic text-green-400">
            BCH Rate <span className="ml-1 bg-zinc-800 px-2 py-0.5 rounded text-white">{bchPreview}</span>
          </div>
          <input required type="number" step="any" value={usdPrice} onChange={e => setUsdPrice(e.target.value)}
            className="w-full p-4 text-2xl font-black text-center bg-zinc-900 border border-zinc-700 rounded-xl focus:border-green-500 transition" />
        </div>

        <input required value={wallet} onChange={e => setWallet(e.target.value)} className={inputBaseStyles} placeholder="BCH Wallet Address" />

        <div className="p-4 rounded-xl border border-zinc-700 bg-zinc-900/50 flex justify-between items-center">
          <div>
            <div className="text-sm font-bold uppercase italic flex items-center gap-2">
              Promo Code {enablePromo && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            </div>
          </div>
          <input type="checkbox" checked={enablePromo} onChange={e => setEnablePromo(e.target.checked)} className="w-5 h-5 accent-green-500" />
        </div>

        {enablePromo && (
          <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
            <input maxLength={5} value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())}
              placeholder="CODE" className="flex-1 p-2 bg-black/50 border border-zinc-700 rounded-lg text-xs uppercase font-bold tracking-widest" />
            <input type="number" value={promoDiscount} onChange={e => setPromoDiscount(e.target.value)}
              placeholder="%" className="w-20 p-2 bg-black/50 border border-zinc-700 rounded-lg text-xs text-center font-bold" />
          </div>
        )}

        <div className="p-4 rounded-xl border border-zinc-700 bg-zinc-900/50 flex justify-between items-center">
          <div>
            <div className="text-sm font-bold uppercase italic">Viral Mode</div>
            <div className="text-[10px] text-zinc-400">10% promoter commission</div>
          </div>
          <input type="checkbox" checked={enableAffiliate} onChange={e => setEnableAffiliate(e.target.checked)} className="w-5 h-5 accent-green-500" />
        </div>

        <button disabled={uploading}
          className="w-full py-4 rounded-xl font-black uppercase italic bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 transition shadow-xl disabled:opacity-50">
          {uploading ? "Processing Assets..." : "Generate PDF Link"}
        </button>

        {generatedLink && (
          <div className="p-4 rounded-xl border border-green-500/30 bg-black/80 flex gap-3 animate-in fade-in">
            <input readOnly value={generatedLink}
              className="flex-1 bg-zinc-900 p-2 text-[10px] rounded border border-zinc-800 font-mono" />
            <button type="button" onClick={() => {
              navigator.clipboard.writeText(generatedLink);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
              className={`px-4 rounded-lg text-xs font-bold ${copied ? 'bg-green-500 text-white' : 'bg-zinc-800 text-green-500 hover:bg-zinc-700'}`}>
              {copied ? '✅' : 'Copy'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
