'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateHubPage() {
  const [profile, setProfile] = useState({
    name: 'My Web3 Store',
    bio: 'Welcome to my decentralized storefront. Pay with BCH instantly.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PayOnce',
    twitter: '',
    website: ''
  });

  const [links, setLinks] = useState([
    { id: 1, title: 'Buy My E-Book', url: '', type: 'product' },
  ]);

  const [paymentStep, setPaymentStep] = useState('edit');
  const [finalCid, setFinalCid] = useState('');

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const addLink = () => {
    setLinks([...links, { id: Date.now(), title: 'New Link', url: '', type: 'product' }]);
  };

  const updateLink = (id, field, value) => {
    setLinks(links.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const removeLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const deployToIPFS = async () => {
    setPaymentStep('uploading');
    try {
      const payload = {
        type: "payonce_hub",
        profile,
        links,
        timestamp: Date.now()
      };

      const res = await fetch('/api/upload-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.cid) {
        setFinalCid(data.cid);
        setPaymentStep('success');
      } else {
        throw new Error("IPFS failed");
      }
    } catch (err) {
      alert("Deployment Failed. Please try again.");
      setPaymentStep('edit');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30 overflow-x-hidden">
      <nav className="border-b border-white/5 py-4 px-6 flex justify-between items-center max-w-7xl mx-auto">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-black font-black text-xs">HUB</div>
            <span className="font-bold text-lg tracking-tight">PayOnce <span className="text-zinc-500">Storefront</span></span>
         </div>
         <Link href="/">
            <button className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">Exit</button>
         </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className={`lg:col-span-7 space-y-8 transition-all duration-500 ${paymentStep !== 'edit' ? 'opacity-20 pointer-events-none blur-sm' : ''}`}>
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Build Your <span className="text-green-500">Identity.</span></h1>
            <p className="text-zinc-400 text-sm">Create a 100% stateless Web3 Linktree. One link for all your PayOnce products.</p>
          </div>

          <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest border-b border-white/5 pb-2">1. Profile Details</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <img src={profile.avatar} alt="Avatar" className="w-16 h-16 rounded-full border border-white/10 bg-black object-cover" />
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Avatar Image URL</label>
                  <input type="text" name="avatar" value={profile.avatar} onChange={handleProfileChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-green-500 transition-colors" placeholder="https://example.com/my-logo.png" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Store Name</label>
                <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-green-500 transition-colors" />
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Bio</label>
                <textarea name="bio" value={profile.bio} onChange={handleProfileChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-green-500 transition-colors resize-none h-20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">X (Twitter) URL</label>
                  <input type="text" name="twitter" value={profile.twitter} onChange={handleProfileChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-green-500 transition-colors" placeholder="https://x.com/..." />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Website URL</label>
                  <input type="text" name="website" value={profile.website} onChange={handleProfileChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-green-500 transition-colors" placeholder="https://..." />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest">2. Your Links</h3>
              <button onClick={addLink} className="text-[10px] font-black uppercase text-green-500 hover:text-white bg-green-500/10 px-3 py-1 rounded-full transition-colors">+ Add Link</button>
            </div>

            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={link.id} className="flex gap-3 items-start bg-black/30 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-500 shrink-0 mt-2">{index + 1}</div>
                  <div className="flex-1 space-y-3">
                    <input type="text" value={link.title} onChange={(e) => updateLink(link.id, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-1 text-sm text-white outline-none focus:border-green-500" placeholder="Link Title (e.g., Buy My E-Book)" />
                    <input type="text" value={link.url} onChange={(e) => updateLink(link.id, 'url', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-1 text-xs text-zinc-400 outline-none focus:border-green-500" placeholder="URL (e.g., https://payonce.cash/unlock?cid=...)" />
                  </div>
                  <button onClick={() => removeLink(link.id)} className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-500 hover:text-white transition-colors mt-1">✕</button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={deployToIPFS} disabled={links.length === 0} className="w-full bg-white text-black py-4 rounded-2xl hover:bg-zinc-200 hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center">
            <span className="font-black uppercase tracking-widest text-lg mb-1">Deploy Storefront</span>
            <span className="text-[10px] text-zinc-600 uppercase font-bold flex items-center gap-2">
              <del className="text-zinc-400">0.01 BCH</del> 
              <span className="text-green-600 bg-green-500/20 px-2 py-0.5 rounded-full">FREE (Hackathon & Public Beta)</span>
            </span>
          </button>
        </div>

        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div className="sticky top-12 w-[320px] h-[650px] bg-black border-[8px] border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col items-center relative z-10">
            <div className="absolute top-0 w-32 h-6 bg-zinc-800 rounded-b-2xl z-20"></div>
            
            <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-black p-6 overflow-y-auto custom-scrollbar flex flex-col items-center text-center pt-16">
              <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-black shadow-xl mb-4 transition-transform hover:scale-105 object-cover" />
              <h2 className="text-xl font-bold text-white mb-1">{profile.name || 'Store Name'}</h2>
              <p className="text-xs text-zinc-400 mb-6 px-4">{profile.bio || 'Your bio will appear here.'}</p>
              
              <div className="flex gap-4 mb-8">
                {profile.twitter && <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">𝕏</div>}
                {profile.website && <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">🌐</div>}
              </div>

              <div className="w-full space-y-3">
                {links.map(link => (
                  <div key={link.id} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-sm font-bold transition-all cursor-pointer hover:scale-[1.02] flex items-center justify-between">
                    <span className="truncate pr-2">{link.title || 'Untitled Link'}</span>
                    <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-1 rounded-md shrink-0">BCH</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-auto pt-8 pb-4 opacity-50 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                Powered by <span className="text-green-500">PayOnce</span>
              </div>
            </div>

            {paymentStep !== 'edit' && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                {paymentStep === 'uploading' && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-zinc-800 border-t-green-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-bold animate-pulse text-green-500">Pinning to IPFS...</p>
                    <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">Decentralizing Identity</p>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                      <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="font-black uppercase text-xl mb-2 text-white">Hub Deployed!</h3>
                    <p className="text-xs text-zinc-400 mb-6">Your Web3 Storefront is now live and immutable.</p>
                    <div className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 mb-6 relative group overflow-hidden">
                      <p className="text-[9px] text-zinc-500 uppercase font-bold mb-1">Your Hub URL</p>
                      <input readOnly value={`https://payonce.cash/hub?cid=${finalCid}`} className="w-full bg-transparent text-[10px] text-green-500 font-mono outline-none cursor-pointer" onClick={(e) => e.target.select()} />
                    </div>
                    <a href={`/hub?cid=${finalCid}`} target="_blank" className="w-full bg-white text-black font-black uppercase text-xs py-4 rounded-xl hover:bg-zinc-200 transition-colors block text-center">
                      Visit Storefront
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        </div>
      </main>
    </div>
  );
}
