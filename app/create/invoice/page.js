'use client';
import { useState, useEffect } from 'react';

export default function InvoiceUploadPage() {
  const [invoiceType, setInvoiceType] = useState('personal');
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [usdPrice, setUsdPrice] = useState(125.75);
  const [wallet, setWallet] = useState('');
  const [bchPreview, setBchPreview] = useState('0.00');
  const [deliveryType, setDeliveryType] = useState('file');
  const [file, setFile] = useState(null);
  const [linkOrText, setLinkOrText] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [previewLink, setPreviewLink] = useState('');
  const [enableAffiliate, setEnableAffiliate] = useState(false);
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
      } catch (e) {}
    };
    getBCH();
  }, [usdPrice]);

  useEffect(() => {
    if (invoiceType === 'personal') setEnableAffiliate(false);
  }, [invoiceType]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (invoiceType === 'public' && !previewLink && !previewFile) {
      return alert("Preview Link or File is required for Public Invoices");
    }
    setUploading(true);
    try {
      let assetId = linkOrText;
      let originalFileName = "";

      if (deliveryType === 'file' && file) {
        originalFileName = file.name;
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await res.json();
        assetId = json.ipfsHash;
      }

      let finalPreview = previewLink;
      if (previewFile) {
        const imgData = new FormData();
        imgData.append("file", previewFile);
        const imgRes = await fetch("/api/upload", { method: "POST", body: imgData });
        const imgJson = await imgRes.json();
        finalPreview = `https://gateway.pinata.cloud/ipfs/${imgJson.ipfsHash}`;
      }

      const payload = {
        w: wallet, p: usdPrice, n: productName, sn: sellerName,
        se: sellerEmail, i: assetId, fn: originalFileName, a: enableAffiliate,
        cn: invoiceType === 'personal' ? customerName : '', 
        d: productDesc, pr: finalPreview, dt: deliveryType, ty: invoiceType
      };

      const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      setGeneratedLink(`${window.location.origin}/unlock?id=${encodedId}`);
    } catch (err) {
      alert("Error generating invoice");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 py-10 font-sans">
      <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-4">
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 mb-2">
          <button type="button" onClick={() => setInvoiceType('personal')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${invoiceType === 'personal' ? 'bg-green-600 text-white shadow-lg' : 'text-zinc-500'}`}>Personal (1-on-1)</button>
          <button type="button" onClick={() => setInvoiceType('public')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${invoiceType === 'public' ? 'bg-green-600 text-white shadow-lg' : 'text-zinc-500'}`}>Public Shop</button>
        </div>

        <h1 className="text-2xl font-bold text-center text-green-500 uppercase italic font-black tracking-tighter">
          {invoiceType === 'personal' ? 'Personal Invoice' : 'Public Digital Invoice'}
        </h1>
        
        <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 transition-all placeholder:text-zinc-600" placeholder="Product / Invoice Title" />
        
        {invoiceType === 'personal' && (
          <input required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 transition-all animate-in fade-in" placeholder="Bill To (Customer Name)" />
        )}

        <textarea required value={productDesc} onChange={(e) => setProductDesc(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 h-20 text-sm" placeholder="Details & Terms..."></textarea>

        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-700 gap-1">
          <button type="button" onClick={() => setDeliveryType('file')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-md transition-all ${deliveryType === 'file' ? 'bg-green-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Asset File</button>
          <button type="button" onClick={() => setDeliveryType('link')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-md transition-all ${deliveryType === 'link' ? 'bg-green-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Link/Text</button>
        </div>

        {deliveryType === 'file' ? (
          <input type="file" onChange={(e)=>setFile(e.target.files[0])} className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-gray-300 file:bg-green-600 cursor-pointer" />
        ) : (
          <input required type="text" value={linkOrText} onChange={(e)=>setLinkOrText(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 text-sm" placeholder="Paste Delivery Link or Text" />
        )}

        <div className="p-3 bg-zinc-800/30 rounded-lg border border-white/5">
          <label className="text-[10px] text-zinc-400 mb-2 block uppercase text-center font-black">
            Preview {invoiceType === 'public' ? '(Required)' : '(Optional)'}
          </label>
          <input type="file" accept="image/*,.pdf" onChange={(e)=>setPreviewFile(e.target.files[0])} className="w-full text-xs text-zinc-500 mb-2" />
          <input type="url" value={previewLink} onChange={(e)=>setPreviewLink(e.target.value)} placeholder="Or Preview URL" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs outline-none focus:border-green-500" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input required type="text" placeholder="Seller Name" onChange={(e)=>setSellerName(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 transition-all" />
          <input required type="email" placeholder="Contact Email" onChange={(e)=>setSellerEmail(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 transition-all" />
        </div>

        <div className="relative">
          <label className="text-[10px] text-zinc-400 mb-1 block italic font-bold text-center">BCH Rate: {bchPreview}</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-green-500 font-black text-sm">USD</span>
            <input required type="number" step="any" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className="w-full p-3 pl-14 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 text-center font-black transition-all" />
          </div>
        </div>

        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-green-500 transition-all" placeholder="BCH Wallet Address" />

        <div className={`p-4 rounded-xl border border-dashed transition-all flex items-center justify-between ${invoiceType === 'personal' ? 'bg-zinc-900/20 border-zinc-800 opacity-50' : 'bg-zinc-900/50 border-zinc-700'}`}>
          <div>
  <h3 className="text-sm font-bold uppercase italic text-white">
    Viral Mode
  </h3>

  <p className="text-[9px] text-zinc-500 leading-tight">
    {invoiceType === 'personal'
      ? 'Disabled: Personal invoices cannot be viral'
      : '10% promoter commission · 5% buyer discount'}
  </p>

  {invoiceType !== 'personal' && (
    <p className="text-[8px] text-zinc-600">
      For every sale through the promoter
    </p>
  )}
</div>

          <input type="checkbox" disabled={invoiceType === 'personal'} checked={enableAffiliate} onChange={(e) => setEnableAffiliate(e.target.checked)} className="w-5 h-5 accent-green-500 cursor-pointer disabled:cursor-not-allowed" />
        </div>

        <button type="submit" disabled={uploading} className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-black transition-all uppercase italic text-lg shadow-lg disabled:opacity-50">
          {uploading ? "Processing..." : "Generate Invoice"}
        </button>

        {generatedLink && (
          <div className="mt-4 p-3 bg-black rounded-lg border border-green-500/30 flex gap-2">
            <input readOnly value={generatedLink} className="flex-1 bg-zinc-900 p-2 text-[10px] rounded border border-zinc-800 outline-none text-zinc-400 font-mono" />
            <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="bg-zinc-800 px-3 py-1 rounded text-xs font-bold text-green-500">{copied ? '✅' : 'Copy'}</button>
          </div>
        )}
      </form>
    </div>
  );
}
