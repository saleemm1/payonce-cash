'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function HubViewer() {
  const searchParams = useSearchParams();
  const cid = searchParams.get('cid');
  
  const [hubData, setHubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!cid) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchHub = async () => {
      try {
        const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
        const data = await res.json();
        if (data.type === 'payonce_hub') {
          setHubData(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHub();
  }, [cid]);

  const formatUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') || url.startsWith('mailto:') ? url : `https://${url}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: hubData?.profile?.name || 'PayOnce Hub',
      text: hubData?.profile?.bio || 'Check out my Web3 Storefront!',
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.log('Share dismissed'); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Hub Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Web3 Store...</p>
      </div>
    );
  }

  if (error || !hubData) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <p className="text-red-500 font-bold uppercase text-xl mb-2">Store Not Found</p>
        <p className="text-zinc-500 text-sm mb-6">Invalid CID or IPFS gateway issue.</p>
        <Link href="/">
          <button className="bg-white text-black px-6 py-2 rounded-xl font-bold">Go Home</button>
        </Link>
      </div>
    );
  }

  const themes = {
    green: { bg: 'bg-green-500', text: 'text-green-500', glow: 'bg-green-500/10', hoverText: 'hover:text-green-500', hoverGlow: 'hover:bg-green-500/20', hex: '#22c55e' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-500', glow: 'bg-blue-500/10', hoverText: 'hover:text-blue-500', hoverGlow: 'hover:bg-blue-500/20', hex: '#3b82f6' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-500', glow: 'bg-purple-500/10', hoverText: 'hover:text-purple-500', hoverGlow: 'hover:bg-purple-500/20', hex: '#a855f7' }
  };
  const currentTheme = themes[hubData.profile.theme] || themes.green;

  return (
    <div className={`min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden selection:${currentTheme.glow}`}>
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none opacity-50" style={{ backgroundColor: `${currentTheme.hex}20` }}></div>

      <div className="w-full max-w-md bg-black border border-white/10 rounded-[2rem] shadow-2xl p-8 flex flex-col items-center text-center animate-in slide-in-from-bottom-10 duration-700 relative">
        
        <button onClick={handleShare} className={`absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 ${currentTheme.hoverGlow} text-white ${currentTheme.hoverText} flex items-center justify-center transition-colors`} aria-label="Share Hub">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        </button>

        <img src={hubData.profile.avatar} alt="Avatar" className="w-28 h-28 rounded-full border-4 border-zinc-900 shadow-2xl mb-6 object-cover" />
        
        <h1 className="text-2xl font-black text-white mb-2">{hubData.profile.name}</h1>
        <p className="text-sm text-zinc-400 mb-8 leading-relaxed px-2">{hubData.profile.bio}</p>

        <div className="flex gap-4 mb-8">
          {hubData.profile.twitter && (
            <a href={formatUrl(hubData.profile.twitter)} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full bg-white/5 ${currentTheme.hoverGlow} text-white ${currentTheme.hoverText} flex items-center justify-center transition-colors`}>𝕏</a>
          )}
          {hubData.profile.website && (
            <a href={formatUrl(hubData.profile.website)} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full bg-white/5 ${currentTheme.hoverGlow} text-white ${currentTheme.hoverText} flex items-center justify-center transition-colors`}>🌐</a>
          )}
          {hubData.profile.email && (
            <a href={formatUrl(hubData.profile.email)} className={`w-10 h-10 rounded-full bg-white/5 ${currentTheme.hoverGlow} text-white ${currentTheme.hoverText} flex items-center justify-center transition-colors`}>✉️</a>
          )}
        </div>

        <div className="w-full space-y-4">
          {hubData.links.map((link) => {
            const isPayOnce = link.url.includes('payonce');
            return (
              <a key={link.id} href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer" className={`w-full border rounded-2xl p-4 font-bold transition-all flex items-center justify-between group ${isPayOnce ? `${currentTheme.glow} hover:brightness-110 text-white` : 'bg-white/5 hover:bg-white/20 border-white/10 text-white'}`} style={{ borderColor: isPayOnce ? `${currentTheme.hex}80` : '' }}>
                <span className="truncate pr-4">{link.title}</span>
                <div className="flex items-center gap-2">
                  {isPayOnce && <span className={`text-[10px] ${currentTheme.bg} text-black px-2 py-1 rounded-md shrink-0 font-black flex items-center gap-1 group-hover:scale-105 transition-transform`}>BCH ⚡</span>}
                  <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-12 pt-6 w-full border-t border-white/5 flex flex-col items-center gap-2">
          <div className="bg-white/5 rounded-full px-4 py-1.5 flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
             100% Non-Custodial <span className="w-1 h-1 rounded-full bg-zinc-600"></span> Instant <span className="w-1 h-1 rounded-full bg-zinc-600"></span> 0-Conf
          </div>
          
          <Link href="/" className="inline-flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Powered by</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.text}`}>PayOnce ⚡</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HubPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]"></div>}>
      <HubViewer />
    </Suspense>
  );
}
