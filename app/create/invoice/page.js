'use client';
import { useState, useEffect } from 'react';
export default function InvoiceGeneratorPage() {
  const [wallet, setWallet] = useState('');
  const [usdPrice, setUsdPrice] = useState(10);
  const [bchPreview, setBchPreview] = useState('0.00');
  const [customerName, setCustomerName] = useState('');
  const [invoiceNote, setInvoiceNote] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [enableAffiliate, setEnableAffiliate] = useState(false);

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
    const link = `${window.location.origin}/unlock?type=invoice&name=${encodeURIComponent(customerName)}&note=${encodeURIComponent(invoiceNote)}&usd=${usdPrice}&wallet=${wallet}&seller=${encodeURIComponent(sellerName)}&email=${encodeURIComponent(sellerEmail)}&aff=${enableAffiliate}`;
    setGeneratedLink(link);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 py-10">
      <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-4">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-green-500 uppercase italic tracking-tighter">BCH Invoice Generator</h1>
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black italic">Professional Storefront Protocol</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input required type="text" placeholder="Seller Name" onChange={(e)=>setSellerName(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
          <input required type="email" placeholder="Support Email" onChange={(e)=>setSellerEmail(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
        </div>
        <input required type="text" placeholder="Client/Customer Name" onChange={(e)=>setCustomerName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
        <textarea required placeholder="Invoice Description (e.g. Ad Services, Store Items...)" onChange={(e)=>setInvoiceNote(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm h-24 outline-none focus:border-green-500" />
        <div className="p-3 bg-zinc-800/30 rounded-lg border border-white/5">
          <label className="text-[10px] text-zinc-400 mb-1 block uppercase font-black tracking-widest italic">Amount: {bchPreview} BCH</label>
          <input required type="number" step="0.01" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
        </div>
        <input required type="text" placeholder="Your BCH Wallet Address" onChange={(e) => setWallet(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-700 flex items-center justify-between opacity-50">
          <div><h3 className="text-sm font-bold uppercase italic tracking-tighter">Viral Mode</h3><p className="text-[10px] text-zinc-500 italic">Disabled for direct invoices</p></div>
          <input type="checkbox" disabled checked={enableAffiliate} className="w-5 h-5 accent-zinc-500" />
        </div>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-black transition-all uppercase italic tracking-tighter text-lg shadow-xl shadow-green-900/20">Generate Invoice Link</button>
        {generatedLink && (
          <div className="mt-4 p-3 bg-black rounded-lg border border-green-500/30 flex gap-2">
            <input readOnly value={generatedLink} className="flex-1 bg-zinc-900 p-2 text-[10px] rounded border border-zinc-800 outline-none text-zinc-400" />
            <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="bg-zinc-800 px-3 py-1 rounded text-xs font-bold">{copied ? '✅' : 'Copy'}</button>
          </div>
        )}
      </form>
    </div>
  );
}
