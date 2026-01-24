'use client';

import { useState } from 'react';

export default function CreateTypePage({ params }) {
  const [fileName, setFileName] = useState('');
  const [wallet, setWallet] = useState('');
  const [generated, setGenerated] = useState(false);
  
  // --- هذا هو الـ State الخاص بزر التفعيل ---
  const [enableAffiliate, setEnableAffiliate] = useState(true); 

  // هذا السعر افتراضي، يمكنك تغييره أو جعله قابلاً للتعديل
  const price = 0.0001; 
  const linkId = Math.random().toString(36).substring(2, 9);
  
  // دمج خيار الأفلييت داخل الرابط الناتج
  const demoLink = `/unlock/${linkId}?wallet=${wallet}&price=${price}&aff=${enableAffiliate}`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
      
      {/* عنوان الصفحة يتغير حسب نوع الرابط (Video, PDF, Ticket...) */}
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 capitalize">
        Create {params.type.replace('-', ' ')} Link
      </h1>

      <div className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        
        {/* حقول الإدخال الأساسية */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Content Title</label>
            <input
              type="text"
              placeholder={`Name of your ${params.type.replace('-', ' ')}`}
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-black border border-zinc-700 focus:border-green-500 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Your BCH Wallet</label>
            <input
              type="text"
              placeholder="bitcoincash:q..."
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-black border border-zinc-700 focus:border-green-500 outline-none transition font-mono text-sm"
            />
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* 👇👇👇 هنا زر تفعيل ميزة النمو الفيروسي (Affiliate) 👇👇👇 */}
        {/* ------------------------------------------------------- */}
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-700 mb-6 hover:border-green-500/50 transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Viral Growth Mode 🚀
              </h3>
              <p className="text-[10px] text-zinc-400 mt-1">
                Allow buyers to share & earn 10% commission.
              </p>
            </div>
            
            {/* زر الـ Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={enableAffiliate}
                onChange={(e) => setEnableAffiliate(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
          
          {/* رسالة تظهر فقط عند التفعيل */}
          {enableAffiliate && (
            <div className="mt-3 pt-3 border-t border-zinc-800">
               <p className="text-[10px] text-green-400">
                 ✓ Your product will include an integrated affiliate dashboard for buyers.
               </p>
            </div>
          )}
        </div>
        {/* ------------------------------------------------------- */}


        <div className="flex items-center justify-between mb-8 px-2">
          <span className="text-zinc-400">Price</span>
          <span className="text-xl font-bold text-green-400">{price} BCH</span>
        </div>

        <button
          onClick={() => setGenerated(true)}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-all transform active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
        >
          Generate {params.type.replace('-', ' ')} Link
        </button>
      </div>

      {/* النتيجة بعد الضغط */}
      {generated && (
        <div className="mt-8 w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-[#18181b] p-6 rounded-xl border border-green-500/30">
            <p className="text-center text-zinc-400 text-sm mb-3">Share this link to sell:</p>
            
            <div className="flex gap-2 mb-3">
              <code className="flex-1 bg-black p-3 rounded-lg text-green-500 font-mono text-xs break-all border border-zinc-800">
                {typeof window !== 'undefined' ? window.location.origin : ''}{demoLink}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}${demoLink}`)}
                className="bg-zinc-800 hover:bg-zinc-700 px-4 rounded-lg text-white text-sm font-bold transition"
              >
                Copy
              </button>
            </div>

            {/* علامة تبين أن الميزة مفعلة في الرابط */}
            {enableAffiliate ? (
               <div className="text-center">
                 <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">
                   ⚡ Viral Mode Active
                 </span>
               </div>
            ) : (
               <div className="text-center">
                 <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-1 rounded border border-zinc-700">
                   Standard Mode
                 </span>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}