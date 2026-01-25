'use client';
import { useState, useEffect } from 'react';
export default function TicketUploadPage() {
  const [wallet, setWallet] = useState('');
  const [usdPrice, setUsdPrice] = useState(15);
  const [bchPreview, setBchPreview] = useState('0.00');
  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const getBCH = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
        const data = await res.json();
        setBchPreview((usdPrice / data['bitcoin-cash'].usd).toFixed(8));
      } catch (e) { console.error(e); }
    };
    if (usdPrice > 0) getBCH();
  }, [usdPrice]);

  const handleGenerate = (e) => {
    e.preventDefault();
    const link = `${window.location.origin}/unlock?name=${encodeURIComponent(productName)}&usd=${usdPrice}&wallet=${wallet}&seller=${encodeURIComponent(sellerName)}&email=${encodeURIComponent(sellerEmail)}&preview=${encodeURIComponent(previewLink)}&aff=true`;
    setGeneratedLink(link);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 py-10">
      <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-4">
        <h1 className="text-2xl font-bold mb-2 text-center text-green-500">Create Event Ticket</h1>
        <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="Event Name" />
        <input required type="file" accept="image/*,.pdf" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-gray-300 file:bg-green-600 mb-2" />
        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Organizer" onChange={(e)=>setSellerName(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none" />
          <input required type="email" placeholder="Contact Email" onChange={(e)=>setSellerEmail(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none" />
        </div>
        <div className="p-3 bg-zinc-800/30 rounded-lg border border-white/5">
          <label className="text-[10px] text-zinc-400 mb-2 block">Ticket Preview (Optional)</label>
          <input type="file" accept="image/*" className="w-full text-xs file:bg-zinc-700 mb-2" />
          <input type="url" placeholder="Or Poster URL" onChange={(e)=>setPreviewLink(e.target.value)} className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs outline-none" />
        </div>
        <div className="relative">
          <label className="text-[10px] text-zinc-400 mb-1 block">Ticket Price USD (Preview: {bchPreview} BCH)</label>
          <input required type="number" step="0.01" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none" />
        </div>
        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none" placeholder="Your BCH Wallet" />
        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold transition-all">GENERATE LINK</button>
        {generatedLink && (
          <div className="mt-4 p-3 bg-black rounded-lg border border-green-500/30 flex gap-2">
            <input readOnly value={generatedLink} className="flex-1 bg-zinc-900 p-2 text-[10px] rounded border border-zinc-800" />
            <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="bg-zinc-800 px-3 py-1 rounded text-xs">{copied ? '✅' : 'Copy'}</button>
          </div>
        )}
      </form>
    </div>
  );
}
