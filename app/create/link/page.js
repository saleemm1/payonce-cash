'use client';
import { useState, useEffect } from 'react';

export default function LinkSellPage() {
  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [usdPrice, setUsdPrice] = useState(15.0);
  const [wallet, setWallet] = useState('');
  const [bchPreview, setBchPreview] = useState('0.00');
  const [secretLink, setSecretLink] = useState('');
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
      } catch (e) {}
    };
    getBCH();
  }, [usdPrice]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!secretLink) return alert("Please enter the secret link");

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
        dt: 'link', 
        w: wallet,
        p: usdPrice,
        n: productName,
        sn: sellerName,
        se: sellerEmail,
        pr: finalPreview,
        i: secretLink, 
        fn: 'Secure Redirect',
        a: enableAffiliate,
        pc: enablePromo && promoCode && promoDiscount ? { code: promoCode.toUpperCase(), discount: promoDiscount } : null
      };

      const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      setGeneratedLink(`${window.location.origin}/unlock?id=${encodedId}`);
    } catch (err) {
      alert("Error generating link");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 py-10 font-sans">
      <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-4">
        <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-green-500 uppercase italic font-black">Sell Secure Link</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
                <span className="text-[9px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">Zoom / Google Meet</span>
                <span className="text-[9px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">Google Forms / Sheets</span>
                <span className="text-[9px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">Unlisted YouTube</span>
                <span className="text-[9px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">Telegram Invite</span>
                <span className="text-[9px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">Any Secure URL</span>
            </div>
        </div>
        
        <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 transition-all" placeholder="Service Title (e.g. Consultation, Survey Access)" />
        
        <div className="relative group">
          <label className="text-[10px] text-zinc-400 mb-1 block ml-1 uppercase font-bold">The Secret URL (Hidden)</label>
          <input required type="url" value={secretLink} onChange={(e)=>setSecretLink(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm outline-none focus:border-green-500 placeholder:text-zinc-600 font-mono" placeholder="https://..." />
          <div className="absolute right-3 top-8 text-lg">🔒</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input required type="text" placeholder="Seller Name" onChange={(e)=>setSellerName(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 transition-all" />
          <input required type="email" placeholder="Support Email" onChange={(e)=>setSellerEmail(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 transition-all" />
        </div>

        <div className="p-3 bg-zinc-800/30 rounded-lg border border-white/5">
          <label className="text-[10px] text-zinc-400 mb-2 block uppercase text-center font-black">Cover Preview (Optional)</label>
          <input type="file" accept="image/*" onChange={(e)=>setPreviewFile(e.target.files[0])} className="w-full text-xs text-zinc-500 mb-2 file:bg-zinc-700 file:text-white file:border-0 file:rounded file:px-2 cursor-pointer" />
          <input type="url" placeholder="Or Image URL" value={previewLink} onChange={(e)=>setPreviewLink(e.target.value)} className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs outline-none focus:border-green-500 transition-all" />
        </div>

        <div className="relative">
          <label className="text-[10px] text-zinc-400 mb-1 block italic font-bold text-center">BCH Rate: {bchPreview}</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-green-500 font-black text-sm">USD</span>
            <input required type="number" step="any" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className="w-full p-3 pl-14 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 text-center font-black transition-all" />
          </div>
        </div>

        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 transition-all" placeholder="BCH Wallet Address" />
        
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-700 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-sm font-bold uppercase italic text-white">Promo Code</h3>
                   <p className="text-[9px] text-zinc-500">Offer a secret discount</p>
                </div>
                <input type="checkbox" checked={enablePromo} onChange={(e) => setEnablePromo(e.target.checked)} className="w-5 h-5 accent-green-500 cursor-pointer" />
            </div>
            {enablePromo && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                    <input type="text" maxLength={5} placeholder="CODE" value={promoCode} onChange={(e)=>setPromoCode(e.target.value.toUpperCase())} className="flex-1 p-2 bg-black border border-zinc-700 rounded text-xs text-white uppercase outline-none focus:border-green-500" />
                    <input type="number" placeholder="%" min="1" max="100" value={promoDiscount} onChange={(e)=>setPromoDiscount(e.target.value)} className="w-16 p-2 bg-black border border-zinc-700 rounded text-xs text-white outline-none focus:border-green-500 text-center" />
                </div>
            )}
        </div>

        <div className="bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-700 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase italic text-white">Viral Mode</h3>
            <p className="text-[10px] text-zinc-400 leading-tight">10% promoter commission</p>
          </div>
          <input type="checkbox" checked={enableAffiliate} onChange={(e) => setEnableAffiliate(e.target.checked)} className="w-5 h-5 accent-green-500 cursor-pointer" />
        </div>

        <button type="submit" disabled={uploading} className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-black transition-all uppercase italic text-lg shadow-xl disabled:opacity-50">
          {uploading ? "Encrypting Link..." : "Generate PayLink"}
        </button>

        {generatedLink && (
          <div className="mt-4 p-3 bg-black rounded-lg border border-green-500/30 flex gap-2">
            <input readOnly value={generatedLink} className="flex-1 bg-zinc-900 p-2 text-[10px] rounded border border-zinc-800 outline-none text-zinc-400" />
            <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="bg-zinc-800 px-3 py-1 rounded text-xs font-bold text-green-500">{copied ? '✅' : 'Copy'}</button>
          </div>
        )}
      </form>
    </div>
  );
}
