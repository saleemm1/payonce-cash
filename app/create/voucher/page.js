'use client';
import { useState, useEffect } from 'react';

export default function VoucherUploadPage() {
  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [usdPrice, setUsdPrice] = useState(25.0);
  const [tokenAmount, setTokenAmount] = useState(25);
  const [wallet, setWallet] = useState('');
  const [bchPreview, setBchPreview] = useState('0.00');
  const [enableAffiliate, setEnableAffiliate] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

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

      const voucherData = JSON.stringify({
         type: "CASH_TOKEN_VOUCHER",
         store: productName,
         value: tokenAmount,
         issuer: sellerName,
         validity: "Lifetime"
      });
      const blob = new Blob([voucherData], { type: 'application/json' });
      const voucherFile = new File([blob], "voucher_metadata.json");

      const formData = new FormData();
      formData.append("file", voucherFile);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      
      if (!json.ipfsHash) throw new Error("Upload Failed");

      const payload = {
        w: wallet,
        p: usdPrice,
        n: `${productName} (${tokenAmount} Credits)`,
        sn: sellerName,
        se: sellerEmail,
        pr: finalPreview,
        i: json.ipfsHash,
        fn: "Store_Credits.token",
        a: enableAffiliate,
        dt: 'voucher',
        tv: tokenAmount
      };

      const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      setGeneratedLink(`${window.location.origin}/unlock?id=${encodedId}`);
    } catch (err) {
      alert("Error during processing");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 py-10 font-sans">
      <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-5 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -mr-10 -mt-10 blur-xl pointer-events-none"></div>

        <div className="text-center mb-6">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 mb-3 shadow-lg">
             <span className="text-2xl">💳</span>
           </div>
           <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Create Store Voucher</h1>
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Issue CashTokens as Store Credit</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[9px] text-zinc-500 uppercase font-black ml-1 mb-1 block">Voucher Name</label>
            <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 transition-all font-bold placeholder:font-normal" placeholder="e.g. Starbucks Gold Card" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             <div>
                <label className="text-[9px] text-zinc-500 uppercase font-black ml-1 mb-1 block">Price (USD)</label>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 font-black text-xs">$</span>
                   <input required type="number" step="any" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className="w-full p-4 pl-7 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 font-bold text-center" />
                </div>
             </div>
             <div>
                <label className="text-[9px] text-zinc-500 uppercase font-black ml-1 mb-1 block">Token Value</label>
                <div className="relative">
                   <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-[10px] font-black">TOKENS</span>
                   <input required type="number" step="1" value={tokenAmount} onChange={(e) => setTokenAmount(e.target.value)} className="w-full p-4 pr-14 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 font-bold text-center" />
                </div>
             </div>
          </div>
        </div>

        <div className="p-4 bg-zinc-800/30 rounded-xl border border-white/5">
          <label className="text-[9px] text-zinc-400 mb-2 block uppercase font-black text-center">Card Design (Preview Image)</label>
          <div className="flex gap-2">
             <input type="file" accept="image/*" onChange={(e)=>setPreviewFile(e.target.files[0])} className="w-full text-[10px] text-zinc-500 file:bg-zinc-700 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1 cursor-pointer" />
          </div>
          <input type="url" placeholder="Or Image URL" value={previewLink} onChange={(e)=>setPreviewLink(e.target.value)} className="w-full mt-2 p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs outline-none focus:border-green-500" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input required type="text" placeholder="Issuer Name" onChange={(e)=>setSellerName(e.target.value)} className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 text-xs font-bold" />
          <input required type="email" placeholder="Support Email" onChange={(e)=>setSellerEmail(e.target.value)} className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 text-xs font-bold" />
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col gap-1">
             <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-zinc-400 uppercase">Est. Cost</span>
                 <span className="text-[10px] font-mono text-green-500">{bchPreview} BCH</span>
             </div>
             <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full mt-2 bg-transparent border-b border-zinc-700 py-1 text-xs text-center text-white outline-none focus:border-green-500 placeholder:text-zinc-600" placeholder="Merchant Wallet Address" />
        </div>

        <div className="bg-gradient-to-r from-zinc-900 to-black p-4 rounded-xl border border-dashed border-zinc-700 flex items-center justify-between group hover:border-green-500/30 transition-colors">
          <div>
            <h3 className="text-xs font-black uppercase italic text-white group-hover:text-green-500 transition-colors">Atomic Virality 🚀</h3>
            <p className="text-[9px] text-zinc-500">10% Commission for Promoters</p>
          </div>
          <input type="checkbox" checked={enableAffiliate} onChange={(e) => setEnableAffiliate(e.target.checked)} className="w-5 h-5 accent-green-500 cursor-pointer" />
        </div>

        <button type="submit" disabled={uploading} className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-black transition-all uppercase italic text-lg shadow-[0_10px_30px_rgba(22,163,74,0.2)] hover:shadow-[0_10px_40px_rgba(22,163,74,0.4)] hover:-translate-y-1 active:scale-95 disabled:opacity-50">
          {uploading ? "Minting Assets..." : "Launch Voucher"}
        </button>

        {generatedLink && (
          <div className="mt-4 p-4 bg-black/90 rounded-2xl border border-green-500/30 flex flex-col gap-2 animate-in slide-in-from-bottom-5">
            <span className="text-[9px] text-green-500 uppercase font-black tracking-widest text-center">Voucher Link Live</span>
            <div className="flex gap-2">
              <input readOnly value={generatedLink} className="flex-1 bg-zinc-900 p-3 text-[10px] rounded-xl border border-zinc-800 outline-none text-zinc-400 font-mono text-center" />
              <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="bg-zinc-800 hover:bg-zinc-700 px-4 rounded-xl text-xs font-bold text-green-500 transition-all">{copied ? '✅' : 'Copy'}</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
