'use client';
import { useState, useEffect } from 'react';

export default function BookUploadPage() {
  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [usdPrice, setUsdPrice] = useState(15.5);
  const [wallet, setWallet] = useState('');
  
  const [bchPreview, setBchPreview] = useState('0.00');
  const [file, setFile] = useState(null);
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
      } catch (e) { console.error("Price fetch failed"); }
    };
    getBCH();
  }, [usdPrice]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a book file (PDF/EPUB)");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      
      if (!json.ipfsHash) throw new Error("Upload Failed");

      const payload = {
        w: wallet,
        p: usdPrice,
        n: productName,
        fn: file.name,
        sn: sellerName,
        se: sellerEmail,
        pr: previewLink,
        i: json.ipfsHash,
        a: enableAffiliate,
        dt: 'file'
      };

      const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      setGeneratedLink(`${window.location.origin}/unlock?id=${encodedId}`);
    } catch (err) {
      alert("خطأ: تأكد من إعداد API الرفع أو استخدم رابط مباشر للملف");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 py-10 font-sans">
      <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <h1 className="text-2xl font-black text-center text-green-500 uppercase italic tracking-tighter">Publish Digital Book</h1>
        
        <input required type="text" placeholder="Book Title" value={productName} onChange={(e)=>setProductName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 transition-all" />
        
        <div className="grid grid-cols-2 gap-2">
          <input required type="text" placeholder="Author Name" onChange={(e)=>setSellerName(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm outline-none focus:border-green-500" />
          <input required type="email" placeholder="Support Email" onChange={(e)=>setSellerEmail(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm outline-none focus:border-green-500" />
        </div>

        <div className="p-4 bg-zinc-800/20 rounded-2xl border border-white/5 space-y-3">
          <label className="text-[10px] text-zinc-500 uppercase font-black">1. Book File (PDF/EPUB)</label>
          <input required type="file" accept=".pdf,.epub" onChange={(e)=>setFile(e.target.files[0])} className="w-full text-xs text-zinc-400 file:bg-zinc-700 file:text-white file:border-0 file:px-3 file:py-1 file:rounded-lg file:mr-3 cursor-pointer" />
          
          <label className="text-[10px] text-zinc-500 uppercase font-black block mt-2">2. Cover Image URL (Preview) (Optional)</label>
          <input type="url" placeholder="https://example.com/cover.jpg" value={previewLink} onChange={(e)=>setPreviewLink(e.target.value)} className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs outline-none focus:border-green-500" />
        </div>

        <div className="relative">
          <label className="text-[10px] text-zinc-500 mb-1 block uppercase font-black text-center">BCH Rate: {bchPreview} <span className="text-green-500">Live</span></label>
          <div className="flex gap-2">
             <input required type="number" step="any" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className="w-1/3 p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-center font-bold outline-none focus:border-green-500" />
             <input required type="text" placeholder="BCH Wallet Address" value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-2/3 p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm outline-none focus:border-green-500" />
          </div>
        </div>

        <div className="bg-green-500/5 p-4 rounded-2xl border border-dashed border-green-500/20 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black uppercase text-white">Viral Mode (10%)</h3>
            <p className="text-[9px] text-zinc-500">Enable affiliates to sell your book</p>
          </div>
          <input type="checkbox" checked={enableAffiliate} onChange={(e) => setEnableAffiliate(e.target.checked)} className="w-5 h-5 accent-green-500 cursor-pointer" />
        </div>

        <button type="submit" disabled={uploading} className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-black transition-all uppercase italic text-lg shadow-xl shadow-green-900/20 disabled:opacity-50">
          {uploading ? "Uploading to IPFS..." : "Generate Smart Link"}
        </button>

        {generatedLink && (
          <div className="mt-4 p-4 bg-black rounded-xl border border-green-500/30 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-[10px] text-zinc-500 uppercase font-black mb-2">Your Secure Link:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-[10px] text-green-500 break-all font-mono">{generatedLink}</code>
              <button type="button" onClick={copyLink} className="bg-zinc-800 px-3 py-2 rounded-lg text-[10px] font-black uppercase border border-white/5">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
