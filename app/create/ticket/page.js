'use client';
import { useState, useEffect } from 'react';
export default function TicketUploadPage() {
  const [wallet, setWallet] = useState('');
  const [usdPrice, setUsdPrice] = useState(15);
  const [bchPreview, setBchPreview] = useState('0.00');
  const [productName, setProductName] = useState('');
  const [ticketCodes, setTicketCodes] = useState(''); // الحقل الجديد للأكواد
  const [sellerEmail, setSellerEmail] = useState('');
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
    // هنا نقوم بتحويل الأكواد إلى String مشفر أو نرسلها للباكيند
    const link = `${window.location.origin}/unlock?name=${encodeURIComponent(productName)}&usd=${usdPrice}&wallet=${wallet}&email=${encodeURIComponent(sellerEmail)}&type=ticket&stock=true`;
    setGeneratedLink(link);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 py-10">
      <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-4">
        <h1 className="text-2xl font-bold mb-2 text-center text-green-500">Event Ticket Factory</h1>
        
        <input required type="text" placeholder="Event Name" onChange={(e) => setProductName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" />
        
        <div className="p-3 bg-zinc-800/30 rounded-lg border border-white/5">
          <label className="text-[10px] text-zinc-400 mb-2 block ml-1">Paste Your Ticket Codes (One per line)</label>
          <textarea 
            required 
            rows="5" 
            placeholder="TKT-001&#10;TKT-002&#10;TKT-003..." 
            onChange={(e) => setTicketCodes(e.target.value)}
            className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-green-400 font-mono outline-none focus:border-green-500"
          ></textarea>
          <p className="text-[9px] text-zinc-500 mt-1">Total Tickets: {ticketCodes.split('\n').filter(t => t.trim()).length}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input required type="email" placeholder="Support Email" onChange={(e)=>setSellerEmail(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none" />
          <input required type="number" step="0.01" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none" />
        </div>

        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="Your BCH Wallet" />

        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold transition-all">ACTIVATE EVENT LINK</button>
        
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
