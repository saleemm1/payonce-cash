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
    return url.startsWith('http') ? url : `https://${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-green-500 rounded-full animate-spin mb-4"></div>
        <p className="text-green-500 font-bold uppercase tracking-widest text-xs">Loading Web3 Store...</p>
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

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-black border border-white/10 rounded-[2rem] shadow-2xl p-8 flex flex-col items-center text-center animate-in slide-in-from-bottom-10 duration-700">
        <img src={hubData.profile.avatar} alt="Avatar" className="w-28 h-28 rounded-full border-4 border-zinc-900 shadow-2xl mb-6 object-cover" />
        <h1 className="text-2xl font-black text-white mb-2">{hubData.profile.name}</h1>
        <p className="text-sm text-zinc-400 mb-8 leading-relaxed px-2">{hubData.profile.bio}</p>

        <div className="flex gap-4 mb-8">
          {hubData.profile.twitter && (
            <a href={formatUrl(hubData.profile.twitter)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-green-500/20 text-white hover:text-green-500 flex items-center justify-center transition-colors">
              𝕏
            </a>
          )}
          {hubData.profile.website && (
            <a href={formatUrl(hubData.profile.website)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-green-500/20 text-white hover:text-green-500 flex items-center justify-center transition-colors">
              🌐
            </a>
          )}
          {hubData.profile.email && (
            <a href={`mailto:${hubData.profile.email}`} className="w-10 h-10 rounded-full bg-white/5 hover:bg-green-500/20 text-white hover:text-green-500 flex items-center justify-center transition-colors">
              ✉️
            </a>
          )}
        </div>

        <div className="w-full space-y-4">
          {hubData.links.map((link) => (
            <a key={link.id} href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer" className="w-full bg-white/5 hover:bg-green-500 hover:text-black border border-white/10 rounded-2xl p-4 font-bold transition-all flex items-center justify-between group">
              <span className="truncate pr-4">{link.title}</span>
              <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          ))}
        </div>

        <div className="mt-12 pt-6 w-full border-t border-white/5">
          <Link href="/" className="inline-flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Powered by</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-green-500">PayOnce ⚡</span>
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
