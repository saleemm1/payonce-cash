'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function UnlockContent() {
  const searchParams = useSearchParams();
  const [isPaid, setIsPaid] = useState(false);
  const [checking, setChecking] = useState(false);
  const [buyerWallet, setBuyerWallet] = useState('');
  const [referralLink, setReferralLink] = useState('');

  const productName = searchParams.get('name') || 'Premium Content';
  const price = parseFloat(searchParams.get('price') || '0.0001');
  const sellerWallet = searchParams.get('wallet') || '';
  const refWallet = searchParams.get('ref') || null;
  const isAffiliateEnabled = searchParams.get('aff') === 'true';

  const affiliateShare = (price * 0.1).toFixed(8);
  const sellerShare = (price * 0.9).toFixed(8);

  useEffect(() => {
    let interval;
    if (checking && !isPaid && sellerWallet) {
      interval = setInterval(async () => {
        try {
          const cleanAddr = sellerWallet.includes(':') ? sellerWallet.split(':')[1] : sellerWallet;
          const res = await fetch(`https://rest.mainnet.cash/v1/address/balance/${cleanAddr}`);
          const data = await res.json();
          if (data.unconfirmed >= 0 || data.confirmed > 0) {
            setIsPaid(true);
            setChecking(false);
          }
        } catch (err) { console.error("Scanning...", err); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [checking, isPaid, sellerWallet]);

  const generateMyRefLink = () => {
    if(!buyerWallet) return alert("Please enter your BCH address first!");
    const baseUrl = window.location.href.split('?')[0];
    const link = `${baseUrl}?name=${encodeURIComponent(productName)}&price=${price}&wallet=${sellerWallet}&ref=${buyerWallet}&aff=true`;
    setReferralLink(link);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-8 font-sans">
      {!isPaid ? (
        <div className="w-full max-w-md bg-[#18181b] p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="text-center mb-6">
             <h2 className="text-zinc-500 text-xs uppercase tracking-widest mb-1 font-bold">Secure Checkout</h2>
             <h1 className="text-3xl font-black text-white capitalize">{productName}</h1>
          </div>

          {refWallet && (
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl mb-6">
              <p className="text-green-500 text-[11px] font-bold text-center uppercase mb-2 italic">Viral Reward Active 🚀</p>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Seller Share:</span>
                <span>{sellerShare} BCH</span>
              </div>
              <div className="flex justify-between text-xs font-mono mt-1">
                <span className="text-zinc-400">Affiliate Bonus:</span>
                <span className="text-purple-400">{affiliateShare} BCH</span>
              </div>
            </div>
          )}

          <div className="flex justify-center mb-6 relative group">
            <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=bitcoincash:${sellerWallet.replace('bitcoincash:', '')}?amount=${price}`} 
                alt="BCH QR" 
              />
            </div>
            {checking && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-xs font-black text-green-500 tracking-tighter animate-pulse">VERIFYING ON CHAIN...</p>
              </div>
            )}
          </div>

          <div className="text-center mb-6 py-4 bg-zinc-900/50 rounded-2xl border border-white/5">
            <p className="text-zinc-400 text-xs font-bold uppercase mb-1">Amount to Pay</p>
            <p className="text-4xl font-black text-green-500 tracking-tight">{price} <span className="text-lg">BCH</span></p>
            <p className="text-[10px] text-zinc-600 mt-1 uppercase font-bold">Network Fees Included</p>
          </div>

          <button 
            onClick={() => setChecking(true)}
            disabled={checking}
            className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(22,163,74,0.2)] mb-4 uppercase tracking-tighter text-lg disabled:opacity-50"
          >
            {checking ? 'Checking Transaction...' : 'I Have Paid'}
          </button>

          <div className="bg-black/40 p-3 rounded-xl border border-zinc-800 flex justify-between items-center group">
             <span className="text-[9px] text-zinc-500 font-mono truncate w-4/5 uppercase tracking-tighter">{sellerWallet}</span>
             <button onClick={() => {navigator.clipboard.writeText(sellerWallet); alert("Address Copied!")}} className="text-[10px] text-green-500 font-black hover:text-white transition-colors">COPY</button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="bg-[#18181b] p-10 rounded-3xl border border-green-500/30 text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl animate-bounce">💎</span>
            </div>
            <h1 className="text-3xl font-black mb-2 text-white">Payment Success!</h1>
            <p className="text-zinc-400 text-sm mb-8 font-medium italic leading-relaxed">Your transaction was verified on the Bitcoin Cash network. Access your content below.</p>
            <button className="w-full bg-white text-black py-5 rounded-2xl font-black hover:bg-green-500 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] uppercase">
              Download Content Now
            </button>
          </div>

          {isAffiliateEnabled && (
            <div className="bg-zinc-900 border border-purple-500/30 p-8 rounded-3xl text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-3">
                <span className="bg-purple-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">Viral Mode</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-purple-400 font-black text-xl mb-2 italic uppercase tracking-tighter text-shadow-sm">Want to earn Cash?</h3>
                <p className="text-zinc-400 text-xs mb-6 font-medium">Earn <span className="text-white font-black underline">10% instant commission</span> every time someone buys this product using your link.</p>
                
                {!referralLink ? (
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Enter Your BCH Wallet Address" 
                      value={buyerWallet}
                      onChange={(e) => setBuyerWallet(e.target.value)}
                      className="w-full bg-black border-2 border-zinc-800 rounded-2xl p-4 text-xs text-center outline-none focus:border-purple-600 transition-all font-mono"
                    />
                    <button 
                      onClick={generateMyRefLink}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-2xl text-sm transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(147,51,234,0.3)] uppercase"
                    >
                      Generate My Affiliate Link
                    </button>
                  </div>
                ) : (
                  <div className="bg-black p-5 rounded-2xl border-2 border-dashed border-purple-500/50">
                    <p className="text-[10px] text-purple-400 font-black mb-3 uppercase tracking-widest">Share this Link to Earn</p>
                    <div className="bg-zinc-800 p-3 rounded-xl mb-4 select-all">
                       <code className="block text-[10px] text-zinc-200 break-all font-mono leading-tight">{referralLink}</code>
                    </div>
                    <button 
                      onClick={() => {navigator.clipboard.writeText(referralLink); alert("Link Copied! Start sharing.")}}
                      className="w-full bg-white text-black text-[11px] font-black py-3 rounded-xl hover:bg-purple-500 hover:text-white transition-all uppercase"
                    >
                      Copy Link & Start Earning
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function UnlockPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center font-black animate-pulse uppercase tracking-[0.2em]">
        Initializing Secure Gateway...
      </div>
    }>
      <UnlockContent />
    </Suspense>
  );
}