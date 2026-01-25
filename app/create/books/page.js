'use client';
import { useState, useEffect } from 'react';
export default function BookUploadPage() {
  const [wallet, setWallet] = useState('');
  const [usdPrice, setUsdPrice] = useState(15.25);
  const [bchPreview, setBchPreview] = useState('0.00');
  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [enableAffiliate, setEnableAffiliate] = useState(true);
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
  const handleGenerate = (e) => {
    e.preventDefault();
    const link = `${window.location.origin}/unlock?name=${encodeURIComponent(productName)}&usd=${usdPrice}&wallet=${wallet}&seller=${encodeURIComponent(sellerName)}&email=${encodeURIComponent(sellerEmail)}&preview=${encodeURIComponent(previewLink)}&aff=${enableAffiliate}`;
    setGeneratedLink(link);
  };
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 py-10">
      <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-4">
        <h1 className="text-2xl font-bold mb-2 text-center text-green-500 uppercase italic font-black">Publish Digital Book</h1>
        <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="Book Title" />
        <div>
          <label className="text-[10px] text-zinc-400 mb-1 block ml-1 uppercase font-bold">E-Book File (.pdf, .epub, .mobi)</label>
          <input required type="file" accept=".pdf,.epub,.mobi" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-gray-300 file:bg-green-600" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input required type="text" placeholder="Author" onChange={(e)=>setSellerName(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
          <input required type="email" placeholder="Support Email" onChange={(e)=>setSellerEmail(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
        </div>
        <div className="p-3 bg-zinc-800/30 rounded-lg border border-white/5">
          <label className="text-[10px] text-zinc-400 mb-2 block uppercase text-center font-black">Book Cover Preview</label>
          <input type="file" accept="image/*" className="w-full text-xs text-zinc-500 mb-2" />
          <input type="url" placeholder="Or Cover URL" onChange={(e)=>setPreviewLink(e.target.value)} className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs outline-none focus:border-green-500" />
        </div>
        <div className="relative">
          <label className="text-[10px] text-zinc-400 mb-1 block italic font-bold text-center">BCH Rate: {bchPreview}</label>
          <input required type="number" step="any" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
        </div>
        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="BCH Wallet Address" />
        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-black transition-all uppercase italic text-lg">Generate Book Link</button>
      </form>
    </div>
  );
}
