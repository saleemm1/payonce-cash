'use client';
import { useState, useEffect } from 'react';

export default function AppActivateCardPage() {
  const [wallet, setWallet] = useState('');
  const [priceUSD, setPriceUSD] = useState('');
  const [bchPreview, setBchPreview] = useState('0.00');
  const [bchRate, setBchRate] = useState(null);
  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd')
      .then(res => res.json())
      .then(data => setBchRate(data['bitcoin-cash'].usd))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (bchRate && priceUSD) {
      setBchPreview((parseFloat(priceUSD) / bchRate).toFixed(8));
    } else {
      setBchPreview('0.00');
    }
  }, [priceUSD, bchRate]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!wallet || !productName || !sellerEmail || !priceUSD) return alert('Fill fields!');
    const link = `${window.location.origin}/unlock?name=${encodeURIComponent(productName)}&usd=${priceUSD}&wallet=${wallet}&seller=${encodeURIComponent(sellerName)}&email=${encodeURIComponent(sellerEmail)}&preview=${encodeURIComponent(previewLink)}&aff=true`;
    setGeneratedLink(link);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 py-10">
      <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-4">
        <h1 className="text-2xl font-bold mb-2 text-center text-green-500">Upload App Card</h1>
        <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="Product Name" />
        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Seller Name" onChange={(e)=>setSellerName(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
          <input required type="email" placeholder="Support Email" onChange={(e)=>setSellerEmail(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
        </div>
        <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-700">
          <div className="flex justify-between text-[10px] text-zinc-400 mb-2">
            <span>Price (USD)</span>
            <span className="text-green-500">Live Preview: {bchPreview} BCH</span>
          </div>
          <input required type="number" step="0.01" value={priceUSD} onChange={(e) => setPriceUSD(e.target.value)} className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white text-sm outline-none" placeholder="10.00" />
        </div>
        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="Your BCH Wallet" />
        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold">GENERATE LINK</button>
        {generatedLink && (
          <div className="mt-4 p-3 bg-black rounded-lg border border-green-500/30 flex gap-2">
            <input readOnly value={generatedLink} className="flex-1 bg-zinc-900 p-2 text-[10px] rounded" />
            <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="bg-zinc-800 px-3 py-1 rounded text-xs">{copied ? '✅' : 'Copy'}</button>
          </div>
        )}
      </form>
    </div>
  );
}
