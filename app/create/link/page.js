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

  const inputBaseStyles = "w-full p-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300 placeholder:text-zinc-600 hover:bg-zinc-900/80 hover:border-zinc-600";

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-12 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-600/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-500/5 rounded-full blur-[128px] pointer-events-none"></div>

      <form onSubmit={handleGenerate} className="relative z-10 w-full max-w-lg bg-[#18181b]/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/5 shadow-2xl shadow-black/50 space-y-6 transform transition-all hover:border-white/10">
        <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 uppercase italic tracking-tighter drop-shadow-sm">Sell Secure Link</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="text-[10px] bg-zinc-800/50 border border-zinc-700/50 px-2.5 py-1 rounded-full text-zinc-400">Zoom / Google Meet</span>
                <span className="text-[10px] bg-zinc-800/50 border border-zinc-700/50 px-2.5 py-1 rounded-full text-zinc-400">Google Forms / Sheets</span>
                <span className="text-[10px] bg-zinc-800/50 border border-zinc-700/50 px-2.5 py-1 rounded-full text-zinc-400">Unlisted YouTube</span>
                <span className="text-[10px] bg-zinc-800/50 border border-zinc-700/50 px-2.5 py-1 rounded-full text-zinc-400">Telegram Invite</span>
            </div>
            <div className="h-1 w-20 bg-green-500/50 rounded-full mx-auto mt-4"></div>
        </div>
        
        <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className={inputBaseStyles} placeholder="Service Title (e.g. Consultation, Survey Access)" />
        
        <div className="relative group">
          <label className="text-[10px] text-zinc-400 mb-2 block uppercase font-bold tracking-wider text-center group-hover:text-green-400 transition-colors">The Secret URL (Hidden)</label>
          <div className="relative">
             <input required type="url" value={secretLink} onChange={(e)=>setSecretLink(e.target.value)} className={`${inputBaseStyles} pr-10 font-mono text-sm`} placeholder="https://..." />
             <div className="absolute right-3 top-3.5 text-lg text-green-500 animate-pulse">🔒</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input required type="text" placeholder="Seller Name" onChange={(e)=>setSellerName(e.target.value)} className={inputBaseStyles} />
          <input required type="email" placeholder="Support Email" onChange={(e)=>setSellerEmail(e.target.value)} className={inputBaseStyles} />
        </div>

        <div className="p-4 bg-zinc-800/20 rounded-xl border border-white/5 space-y-3">
          <label className="text-[10px] text-zinc-400 block uppercase text-center font-black tracking-widest opacity-70">Cover Preview (Optional)</label>
          <input type="file" accept="image/*" onChange={(e)=>setPreviewFile(e.target.files[0])} className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-zinc-700 file:text-white file:hover:bg-zinc-600 cursor-pointer transition-all" />
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-zinc-500 text-xs">🔗</span></div>
             <input type="url" placeholder="Or Image URL" value={previewLink} onChange={(e)=>setPreviewLink(e.target.value)} className={`${inputBaseStyles} pl-8 py-2 text-xs`} />
          </div>
        </div>

        <div className="relative bg-zinc-900/40 p-4 rounded-xl border border-zinc-800">
          <label className="text-[10px] text-green-400/80 mb-2 block italic font-bold text-center tracking-wide">
             BCH Rate: <span className="text-white bg-zinc-800 px-1.5 py-0.5 rounded ml-1">{bchPreview}</span>
          </label>
          <div className="relative flex items-center group">
            <span className="absolute left-4 text-green-500 font-black text-lg pointer-events-none group-hover:scale-110 transition-transform">USD</span>
            <input required type="number" step="any" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className="w-full p-4 pl-16 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-2xl outline-none focus:border-green-500 text-center font-black transition-all shadow-inner" />
          </div>
        </div>

        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className={inputBaseStyles} placeholder="BCH Wallet Address" />
        
        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-4 rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 transition-colors flex flex-col gap-3 group">
            <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-sm font-bold uppercase italic text-white flex items-center gap-2">Promo Code {enablePromo && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}</h3>
                   <p className="text-[9px] text-zinc-500 group-hover:text-zinc-400 transition-colors">Offer a secret discount</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" checked={enablePromo} onChange={(e) => setEnablePromo(e.target.checked)} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-500 right-5 border-zinc-600 transition-all duration-300"/>
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

        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 flex items-center justify-between hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300">
          <div>
            <h3 className="text-sm font-bold uppercase italic text-white group flex items-center gap-1">Viral Mode <span className="text-[10px] bg-green-600/20 text-green-400 px-1.5 rounded ml-2 not-italic">Recommended</span></h3>
            <p className="text-[10px] text-zinc-400 leading-tight mt-1">10% promoter commission</p>
          </div>
          <input type="checkbox" checked={enableAffiliate} onChange={(e) => setEnableAffiliate(e.target.checked)} className="w-5 h-5 accent-green-500 cursor-pointer rounded bg-zinc-700 border-zinc-600 focus:ring-green-500 focus:ring-offset-zinc-900" />
        </div>

        <button type="submit" disabled={uploading} className="w-full relative overflow-hidden group bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 py-4 rounded-xl font-black transition-all uppercase italic text-lg shadow-xl shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]">
          <span className="relative z-10 flex items-center justify-center gap-2">
            {uploading ? (
                <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Encrypting Link...
                </>
            ) : "Generate PayLink"}
          </span>
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
        </button>

        {generatedLink && (
          <div className="mt-4 p-4 bg-black/80 rounded-xl border border-green-500/30 flex gap-3 animate-in fade-in slide-in-from-bottom-2 shadow-lg shadow-green-900/10">
            <input readOnly value={generatedLink} className="flex-1 bg-zinc-900/50 p-2 text-[10px] rounded border border-zinc-800 outline-none text-zinc-300 font-mono tracking-tight" />
            <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className={`px-4 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${copied ? 'bg-green-500 text-white' : 'bg-zinc-800 text-green-500 hover:bg-zinc-700'}`}>
                {copied ? '✅' : 'Copy'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
