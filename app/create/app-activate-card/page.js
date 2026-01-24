'use client';
import { useState } from 'react';

export default function AppActivateCardPage() {
  const [wallet, setWallet] = useState('');
  const [price, setPrice] = useState(0.2);
  const [productName, setProductName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [enableAffiliate, setEnableAffiliate] = useState(true);

  const handleGenerate = () => {
    if (!wallet || !productName) return alert('Please fill all fields!');
    const link = `${window.location.origin}/unlock/app-activate-card?name=${encodeURIComponent(productName)}&price=${price}&wallet=${wallet}&aff=${enableAffiliate}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-500">Upload App Card</h1>
        <div className="space-y-4">
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="App/Card Name" />
          <div>
            <input type="file" accept="image/*,.txt,.pdf" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-gray-300 file:bg-green-600 file:text-white file:border-0 file:px-3 file:py-1 file:rounded" />
            <p className="text-[10px] text-zinc-500 mt-1 ml-1">Allowed formats: Images, TXT, PDF</p>
          </div>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="Price in BCH" />
          <input type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500" placeholder="Your BCH Wallet" />
          
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Viral Growth Mode 🚀</h3>
                <p className="text-[10px] text-zinc-500">Enable 10% referral rewards</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={enableAffiliate} onChange={(e) => setEnableAffiliate(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>

          <button onClick={handleGenerate} className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-600/20">GENERATE LINK</button>
        </div>
        {generatedLink && (
          <div className="mt-6 p-4 bg-black rounded-lg border border-green-500/30 animate-in fade-in zoom-in">
            <div className="flex gap-2">
              <input readOnly value={generatedLink} className="flex-1 bg-zinc-900 p-2 text-[10px] rounded border border-zinc-800 text-zinc-300 outline-none" />
              <button onClick={copyToClipboard} className="bg-zinc-800 px-3 py-1 rounded text-xs hover:bg-zinc-700 transition-colors">{copied ? '✅' : 'Copy'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}