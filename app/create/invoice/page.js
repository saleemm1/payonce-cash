'use client';
import { useState, useEffect } from 'react';

export default function InvoiceUploadPage() {
  const [invoiceType, setInvoiceType] = useState('personal'); 
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [orderRef, setOrderRef] = useState(''); 
  const [productDesc, setProductDesc] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [usdPrice, setUsdPrice] = useState(12.50);
  const [wallet, setWallet] = useState('');
  const [bchPreview, setBchPreview] = useState('0.00');
  const [deliveryType, setDeliveryType] = useState('receipt'); 
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
    if (invoiceType === 'personal') {
      setEnableAffiliate(false);
      setDeliveryType('link');
    } else if (invoiceType === 'retail') {
      setEnableAffiliate(false); 
      setDeliveryType('receipt'); 
    } else {
      setDeliveryType('file');
    }
  }, [invoiceType]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (invoiceType === 'digital' && !previewLink && !previewFile) {
      return alert("Preview Link or File is required for Digital Products");
    }
    
    setUploading(true);
    try {
      let assetId = linkOrText;
      let originalFileName = "";

      if (invoiceType === 'retail') {
        assetId = `OFFICIAL RECEIPT\nOrder Ref: ${orderRef || 'N/A'}\nItem: ${productName}\nStatus: PAID ✅\n\nPlease show this screen to the vendor.`;
        originalFileName = "Proof_of_Payment.txt";
      } 
      else if (deliveryType === 'file' && file) {
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
        cn: invoiceType === 'personal' ? customerName : (orderRef ? `Ref: ${orderRef}` : ''), 
        d: productDesc, pr: finalPreview, dt: invoiceType === 'retail' ? 'text' : deliveryType, ty: invoiceType
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
      <form onSubmit={handleGenerate} className="w-full max-w-md bg-[#18181b] p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-5">
        
        <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
          <button type="button" onClick={() => setInvoiceType('retail')} className={`py-3 text-[9px] font-black uppercase rounded-xl transition-all flex flex-col items-center gap-1 ${invoiceType === 'retail' ? 'bg-green-600 text-black shadow-lg scale-105' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <span className="text-sm">🏪</span> Retail / POS
          </button>
          <button type="button" onClick={() => setInvoiceType('personal')} className={`py-3 text-[9px] font-black uppercase rounded-xl transition-all flex flex-col items-center gap-1 ${invoiceType === 'personal' ? 'bg-green-600 text-black shadow-lg scale-105' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <span className="text-sm">👤</span> Freelance
          </button>
          <button type="button" onClick={() => setInvoiceType('digital')} className={`py-3 text-[9px] font-black uppercase rounded-xl transition-all flex flex-col items-center gap-1 ${invoiceType === 'digital' ? 'bg-green-600 text-black shadow-lg scale-105' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <span className="text-sm">📦</span> Digital Shop
          </button>
        </div>

        <div className="text-center mb-2">
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            {invoiceType === 'retail' && <span className="text-green-500">Quick Bill</span>}
            {invoiceType === 'personal' && <span className="text-green-500">Personal Invoice</span>}
            {invoiceType === 'digital' && <span className="text-green-500">Sell Digital Asset</span>}
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
            {invoiceType === 'retail' && "For Restaurants, Cafes & Stores"}
            {invoiceType === 'personal' && "For Services & Contractors"}
            {invoiceType === 'digital' && "For Files, Codes & Content"}
          </p>
        </div>
        
        <div className="space-y-3">
          <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 transition-all font-bold placeholder:font-medium" placeholder={invoiceType === 'retail' ? "Item Name (e.g. Lunch Combo)" : "Invoice Title"} />
          
          {invoiceType === 'personal' && (
            <input required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 transition-all animate-in fade-in" placeholder="Customer Name (Bill To)" />
          )}

          {invoiceType === 'retail' && (
            <input type="text" value={orderRef} onChange={(e) => setOrderRef(e.target.value)} className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 transition-all animate-in fade-in" placeholder="Table # / Order ID / Student ID (Optional)" />
          )}
        </div>

        <textarea required value={productDesc} onChange={(e) => setProductDesc(e.target.value)} className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 h-24 text-sm resize-none" placeholder={invoiceType === 'retail' ? "Order details, items list..." : "Description, Terms & Conditions..."}></textarea>

        {invoiceType !== 'retail' && (
          <div className="animate-in fade-in slide-in-from-top-2">
             <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-700 gap-1 mb-3">
               <button type="button" onClick={() => setDeliveryType('file')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${deliveryType === 'file' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>Upload File</button>
               <button type="button" onClick={() => setDeliveryType('link')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${deliveryType === 'link' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>Secret Link/Text</button>
             </div>

             {deliveryType === 'file' ? (
               <input type="file" onChange={(e)=>setFile(e.target.files[0])} className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-400 file:bg-green-600 file:text-black file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-black file:mr-3 cursor-pointer" />
             ) : (
               <input required type="text" value={linkOrText} onChange={(e)=>setLinkOrText(e.target.value)} className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 text-sm" placeholder="Paste Secure Link or Content" />
             )}
          </div>
        )}

        {(invoiceType === 'digital' || invoiceType === 'retail') && (
          <div className="p-4 bg-zinc-800/30 rounded-xl border border-white/5 animate-in fade-in">
            <label className="text-[9px] text-zinc-400 mb-2 block uppercase font-black tracking-wider">
              {invoiceType === 'retail' ? 'Cover Image (Menu/Shop Logo) - Optional' : 'Cover Preview - Required'}
            </label>
            <div className="flex gap-2">
              <input type="file" accept="image/*" onChange={(e)=>setPreviewFile(e.target.files[0])} className="w-1/2 text-[10px] text-zinc-500 file:bg-zinc-700 file:text-white file:border-0 file:rounded-lg file:px-2 cursor-pointer" />
              <input type="url" value={previewLink} onChange={(e)=>setPreviewLink(e.target.value)} placeholder="Or Image URL" className="w-1/2 p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs outline-none focus:border-green-500" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <input required type="text" placeholder="Merchant Name" onChange={(e)=>setSellerName(e.target.value)} className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 transition-all text-sm" />
          <input required type="email" placeholder="Email (For Notifications)" onChange={(e)=>setSellerEmail(e.target.value)} className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 transition-all text-sm" />
        </div>

        <div className="relative group">
          <div className="absolute -top-2 left-4 bg-[#18181b] px-2 text-[9px] text-green-500 font-black uppercase tracking-widest z-10">Total Amount</div>
          <div className="relative flex items-center">
            <span className="absolute left-5 text-white font-black text-lg">$</span>
            <input required type="number" step="any" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className="w-full p-5 pl-10 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 text-2xl font-black transition-all group-hover:border-green-500/50" />
            <div className="absolute right-5 text-right">
               <span className="block text-[10px] text-zinc-500 font-black">APPROX BCH</span>
               <span className="block text-sm text-green-500 font-mono font-bold">{bchPreview}</span>
            </div>
          </div>
        </div>

        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 transition-all text-xs font-mono text-center tracking-tight" placeholder="Your BCH Wallet Address (bitcoincash:qp...)" />

        {invoiceType === 'digital' && (
           <div className="bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-700 flex items-center justify-between animate-in fade-in">
             <div>
               <h3 className="text-xs font-black uppercase text-white">Viral Mode 🚀</h3>
               <p className="text-[9px] text-zinc-500">10% Commission · 5% Discount</p>
             </div>
             <input type="checkbox" checked={enableAffiliate} onChange={(e) => setEnableAffiliate(e.target.checked)} className="w-5 h-5 accent-green-500 cursor-pointer" />
           </div>
        )}

        <button type="submit" disabled={uploading} className="w-full bg-green-600 hover:bg-green-500 text-black py-5 rounded-2xl font-black transition-all uppercase italic text-xl shadow-[0_10px_40px_rgba(22,163,74,0.3)] disabled:opacity-50 hover:scale-[1.02] active:scale-95">
          {uploading ? "Creating Bill..." : invoiceType === 'retail' ? "Generate Quick Bill ⚡" : "Create Invoice"}
        </button>

        {generatedLink && (
          <div className="mt-4 p-4 bg-black/80 rounded-2xl border border-green-500/30 flex flex-col gap-2 animate-in slide-in-from-bottom-5">
            <span className="text-[9px] text-green-500 uppercase font-black tracking-widest text-center">Payment Link Ready</span>
            <div className="flex gap-2">
               <input readOnly value={generatedLink} className="flex-1 bg-zinc-900 p-3 text-[10px] rounded-xl border border-zinc-800 outline-none text-zinc-300 font-mono text-center" />
               <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="bg-zinc-800 hover:bg-zinc-700 px-4 rounded-xl text-lg font-bold text-green-500 transition-all">{copied ? '✅' : '📋'}</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
