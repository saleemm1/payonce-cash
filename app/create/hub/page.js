'use client';
import { useState } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    hub: "HUB",
    storefront: "Storefront",
    exit: "Exit",
    build: "Build Your",
    identity: "Identity.",
    desc: "Create a 100% stateless Web3 Linktree. One link for all your PayOnce products.",
    step1: "1. Profile Details",
    avatarLabel: "Avatar Image URL",
    avatarPlaceholder: "https://example.com/my-logo.png",
    themeLabel: "Theme Color",
    storeLabel: "Store Name",
    bioLabel: "Bio",
    twitterLabel: "X (Twitter)",
    websiteLabel: "Website",
    websitePlaceholder: "yourdomain.com",
    emailLabel: "Support Email",
    emailPlaceholder: "support@...",
    step2: "2. Your Links",
    addLink: "+ Add Link",
    linkTitle: "Link Title (e.g., Buy My E-Book)",
    linkUrl: "URL (e.g., https://payonce.cash/...)",
    deployBtn: "Deploy Storefront",
    freeText: "FREE (Hackathon & Public Beta)",
    pinning: "Pinning to IPFS...",
    decentralizing: "Decentralizing Identity",
    deployedTitle: "Hub Deployed!",
    deployedDesc: "Your Web3 Storefront is now live and immutable.",
    hubUrlLabel: "Your Hub URL",
    visitBtn: "Visit Storefront",
    nonCustodial: "100% Non-Custodial • 0-Conf Ready",
    poweredBy: "Powered by",
    twitterErr: "Only x.com or twitter.com links are allowed"
  },
  ar: {
    hub: "المركز",
    storefront: "المتجر",
    exit: "خروج",
    build: "ابنِ",
    identity: "هويتك.",
    desc: "أنشئ واجهة Web3 لامركزية 100%. رابط واحد لكل منتجاتك.",
    step1: "1. تفاصيل الملف الشخصي",
    avatarLabel: "رابط الصورة الشخصية",
    avatarPlaceholder: "https://example.com/my-logo.png",
    themeLabel: "لون المظهر",
    storeLabel: "اسم المتجر",
    bioLabel: "النبذة (Bio)",
    twitterLabel: "إكس (تويتر)",
    websiteLabel: "الموقع الإلكتروني",
    websitePlaceholder: "yourdomain.com",
    emailLabel: "بريد الدعم",
    emailPlaceholder: "support@...",
    step2: "2. روابطك",
    addLink: "+ إضافة رابط",
    linkTitle: "عنوان الرابط (مثال: شراء كتابي)",
    linkUrl: "الرابط (مثال: https://payonce.cash/...)",
    deployBtn: "نشر المتجر",
    freeText: "مجاني (نسخة تجريبية)",
    pinning: "جاري الرفع على IPFS...",
    decentralizing: "لامركزية الهوية",
    deployedTitle: "تم نشر المتجر!",
    deployedDesc: "متجرك في Web3 أصبح متاحاً الآن.",
    hubUrlLabel: "رابط متجرك",
    visitBtn: "زيارة المتجر",
    nonCustodial: "لامركزي 100% • يدعم 0-Conf",
    poweredBy: "بدعم من",
    twitterErr: "يُسمح فقط بروابط x.com أو twitter.com"
  },
  zh: {
    hub: "中心",
    storefront: "店面",
    exit: "退出",
    build: "建立你的",
    identity: "身份.",
    desc: "创建一个100%无状态的Web3主页。一个链接包含所有产品。",
    step1: "1. 个人资料详情",
    avatarLabel: "头像 URL",
    avatarPlaceholder: "https://example.com/my-logo.png",
    themeLabel: "主题颜色",
    storeLabel: "商店名称",
    bioLabel: "简介 (Bio)",
    twitterLabel: "X (Twitter)",
    websiteLabel: "网站",
    websitePlaceholder: "yourdomain.com",
    emailLabel: "支持电子邮件",
    emailPlaceholder: "support@...",
    step2: "2. 你的链接",
    addLink: "+ 添加链接",
    linkTitle: "链接标题 (例如: 购买我的电子书)",
    linkUrl: "URL (例如: https://payonce.cash/...)",
    deployBtn: "部署店面",
    freeText: "免费 (测试版)",
    pinning: "正在固定到 IPFS...",
    decentralizing: "去中心化身份",
    deployedTitle: "主页已部署！",
    deployedDesc: "您的 Web3 店面现已上线且不可篡改。",
    hubUrlLabel: "您的主页 URL",
    visitBtn: "访问店面",
    nonCustodial: "100% 非托管 • 0-Conf",
    poweredBy: "技术支持",
    twitterErr: "仅允许 x.com 或 twitter.com 链接"
  }
};

export default function CreateHubPage() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const [profile, setProfile] = useState({
    name: 'My Web3 Store',
    bio: 'Welcome to my decentralized storefront. Pay with BCH instantly.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PayOnce',
    twitter: '',
    website: '',
    email: '',
    theme: 'green'
  });

  const [links, setLinks] = useState([
    { id: 1, title: 'Buy My E-Book', url: '', type: 'product' },
  ]);

  const [paymentStep, setPaymentStep] = useState('edit');
  const [finalCid, setFinalCid] = useState('');
  const [copied, setCopied] = useState(false);
  const [twitterError, setTwitterError] = useState('');

  const themes = {
    green: { bg: 'bg-green-500', text: 'text-green-500', glow: 'bg-green-500/10', hex: '#22c55e' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-500', glow: 'bg-blue-500/10', hex: '#3b82f6' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-500', glow: 'bg-purple-500/10', hex: '#a855f7' }
  };
  const currentTheme = themes[profile.theme] || themes.green;

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'twitter') {
      if (value && !/(x\.com|twitter\.com)/i.test(value)) {
        setTwitterError(t.twitterErr);
      } else {
        setTwitterError('');
      }
    }
    
    setProfile({ ...profile, [name]: value });
  };

  const addLink = () => {
    setLinks([...links, { id: Date.now(), title: t.addLink, url: '', type: 'product' }]);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://payonce.cash/hub?cid=${finalCid}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen bg-[#050505] text-white font-sans selection:${currentTheme.glow} overflow-x-hidden`}>
      <nav className="border-b border-white/5 py-4 px-6 flex justify-between items-center max-w-7xl mx-auto">
         <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${currentTheme.bg} rounded-lg flex items-center justify-center text-black font-black text-xs transition-colors`}>{t.hub}</div>
            <span className="font-bold text-lg tracking-tight">PayOnce <span className="text-zinc-500">{t.storefront}</span></span>
         </div>
         <div className="flex items-center gap-4">
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent text-[10px] font-black uppercase text-zinc-500 hover:text-white outline-none cursor-pointer">
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="zh">ZH</option>
            </select>
            <Link href="/">
                <button className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">{t.exit}</button>
            </Link>
         </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className={`lg:col-span-7 space-y-8 transition-all duration-500 ${paymentStep !== 'edit' ? 'opacity-20 pointer-events-none blur-sm' : ''}`}>
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">{t.build} <span className={currentTheme.text}>{t.identity}</span></h1>
            <p className="text-zinc-400 text-sm">{t.desc}</p>
          </div>

          <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${profile.theme}-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity`} style={{ backgroundImage: `linear-gradient(to right, transparent, ${currentTheme.hex}, transparent)` }}></div>
            
            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest border-b border-white/5 pb-2">{t.step1}</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <img src={profile.avatar} alt="Avatar" className="w-16 h-16 rounded-full border border-white/10 bg-black object-cover" />
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">{t.avatarLabel}</label>
                  <input type="text" name="avatar" value={profile.avatar} onChange={handleProfileChange} className={`w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-${profile.theme}-500 transition-colors`} placeholder={t.avatarPlaceholder} />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">{t.themeLabel}</label>
                <div className="flex gap-3">
                  {Object.keys(themes).map(color => (
                    <button 
                      key={color} 
                      type="button" 
                      onClick={() => setProfile({...profile, theme: color})} 
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${profile.theme === color ? 'border-white scale-110' : 'border-transparent'}`} 
                      style={{ backgroundColor: themes[color].hex }} 
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">{t.storeLabel}</label>
                <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none transition-colors" style={{ outlineColor: currentTheme.hex }} />
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">{t.bioLabel}</label>
                <textarea name="bio" value={profile.bio} onChange={handleProfileChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none transition-colors resize-none h-20" style={{ outlineColor: currentTheme.hex }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">{t.twitterLabel}</label>
                  <input type="text" name="twitter" value={profile.twitter} onChange={handleProfileChange} className={`w-full bg-black/50 border ${twitterError ? 'border-red-500' : 'border-white/10'} rounded-xl p-3 text-sm text-white outline-none transition-colors`} style={{ outlineColor: twitterError ? '#ef4444' : currentTheme.hex }} placeholder="x.com/..." />
                  {twitterError && <p className="text-[9px] text-red-500 mt-1 font-bold">{twitterError}</p>}
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">{t.websiteLabel}</label>
                  <input type="text" name="website" value={profile.website} onChange={handleProfileChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none transition-colors" style={{ outlineColor: currentTheme.hex }} placeholder={t.websitePlaceholder} />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">{t.emailLabel}</label>
                  <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white outline-none transition-colors" style={{ outlineColor: currentTheme.hex }} placeholder={t.emailPlaceholder} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest">{t.step2}</h3>
              <button onClick={addLink} className={`text-[10px] font-black uppercase ${currentTheme.text} hover:text-white ${currentTheme.glow} px-3 py-1 rounded-full transition-colors`}>{t.addLink}</button>
            </div>

            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={link.id} className="flex gap-3 items-start bg-black/30 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-500 shrink-0 mt-2">{index + 1}</div>
                  <div className="flex-1 space-y-3">
                    <input type="text" value={link.title} onChange={(e) => updateLink(link.id, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-1 text-sm text-white outline-none" style={{ outlineColor: currentTheme.hex }} placeholder={t.linkTitle} />
                    <input type="text" value={link.url} onChange={(e) => updateLink(link.id, 'url', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-1 text-xs text-zinc-400 outline-none" style={{ outlineColor: currentTheme.hex }} placeholder={t.linkUrl} />
                  </div>
                  <button onClick={() => removeLink(link.id)} className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-500 hover:text-white transition-colors mt-1">✕</button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={deployToIPFS} disabled={links.length === 0 || !!twitterError} className="w-full bg-white text-black py-4 rounded-2xl hover:bg-zinc-200 hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center">
            <span className="font-black uppercase tracking-widest text-lg mb-1">{t.deployBtn}</span>
            <span className="text-[10px] text-zinc-600 uppercase font-bold flex items-center gap-2">
              <del className="text-zinc-400">0.01 BCH</del> 
              <span className={`${currentTheme.text} ${currentTheme.glow} px-2 py-0.5 rounded-full`}>{t.freeText}</span>
            </span>
          </button>
        </div>

        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div className="sticky top-12 w-[320px] h-[650px] bg-black border-[8px] border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col items-center relative z-10">
            <div className="absolute top-0 w-32 h-6 bg-zinc-800 rounded-b-2xl z-20"></div>
            
            <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-black p-6 overflow-y-auto custom-scrollbar flex flex-col items-center text-center pt-16 relative">
              
              <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-black shadow-xl mb-4 transition-transform hover:scale-105 object-cover" />
              
              <h2 className="text-xl font-bold text-white mb-1">{profile.name || t.storeLabel}</h2>
              <p className="text-xs text-zinc-400 mb-6 px-4">{profile.bio || t.bioLabel}</p>
              
              <div className="flex gap-4 mb-8">
                {profile.twitter && <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">𝕏</div>}
                {profile.website && <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">🌐</div>}
                {profile.email && <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">✉️</div>}
              </div>

              <div className="w-full space-y-3">
                {links.map(link => {
                  const isPayOnce = link.url.includes('payonce');
                  return (
                    <div key={link.id} className={`w-full border rounded-xl p-4 text-sm font-bold transition-all cursor-pointer hover:scale-[1.02] flex items-center justify-between ${isPayOnce ? `${currentTheme.glow} hover:brightness-110` : 'bg-white/5 hover:bg-white/10 border-white/10'}`} style={{ borderColor: isPayOnce ? `${currentTheme.hex}80` : '' }}>
                      <span className="truncate pr-2">{link.title || 'Untitled Link'}</span>
                      {isPayOnce && <span className={`text-[10px] ${currentTheme.bg} text-black px-2 py-1 rounded-md shrink-0 font-black flex items-center gap-1`}>BCH ⚡</span>}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-auto pt-8 pb-4 opacity-50 text-[9px] font-black uppercase tracking-widest flex flex-col items-center gap-1">
                <span className="text-zinc-500">{t.nonCustodial}</span>
                <span>{t.poweredBy} <span className={currentTheme.text}>PayOnce</span></span>
              </div>
            </div>

            {paymentStep !== 'edit' && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                {paymentStep === 'uploading' && (
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 border-4 border-zinc-800 rounded-full animate-spin mb-4`} style={{ borderTopColor: currentTheme.hex }}></div>
                    <p className={`text-sm font-bold animate-pulse ${currentTheme.text}`}>{t.pinning}</p>
                    <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">{t.decentralizing}</p>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-500">
                    <div className={`w-16 h-16 ${currentTheme.bg} rounded-full flex items-center justify-center mb-4`} style={{ boxShadow: `0 0 30px ${currentTheme.hex}80` }}>
                      <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="font-black uppercase text-xl mb-2 text-white">{t.deployedTitle}</h3>
                    <p className="text-xs text-zinc-400 mb-6">{t.deployedDesc}</p>
                    
                    <div className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 mb-6 relative group overflow-hidden flex flex-col gap-2">
                      <p className="text-[9px] text-zinc-500 uppercase font-bold">{t.hubUrlLabel}</p>
                      <div className="flex items-center gap-2">
                        <input readOnly value={`https://payonce.cash/hub?cid=${finalCid}`} className={`w-full bg-transparent text-[10px] ${currentTheme.text} font-mono outline-none`} dir="ltr" />
                        <button onClick={copyToClipboard} className={`bg-white/10 ${currentTheme.text} hover:bg-white hover:text-black p-2 rounded-lg transition-colors shrink-0`}>
                          {copied ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <a href={`/hub?cid=${finalCid}`} target="_blank" className="w-full bg-white text-black font-black uppercase text-xs py-4 rounded-xl hover:bg-zinc-200 transition-colors block text-center">
                      {t.visitBtn}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] blur-[100px] rounded-full pointer-events-none transition-colors duration-500" style={{ backgroundColor: `${currentTheme.hex}20` }}></div>
        </div>
      </main>
    </div>
  );
}
