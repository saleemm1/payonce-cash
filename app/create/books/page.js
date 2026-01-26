'use client';
import { useState } from 'react';

export default function BookUploadPage() {
  const [wallet, setWallet] = useState('');
  const [usdPrice, setUsdPrice] = useState(10);
  const [productName, setProductName] = useState('');
  const [file, setFile] = useState(null);
  const [enableAffiliate, setEnableAffiliate] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file); // رفع ملف الكتاب
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!json.ipfsHash) throw new Error("Upload Failed");

      const encodedId = btoa(JSON.stringify({
        w: wallet, p: usdPrice, n: productName, i: json.ipfsHash, a: enableAffiliate
      }));
      setGeneratedLink(`${window.location.origin}/unlock?id=${encodedId}`);
    } catch (err) { alert("Error"); } finally { setUploading(false); }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 py-10">
       <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-4">
          <h1 className="text-2xl font-black text-center text-green-500 uppercase italic">Publish Book</h1>
          <input required type="text" placeholder="Book Title" onChange={(e)=>setProductName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white" />
          
          <label className="block text-[10px] font-bold uppercase text-zinc-500">Upload PDF/EPUB</label>
          <input required type="file" accept=".pdf,.epub" onChange={(e)=>setFile(e.target.files[0])} className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm" />

          <input required type="number" placeholder="Price (USD)" onChange={(e)=>setUsdPrice(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg" />
          <input required type="text" placeholder="BCH Wallet" onChange={(e)=>setWallet(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg" />
          
          <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-dashed border-zinc-700">
             <span className="text-xs font-bold uppercase">Viral Mode (10%)</span>
             <input type="checkbox" checked={enableAffiliate} onChange={(e)=>setEnableAffiliate(e.target.checked)} className="accent-green-500" />
          </div>

          <button type="submit" disabled={uploading} className="w-full bg-green-600 py-4 rounded-xl font-black uppercase hover:bg-green-500 disabled:opacity-50">
             {uploading ? "Publishing to IPFS..." : "Create Link"}
          </button>

          {generatedLink && <div className="p-4 bg-black rounded-lg border border-green-500/30 break-all text-[10px] font-mono text-green-500">{generatedLink}</div>}
       </form>
    </div>
  );
}
