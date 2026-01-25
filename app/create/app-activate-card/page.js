'use client';
import { useState, useEffect } from 'react';

export default function AppActivateCardPage() {
  const [wallet, setWallet] = useState('');
  const [price, setPrice] = useState('');
  const [priceUSD, setPriceUSD] = useState('');
  const [bchRate, setBchRate] = useState(null);
  const [productName, setProductName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [enableAffiliate, setEnableAffiliate] = useState(true);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd')
      .then(res => res.json())
      .then(data => setBchRate(data['bitcoin-cash'].usd))
      .catch(err => console.error(err));
  }, []);

  const handlePriceChange = (value, type) => {
    if (type === 'BCH') {
      setPrice(value);
      if (bchRate && value) {
        setPriceUSD((parseFloat(value) * bchRate).toFixed(2));
      } else {
        setPriceUSD('');
      }
    } else if (type === 'USD') {
      setPriceUSD(value);
      if (bchRate && value) {
        setPrice((parseFloat(value) / bchRate).toFixed(8));
      } else {
        setPrice('');
      }
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!wallet || !productName || !sellerEmail || !price) return alert('Please fill required fields!');
    const link = `${window.location.origin}/unlock?name=${encodeURIComponent(productName)}&price=${price}&wallet=${wallet}&seller=${encodeURIComponent(sellerName)}&email=${encodeURIComponent(sellerEmail)}&preview=${encodeURIComponent(previewLink)}&aff=${enableAffiliate}`;
    setGeneratedLink(link);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 py-10">
      <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-4">
        <h1 className="text-2xl font-bold mb-2 text-center text-green-500 text-[20px]">Upload App Card</h1>
        
        <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="App/Card Name" />
        
        <div>
          <label className="text-[10px] text-zinc-400 mb-1 block ml-1">Main Product File (Required)</label>
          <input required type="file" accept="image/*,.txt,.pdf" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-gray-300 file:bg-green-600 file:text-white file:border-0 file:px-3 file:py-1 file:rounded" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Seller Name" onChange={(e)=>setSellerName(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
          <input required type="email" placeholder="Support Email" onChange={(e)=>setSellerEmail(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
        </div>

        <div className="p-3 bg-zinc-800/30 rounded-lg border border-white/5">
          <label className="text-[10px] text-zinc-400 mb-2 block">Optional Preview (Image/Video)</label>
          <input type="file" accept="image/*,video/*" className="w-full text-xs text-zinc-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-zinc-700 file:text-zinc-300 mb-2" />
          <input type="url" placeholder="Or Preview URL" onChange={(e)=>setPreviewLink(e.target.value)} className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs outline-none focus:border-green-500" />
        </div>

        <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-700">
          <label className="text-[10px] text-zinc-400 mb-2 block flex justify-between">
            <span>Price Calculation</span>
            {bchRate && <span className="text-green-500">1 BCH ≈ ${bchRate}</span>}
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input 
                type="number" 
                step="0.01" 
                value={priceUSD} 
                onChange={(e) => handlePriceChange(e.target.value, 'USD')} 
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white text-sm outline-none focus:border-green-500" 
                placeholder="USD ($)" 
              />
            </div>
            <div className="flex items-center text-zinc-500">⇄</div>
            <div className="flex-1">
              <input 
                required
                type="number" 
                step="0.00000001" 
                value={price} 
                onChange={(e) => handlePriceChange(e.target.value, 'BCH')} 
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded text-white text-sm outline-none focus:border-green-500" 
                placeholder="BCH" 
              />
            </div>
          </div>
        </div>

        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="Your BCH Wallet" />
        
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-700 flex items-center justify-between">
          <div><h3 className="text-sm font-bold">Viral Mode</h3><p className="text-[10px] text-zinc-500">10% referral rewards</p></div>
          <input type="checkbox" checked={enableAffiliate} onChange={(e) => setEnableAffiliate(e.target.checked)} className="w-5 h-5 accent-green-500" />
        </div>

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
