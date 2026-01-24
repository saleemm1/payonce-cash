'use client';
import { useState } from 'react';
export default function ActivateCardPage() {
  const [sellerWallet, setSellerWallet] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [price, setPrice] = useState('0.01');
  const [productName, setProductName] = useState('');
  const generateLink = () => {
    if (!sellerWallet || !productName || !sellerEmail) return alert("Please fill required fields!");
    const baseUrl = window.location.origin + '/unlock';
    const params = new URLSearchParams({ name: productName, price, wallet: sellerWallet, seller: sellerName || 'Card Vendor', email: sellerEmail, preview: previewLink, aff: 'true' });
    navigator.clipboard.writeText(`${baseUrl}?${params.toString()}`);
    alert("Activation Card Link Copied!");
  };
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#18181b] p-8 rounded-3xl border border-white/10 shadow-2xl">
        <h1 className="text-2xl font-black mb-6 text-center uppercase tracking-tighter text-blue-500">App Activation Cards 💳</h1>
        <div className="space-y-4">
          <input placeholder="Card Type (e.g. Netflix 1 Month)" onChange={(e)=>setProductName(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all" />
          <input placeholder="Price in BCH" onChange={(e)=>setPrice(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500" />
          <input placeholder="Vendor Name" onChange={(e)=>setSellerName(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500" />
          <input placeholder="Support Email" onChange={(e)=>setSellerEmail(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500" />
          <input placeholder="BCH Wallet Address" onChange={(e)=>setSellerWallet(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500" />
          <input placeholder="Card Preview URL" onChange={(e)=>setPreviewLink(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500" />
          <button onClick={generateLink} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all uppercase">Generate Card Link</button>
        </div>
      </div>
    </div>
  );
}
