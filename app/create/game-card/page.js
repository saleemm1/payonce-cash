'use client';
import { useState, useEffect } from 'react';
export default function GameCardUploadPage() {
  const [wallet, setWallet] = useState('');
  const [usdPrice, setUsdPrice] = useState(25.5);
  const [bchPreview, setBchPreview] = useState('0.00');
  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [enableAffiliate, setEnableAffiliate] = useState(true);
  const [deliveryType, setDeliveryType] = useState('file');
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
    const link = `${window.location.origin}/unlock?name=${encodeURIComponent(productName)}&usd=${usdPrice}&wallet=${wallet}&seller=${encodeURIComponent(sellerName)}&email=${encodeURIComponent(sellerEmail)}&aff=${enableAffiliate}`;
    setGeneratedLink(link);
  };
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 py-10">
      <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-4">
        <h1 className="text-2xl font-bold mb-2 text-center text-green-500 uppercase italic font-black">Sell Game Card</h1>
        <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="Card Name (e.g. PSN $50)" />
        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-700 gap-1">
          <button type="button" onClick={() => setDeliveryType('file')} className={`flex-1 py-2 text-[10px] font-black uppercase italic rounded-md transition-all ${deliveryType === 'file' ? 'bg-green-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Asset File</button>
          <button type="button" onClick={() => setDeliveryType('code')} className={`flex-1 py-2 text-[10px] font-black uppercase italic rounded-md transition-all ${deliveryType === 'code' ? 'bg-green-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Card Code</button>
        </div>
        {deliveryType === 'file' ? (
          <div>
            <label className="text-[10px] text-zinc-400 mb-1 block ml-1 uppercase font-bold tracking-tighter text-center">Upload Digital Card/Asset</label>
            <input required type="file" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-gray-300 file:bg-green-600" />
          </div>
        ) : (
          <textarea required placeholder="Paste Game Codes / Activation Strings here..." className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 h-24 text-sm"></textarea>
        )}
        <div className="grid grid-cols-2 gap-2">
          <input required type="text" placeholder="Seller Name" onChange={(e)=>setSellerName(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
          <input required type="email" placeholder="Support Email" onChange={(e)=>setSellerEmail(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
        </div>
        <div className="relative">
          <label className="text-[10px] text-zinc-400 mb-1 block italic font-bold text-center">BCH Rate: {bchPreview}</label>
          <input required type="number" step="any" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
        </div>
        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="BCH Wallet Address" />
        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-black transition-all uppercase italic text-lg shadow-lg">Generate Link</button>
      </form>
    </div>
  );
}
