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
  const [enablePromo, setEnablePromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('');

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
        
        if (!json.ipfsHash) throw new Error("Upload Failed");
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
        d: productDesc, pr: finalPreview, dt: invoiceType === 'retail' ? 'text' : deliveryType, ty: invoiceType,
        pc: enablePromo && promoCode && promoDiscount ? { code: promoCode.toUpperCase(), discount: promoDiscount } : null
      };

      const encodedId = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      setGeneratedLink(`${window.location.origin}/unlock?id=${encodedId}`);
      
      const history = JSON.parse(localStorage.getItem('payonce_history') || '[]');
      history.push({ title: productName, price: usdPrice + ' USD', url: `${window.location.origin}/unlock?id=${encodedId}` });
      localStorage.setItem('payonce_history', JSON.stringify(history));

    } catch (err) {
      alert("Error generating invoice");
    } finally {
      setUploading(false);
    }
  };

  const inputBaseStyles = "w-full p-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-300 placeholder:text-zinc-600 hover:bg-zinc-900/80 hover:border-zinc-600";

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-12 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-600/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-500/5 rounded-full blur-[128px] pointer-events-none"></div>

      <form onSubmit={handleGenerate} className="relative z-10 w-full max-w-lg bg-[#18181b]/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/5 shadow-2xl shadow-black/50 space-y-5 transform transition-all hover:border-white/10">
        
        <div className="grid grid-cols-3 gap-2 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
          <button type="button" onClick={() => setInvoiceType('retail')} className={`py-3 text-[9px] font-black uppercase rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${invoiceType === 'retail' ? 'bg-gradient-to-br from-green-600 to-green-500 text-black shadow-lg shadow-green-900/20 scale-105' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}>
            <span className="text-lg">🏪</span> Retail / POS
          </button>
          <button type="button" onClick={() => setInvoiceType('personal')} className={`py-3 text-[9px] font-black uppercase rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${invoiceType === 'personal' ? 'bg-gradient-to-br from-green-600 to-green-500 text-black shadow-lg shadow-green-900/20 scale-105' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}>
            <span className="text-lg">👤</span> Freelance
          </button>
          <button type="button" onClick={() => setInvoiceType('digital')} className={`py-3 text-[9px] font-black uppercase rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${invoiceType === 'digital' ? 'bg-gradient-to-br from-green-600 to-green-500 text-black shadow-lg shadow-green-900/20 scale-105' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}>
            <span className="text-lg">📦</span> Digital Shop
          </button>
        </div>

        <div className="text-center mb-2">
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter drop-shadow-sm">
            {invoiceType === 'retail' && <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Quick Bill</span>}
            {invoiceType === 'personal' && <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Personal Invoice</span>}
            {invoiceType === 'digital' && <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Sell Digital Asset</span>}
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
            {invoiceType === 'retail' && "For Restaurants, Cafes & Stores"}
            {invoiceType === 'personal' && "For Services & Contractors"}
            {invoiceType === 'digital' && "For Files, Codes & Content"}
          </p>
        </div>
        
        <div className="space-y-3">
          <input required type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className={inputBaseStyles} placeholder={invoiceType === 'retail' ? "Item Name (e.g. Lunch Combo)" : "Invoice Title"} />
          
          {invoiceType === 'personal' && (
            <input required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={`${inputBaseStyles} animate-in fade-in slide-in-from-top-1`} placeholder="Customer Name (Bill To)" />
          )}

          {invoiceType === 'retail' && (
            <input type="text" value={orderRef} onChange={(e) => setOrderRef(e.target.value)} className={`${inputBaseStyles} animate-in fade-in slide-in-from-top-1`} placeholder="Table # / Order ID / Student ID (Optional)" />
          )}
        </div>

        <textarea required value={productDesc} onChange={(e) => setProductDesc(e.target.value)} className={`${inputBaseStyles} h-24 resize-none`} placeholder={invoiceType === 'retail' ? "Order details, items list..." : "Description, Terms & Conditions..."}></textarea>

        {invoiceType !== 'retail' && (
          <div className="animate-in fade-in slide-in-from-top-2">
             <div className="flex bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-700/50 gap-2 mb-3 backdrop-blur-sm">
               <button type="button" onClick={() => setDeliveryType('file')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all duration-300 ${deliveryType === 'file' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>Upload File</button>
               <button type="button" onClick={() => setDeliveryType('link')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all duration-300 ${deliveryType === 'link' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>Secret Link/Text</button>
             </div>

             {deliveryType === 'file' ? (
                <div className="bg-zinc-900/30 p-3 rounded-xl border border-dashed border-zinc-700 group hover:border-green-500/50 transition-colors">
                    <input type="file" onChange={(e)=>setFile(e.target.files[0])} className="w-full text-xs text-zinc-400 file:bg-green-600 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-black file:mr-3 cursor-pointer hover:file:bg-green-500 file:transition-colors" />
                </div>
             ) : (
               <input required type="text" value={linkOrText} onChange={(e)=>setLinkOrText(e.target.value)} className={inputBaseStyles} placeholder="Paste Secure Link or Content" />
             )}
          </div>
        )}

        {(invoiceType === 'digital' || invoiceType === 'retail') && (
          <div className="p-4 bg-zinc-800/20 rounded-xl border border-white/5 animate-in fade-in space-y-2">
            <label className="text-[9px] text-zinc-400 block uppercase font-black tracking-wider text-center">
              {invoiceType === 'retail' ? 'Cover Image (Menu/Shop Logo) - Optional' : 'Cover Preview - Required'}
            </label>
            <div className="flex gap-2 items-center">
              <input type="file" accept="image/*" onChange={(e)=>setPreviewFile(e.target.files[0])} className="w-1/2 text-[10px] text-zinc-500 file:bg-zinc-700 file:text-white file:border-0 file:rounded-lg file:px-2 file:hover:bg-zinc-600 cursor-pointer transition-colors" />
              <input type="url" value={previewLink} onChange={(e)=>setPreviewLink(e.target.value)} placeholder="Or Image URL" className={`${inputBaseStyles} py-2 text-xs`} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <input required type="text" placeholder="Merchant Name" onChange={(e)=>setSellerName(e.target.value)} className={inputBaseStyles} />
          <input required type="email" placeholder="Email " onChange={(e)=>setSellerEmail(e.target.value)} className={inputBaseStyles} />
        </div>

        <div className="relative bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 group">
          <div className="absolute -top-3 left-4 bg-[#18181b] px-2 text-[9px] text-green-500 font-black uppercase tracking-widest z-10 border border-zinc-800 rounded-full">Total Amount</div>
          <div className="relative flex items-center">
            <span className="absolute left-5 text-white font-black text-lg pointer-events-none">$</span>
            <input required type="number" step="any" value={usdPrice} onChange={(e) => setUsdPrice(e.target.value)} className="w-full p-4 pl-10 bg-zinc-900 border border-zinc-700 rounded-xl text-white outline-none focus:border-green-500 text-2xl font-black transition-all group-hover:border-green-500/50 shadow-inner" />
            <div className="absolute right-5 text-right pointer-events-none">
               <span className="block text-[10px] text-zinc-500 font-black">APPROX BCH</span>
               <span className="block text-sm text-green-500 font-mono font-bold bg-zinc-800 px-2 rounded">{bchPreview}</span>
            </div>
          </div>
        </div>

        <input required type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className={`${inputBaseStyles} text-xs font-mono text-center tracking-tight`} placeholder="Your BCH Wallet Address (bitcoincash:qp...)" />

        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-4 rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 transition-colors flex flex-col gap-3 group">
            <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-sm font-bold uppercase italic text-white flex items-center gap-2">Promo Code {enablePromo && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}</h3>
                   <p className="text-[9px] text-zinc-500 group-hover:text-zinc-400 transition-colors">Offer a secret discount</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" checked={enablePromo} onChange={(e) => setEnablePromo(e.target.checked)} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-500 right-5 border-zinc-600 transition-all duration-300"/>
                    <label className="toggle-label block overflow-hidden h-5 rounded-full bg-zinc-700 cursor-pointer"></label>
                </div>
            </div>
            {enablePromo && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <input type="text" maxLength={5} placeholder="CODE" value={promoCode} onChange={(e)=>setPromoCode(e.target.value.toUpperCase())} className="flex-1 p-2 bg-black/50 border border-zinc-700 rounded-lg text-xs text-white uppercase outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 tracking-widest font-bold" />
                    <input type="number" placeholder="%" min="1" max="100" value={promoDiscount} onChange={(e)=>setPromoDiscount(e.target.value)} className="w-20 p-2 bg-black/50 border border-zinc-700 rounded-lg text-xs text-white outline-none focus:border-green-500 text-center font-bold" />
                </div>
            )}
        </div>

        {invoiceType === 'digital' && (
           <div className="bg-gradient-to-r from-zinc-900 to-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 flex items-center justify-between hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300 animate-in fade-in">
             <div>
               <h3 className="text-xs font-black uppercase text-white flex items-center gap-1">Viral Mode 🚀</h3>
               <p className="text-[9px] text-zinc-400 mt-0.5">10% Commission</p>
             </div>
             <input type="checkbox" checked={enableAffiliate} onChange={(e) => setEnableAffiliate(e.target.checked)} className="w-5 h-5 accent-green-500 cursor-pointer rounded bg-zinc-700 border-zinc-600 focus:ring-green-500 focus:ring-offset-zinc-900" />
           </div>
        )}

        <button type="submit" disabled={uploading} className="w-full relative overflow-hidden group bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black py-5 rounded-2xl font-black transition-all uppercase italic text-xl shadow-[0_10px_40px_rgba(22,163,74,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95">
          <span className="relative z-10 flex items-center justify-center gap-2 text-white shadow-black drop-shadow-md">
             {uploading ? (
                <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Creating Bill...
                </>
             ) : invoiceType === 'retail' ? "Generate Quick Bill ⚡" : "Create Invoice"}
          </span>
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
        </button>

        {generatedLink && (
          <div className="mt-4 p-4 bg-black/80 rounded-2xl border border-green-500/30 flex flex-col gap-2 animate-in slide-in-from-bottom-5 shadow-lg shadow-green-900/10">
            <span className="text-[9px] text-green-500 uppercase font-black tracking-widest text-center">Payment Link Ready</span>
            <div className="flex gap-2">
               <input readOnly value={generatedLink} className="flex-1 bg-zinc-900/50 p-3 text-[10px] rounded-xl border border-zinc-800 outline-none text-zinc-300 font-mono text-center tracking-tight" />
               <button type="button" onClick={()=>{navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className={`px-4 rounded-xl text-lg font-bold transition-all duration-200 ${copied ? 'bg-green-500 text-white' : 'bg-zinc-800 text-green-500 hover:bg-zinc-700'}`}>
                   {copied ? '✅' : '📋'}
               </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
