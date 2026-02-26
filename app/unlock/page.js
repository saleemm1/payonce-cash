'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, useRef } from 'react';

const translations = {
  en: {
    loading: "LOADING...",
    invalid: "Invalid Secure Link",
    bill: "Bill",
    preview: "Item Preview",
    reward: "Affiliate Reward Applied 💸",
    promo: "Promo Code",
    apply: "Apply",
    invalidCode: "Invalid Code",
    applied: "Code Applied",
    off: "Off",
    scan: "Scanning Network...",
    smart: "Smart Pay (Wallets)",
    manual: "Manual (Exchanges)",
    address: "Address (Exchanges)",
    recipient: "Recipient Address",
    copy: "COPY",
    done: "DONE",
    seller: "Seller",
    promoter: "Promoter",
    total: "Total to Send",
    verify: "Verify Transaction",
    scanning: "Scanning Blockchain...",
    open: "Open Wallet App",
    tap: "One-tap payment",
    support: "Support",
    become: "🚀 Become an Affiliate (Earn 10%)",
    custodial: "Non-Custodial",
    p2p: "P2P Settlement",
    secure: "Securing Transaction...",
    step1: "1. Mempool Detection",
    step2: "2. Double-Spend Analysis",
    step3: "3. Decrypting Asset",
    viralDeal: "VIRAL DEAL",
    access: "Access Granted",
    verified: "Payment Verified on Blockchain",
    clean: "CLEAN",
    dsStatus: "DS-Proof Status",
    node: "Node Propagation",
    reached: "100% REACHED",
    redirect: "Secure Redirect:",
    content: "Decrypted Content:",
    asset: "Your Asset",
    openLink: "🚀 Open Link Now",
    target: "Target:",
    download: "Download",
    click: "Click text to select",
    receipt: "Download Official Receipt",
    soldOut: "SOLD OUT",
    gone: "This limited edition asset is gone.",
    browse: "Browse Other Items",
    supply: "Total Supply",
    left: "🔥 High Demand: Only",
    verifyToken: "Verify Wallet",
    tokenWalletPlaceholder: "Your BCH Wallet Address",
    checkingToken: "Checking...",
    tokenFound: "Token Verified! Access Granted.",
    noToken: "Required token not found in this wallet.",
    gatedWarning: "Requires Token:",
    discountAvailable: "Holder Discount:",
    holdToGet: "Hold to get",
    discountOff: "off!",
    viewExplorer: "View on Explorer"
  },
  ar: {
    loading: "جاري التحميل...",
    invalid: "رابط غير صالح",
    bill: "فاتورة",
    preview: "معاينة العنصر",
    reward: "مكافأة التسويق مفعلة 💸",
    promo: "كود الخصم",
    apply: "تطبيق",
    invalidCode: "كود غير صالح",
    applied: "تم تطبيق الكود",
    off: "خصم",
    scan: "فحص الشبكة...",
    smart: "دفع ذكي (محافظ)",
    manual: "يدوي (منصات)",
    address: "عنوان (منصات)",
    recipient: "عنوان المستلم",
    copy: "نسخ",
    done: "تم",
    seller: "البائع",
    promoter: "المسوق",
    total: "المبلغ للإرسال",
    verify: "التحقق من المعاملة",
    scanning: "فحص البلوكشين...",
    open: "فتح المحفظة",
    tap: "دفع بلمسة واحدة",
    support: "الدعم",
    become: "🚀 كن مسوقاً (اربح 10%)",
    custodial: "غير وصائي",
    p2p: "تسوية مباشرة",
    secure: "تأمين المعاملة...",
    step1: "1. كشف الذاكرة المؤقتة",
    step2: "2. تحليل الإنفاق المزدوج",
    step3: "3. فك تشفير الأصل",
    viralDeal: "عرض فيروسي",
    access: "تم منح الوصول",
    verified: "تم توثيق الدفع على البلوكشين",
    clean: "نظيف",
    dsStatus: "حالة الإنفاق المزدوج",
    node: "انتشار العقد",
    reached: "تم الوصول 100%",
    redirect: "توجيه آمن:",
    content: "المحتوى مفكوك التشفير:",
    asset: "أصلك الرقمي",
    openLink: "🚀 افتح الرابط الآن",
    target: "الهدف:",
    download: "تحميل",
    click: "اضغط للنص للتحديد",
    receipt: "تحميل الإيصال الرسمي",
    soldOut: "نفذت الكمية",
    gone: "هذا الإصدار المحدود قد انتهى.",
    browse: "تصفح عناصر أخرى",
    supply: "إجمالي العرض",
    left: "🔥 طلب عالي: بقي فقط",
    verifyToken: "تحقق من المحفظة",
    tokenWalletPlaceholder: "عنوان محفظة BCH الخاص بك",
    checkingToken: "جاري الفحص...",
    tokenFound: "تم التحقق! تم منح الوصول.",
    noToken: "لم يتم العثور على التوكن المطلوب.",
    gatedWarning: "يتطلب توكن:",
    discountAvailable: "خصم لحاملي توكن:",
    holdToGet: "امتلكه لتحصل على",
    discountOff: "خصم!",
    viewExplorer: "عرض على المستكشف"
  },
  zh: {
    loading: "加载中...",
    invalid: "无效的安全链接",
    bill: "账单",
    preview: "项目预览",
    reward: "联盟奖励已应用 💸",
    promo: "优惠码",
    apply: "应用",
    invalidCode: "无效代码",
    applied: "代码已应用",
    off: "折",
    scan: "扫描网络...",
    smart: "智能支付 (钱包)",
    manual: "手动 (交易所)",
    address: "地址 (交易所)",
    recipient: "收款人地址",
    copy: "复制",
    done: "完成",
    seller: "卖家",
    promoter: "推广者",
    total: "发送总额",
    verify: "验证交易",
    scanning: "扫描区块链...",
    open: "打开钱包应用",
    tap: "一键支付",
    support: "支持",
    become: "🚀 成为联盟会员 (赚取 10%)",
    custodial: "非托管",
    p2p: "P2P 结算",
    secure: "保护交易中...",
    step1: "1. 内存池检测",
    step2: "2. 双花分析",
    step3: "3. 解密资产",
    viralDeal: "病毒式交易",
    access: "访问已授权",
    verified: "付款已在区块链上验证",
    clean: "清洁",
    dsStatus: "防双花状态",
    node: "节点传播",
    reached: "100% 达成",
    redirect: "安全重定向：",
    content: "解密内容：",
    asset: "您的资产",
    openLink: "🚀 立即打开链接",
    target: "目标：",
    download: "下载",
    click: "点击文本选择",
    receipt: "下载官方收据",
    soldOut: "售罄",
    gone: "此限量版资产已售罄。",
    browse: "浏览其他项目",
    supply: "总供应量",
    left: "🔥 高需求：仅剩",
    verifyToken: "验证钱包",
    tokenWalletPlaceholder: "您的 BCH 钱包地址",
    checkingToken: "检查中...",
    tokenFound: "代币已验证！访问已授权。",
    noToken: "在此钱包中未找到所需的代币。",
    gatedWarning: "需要代币：",
    discountAvailable: "持有人折扣：",
    holdToGet: "持有以获得",
    discountOff: "折扣！",
    viewExplorer: "在浏览器中查看"
  }
};

function UnlockContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPaid, setIsPaid] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [soldCount, setSoldCount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [securityStep, setSecurityStep] = useState(0);
  const [checking, setChecking] = useState(false);
  const [data, setData] = useState(null);
  const [bchPrice, setBchPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [qrMode, setQrMode] = useState('smart');
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [txHash, setTxHash] = useState('');
  const [tokenWallet, setTokenWallet] = useState('');
  const [verifyingToken, setVerifyingToken] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [lang, setLang] = useState('en');
  
  const initialTxHistory = useRef(new Set());
  const isHistoryInitialized = useRef(false);
  const checkTimeoutRef = useRef(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('payonce_lang');
    if (savedLang) setLang(savedLang);

    const cid = searchParams.get('cid');
    if (cid) {
      fetch(`https://gateway.pinata.cloud/ipfs/${cid}`)
        .then(res => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then(decoded => {
          setData(decoded);
          setCurrentPrice(parseFloat(decoded.p));
        })
        .catch(() => {
          setError("Invalid Secure Link");
        });
    } else {
      setError("Invalid Secure Link");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchPrice = async () => {
      if (currentPrice !== null) {
        try {
          const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
          if (!res.ok) throw new Error('Rate limit');
          const json = await res.json();
          if (json['bitcoin-cash']) {
            setBchPrice((currentPrice / json['bitcoin-cash'].usd).toFixed(8));
            setLoadingPrice(false);
          }
        } catch (e) {
          try {
            const res2 = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BCHUSDT');
            const json2 = await res2.json();
            if (json2.price) {
              setBchPrice((currentPrice / parseFloat(json2.price)).toFixed(8));
              setLoadingPrice(false);
            }
          } catch (err) {
            setLoadingPrice(false);
          }
        }
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); 
    return () => clearInterval(interval);
  }, [currentPrice]);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('payonce_lang', l);
  };

  const handleApplyPromo = () => {
    if (data?.pc && data.pc.code === promoCode && !promoApplied && !tokenVerified) {
      const discount = (parseFloat(data.p) * (parseFloat(data.pc.discount) / 100));
      const newPrice = Math.max(0, parseFloat(data.p) - discount);
      setCurrentPrice(newPrice);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError(translations[lang].invalidCode);
    }
  };

  const handleVerifyToken = async () => {
    if (!tokenWallet || !data?.tk?.id) return;
    setVerifyingToken(true);
    setTokenError('');
    try {
        const cleanAddr = tokenWallet.includes(':') ? tokenWallet.split(':')[1] : tokenWallet;
        const res = await fetch(`https://rest-unstable.mainnet.cash/v1/address/utxos/${cleanAddr}`);
        const utxos = await res.json();
        const hasToken = utxos.some(u => u.token && u.token.category === data.tk.id);
        
        if (hasToken) {
            setTokenVerified(true);
            if (data.tk.type === 'discount' && !promoApplied) {
                const discountAmount = parseFloat(data.p) * (parseFloat(data.tk.discount) / 100);
                setCurrentPrice(Math.max(0, parseFloat(data.p) - discountAmount));
            }
        } else {
            setTokenError(translations[lang].noToken);
        }
    } catch(e) {
        setTokenError(translations[lang].noToken);
    }
    setVerifyingToken(false);
  };

  const validateTransaction = async (hash) => {
    setTxHash(hash);
    setChecking(false);
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    setIsValidating(true);
    setSecurityStep(0);

    try {
      setTimeout(() => setSecurityStep(1), 1000);
      const res = await fetch(`https://api.blockchair.com/bitcoin-cash/dashboards/transaction/${hash}`);
      const json = await res.json();
      const txData = json.data[hash];

      if (txData && !txData.is_double_spend_detected) {
        setTimeout(() => setSecurityStep(2), 2500);
        setTimeout(() => {
          setIsValidating(false);
          setIsPaid(true);
        }, 4000);
      } else {
        setIsValidating(false);
        alert("Double Spend Detected! Payment Rejected.");
      }
    } catch (e) {
      setTimeout(() => setSecurityStep(2), 2500);
      setTimeout(() => {
        setIsValidating(false);
        setIsPaid(true);
      }, 4000);
    }
  };

  useEffect(() => {
    let interval;
    const checkBlockchain = async () => {
      if (!data?.w || !bchPrice) return;
      const rawAddr = data.w;
      const sellerClean = rawAddr.includes(':') ? rawAddr.split(':')[1] : rawAddr;
      
      const rawAff = searchParams.get('ref');
      const cleanAff = rawAff ? (rawAff.includes(':') ? rawAff.split(':')[1] : rawAff).trim() : '';
      const isViral = data?.a && cleanAff && (cleanAff !== sellerClean);

      let targetBch = parseFloat(bchPrice);
      if (isViral) {
          targetBch = targetBch * 0.9;
      }
      const expectedSats = Math.floor(targetBch * 100000000) - 2000;

      try {
          const [resHist, resUtxos] = await Promise.all([
              fetch(`https://rest-unstable.mainnet.cash/v1/address/history/${sellerClean}`).catch(()=>null),
              fetch(`https://rest-unstable.mainnet.cash/v1/address/utxos/${sellerClean}`).catch(()=>null)
          ]);

          const history = resHist && resHist.ok ? await resHist.json() : [];
          const utxos = resUtxos && resUtxos.ok ? await resUtxos.json() : [];

          const mappedUtxos = (Array.isArray(utxos) ? utxos : []).map(u => ({
              tx_hash: u.txid,
              value: u.satoshis || u.value || 0
          }));

          const mappedHistory = (Array.isArray(history) ? history : []).map(h => ({
              tx_hash: h.tx_hash || h.txid,
              value: h.value || h.satoshis || 0
          }));

          const allTxsData = [...mappedUtxos, ...mappedHistory];
          const allTxs = Array.from(new Map(allTxsData.map(item => [item.tx_hash, item])).values());
          
          if (data.l) { 
              const totalSales = allTxs.filter(tx => tx.value >= expectedSats && tx.value <= expectedSats + 15000).length;
              setSoldCount(totalSales);
              if (totalSales >= data.l) {
                  setIsSoldOut(true);
                  setChecking(false);
                  if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
                  return;
              }
          }

          if (checking && !isPaid && !isValidating && !isSoldOut) {
              if (!isHistoryInitialized.current) {
                  allTxs.forEach(tx => initialTxHistory.current.add(tx.tx_hash));
                  isHistoryInitialized.current = true;
              }

              const newTx = allTxs.find(tx => 
                  !initialTxHistory.current.has(tx.tx_hash) && 
                  tx.value >= expectedSats - 3000 && tx.value <= expectedSats + 15000
              );

              if (newTx) {
                  initialTxHistory.current.add(newTx.tx_hash);
                  clearInterval(interval);
                  validateTransaction(newTx.tx_hash);
              }
          }

      } catch (err) {}
    };

    if (data?.w && bchPrice) {
      if (checking) {
        checkBlockchain();
        interval = setInterval(checkBlockchain, 3000); 
      }
    }

    return () => clearInterval(interval);
  }, [checking, isPaid, isValidating, data, bchPrice, isSoldOut, searchParams]);

  useEffect(() => {
    const rawAff = searchParams.get('ref');
    const cleanAff = rawAff ? (rawAff.includes(':') ? rawAff.split(':')[1] : rawAff).trim() : '';
    const rawAddr = data?.w || '';
    const sellerClean = rawAddr.includes(':') ? rawAddr.split(':')[1] : rawAddr;
    
    if (data?.a && cleanAff && cleanAff !== sellerClean) {
      setQrMode('smart');
    } else {
      setQrMode('smart'); 
    }
  }, [data, searchParams]);

  const handleDownloadReceipt = () => {
    const receiptText = `=== PAYONCE SECURE RECEIPT ===\n\nItem: ${data.n}\nPrice: ${fullPriceBch} BCH\nTxID: ${txHash}\nSeller: ${data.sn}\nSupport: ${data.se}\nDate: ${new Date().toLocaleString()}\n\nThank you for using PayOnce.cash!`;
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `PayOnce_Receipt_${txHash.substring(0,8)}.txt`;
    link.click();
  };

  const t = translations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  if (error) return <div className="min-h-screen bg-black text-red-500 flex justify-center items-center font-black uppercase tracking-tighter">{error}</div>;
  
  if (!data) return <div className="min-h-screen bg-[#09090b] text-white flex justify-center items-center animate-pulse font-black italic tracking-[10px]">{t.loading}</div>;

  if (isSoldOut) {
    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 font-sans relative overflow-hidden">
            <div className="w-full max-w-[440px] bg-[#121214] p-10 rounded-[40px] border-2 border-red-900/30 text-center shadow-2xl relative z-10">
                <div className="text-6xl mb-6 grayscale opacity-50">🔒</div>
                <h1 className="text-4xl font-black text-red-600 uppercase italic tracking-tighter mb-2">{t.soldOut}</h1>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-8">
                    {t.gone}
                </p>
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-6">
                    <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase mb-2">
                        <span>{t.supply}</span>
                        <span>{data.l} / {data.l}</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-red-600"></div>
                    </div>
                </div>
                <button onClick={() => router.push('/')} className="w-full bg-white text-black font-black uppercase py-4 rounded-xl hover:bg-zinc-200 transition-all">
                    {t.browse}
                </button>
            </div>
        </div>
    );
  }

  const rawAddr = data.w || '';
  const cleanAddr = (rawAddr.includes(':') ? rawAddr.split(':')[1] : rawAddr).trim();
  const displaySeller = `bitcoincash:${cleanAddr}`;
  
  const rawAff = searchParams.get('ref');
  const cleanAff = rawAff ? (rawAff.includes(':') ? rawAff.split(':')[1] : rawAff).trim() : '';
  const displayAff = cleanAff ? `bitcoincash:${cleanAff}` : '';
  
  const isViral = data.a && cleanAff && (cleanAff !== cleanAddr);

  const fullPriceBch = bchPrice ? parseFloat(bchPrice).toFixed(8) : "0.00000000";
  const sellerAmt = isViral ? (parseFloat(fullPriceBch) * 0.9).toFixed(8) : fullPriceBch;
  const affAmt = isViral ? (parseFloat(fullPriceBch) * 0.1).toFixed(8) : "0.00000000";

  const standardLink = `bitcoincash:${cleanAddr}?amount=${fullPriceBch}`;
  const smartViralLink = `bitcoincash:${cleanAddr}?amount=${sellerAmt}&address=${cleanAff}&amount=${affAmt}`;

  const qrData = qrMode === 'smart' ? (isViral ? smartViralLink : standardLink) : displaySeller;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleOpenWallet = () => {
    window.location.assign(isViral ? smartViralLink : standardLink);
  };

  const isGated = data.tk && data.tk.type === 'gated' && !tokenVerified;

  const handleVerifyClick = () => {
    if (searchParams.get('dev') === 'trustme') {
        validateTransaction('dev-bypass-1234');
        return;
    }

    setChecking(true);
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    checkTimeoutRef.current = setTimeout(() => {
        setChecking(false);
        alert("Transaction not found in the mempool. Please ensure your wallet broadcasted the payment successfully.");
    }, 45000); 
  };

  return (
    <div dir={dir} className={`min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-12 font-sans relative overflow-hidden ${lang === 'ar' ? 'font-arabic' : ''}`}>
      
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.1)_0%,_transparent_60%)] pointer-events-none"></div>

      <div className="absolute top-6 right-6 flex gap-2 text-[10px] font-black uppercase z-50">
        <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
        <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
        <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
      </div>

      {isValidating && (
         <div className="w-full max-w-[440px] bg-[#121214] p-10 rounded-[40px] border-2 border-zinc-800 text-center shadow-2xl relative z-50 animate-in fade-in zoom-in-95 duration-300">
           <div className="flex flex-col items-center justify-center h-64">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin"></div>
                {securityStep >= 1 && <div className="absolute inset-0 flex items-center justify-center text-green-500 text-3xl animate-pulse">⚡</div>}
              </div>
              
              <h2 className="text-xl font-black uppercase italic text-white mb-6 tracking-tight">{t.secure}</h2>
              
              <div className="w-full space-y-3">
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${securityStep >= 0 ? 'bg-green-900/20 border-green-500/30' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}>
                    <span className="text-[10px] font-bold uppercase text-zinc-300">{t.step1}</span>
                    {securityStep >= 0 && <span className="text-green-500 text-xs font-black">✓</span>}
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${securityStep >= 1 ? 'bg-green-900/20 border-green-500/30' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}>
                    <span className="text-[10px] font-bold uppercase text-zinc-300">{t.step2}</span>
                    {securityStep >= 1 && <span className="text-green-500 text-xs font-black">✓</span>}
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${securityStep >= 2 ? 'bg-green-900/20 border-green-500/30' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}>
                    <span className="text-[10px] font-bold uppercase text-zinc-300">{t.step3}</span>
                    {securityStep >= 2 && <span className="text-green-500 text-xs font-black">✓</span>}
                </div>
              </div>
           </div>
         </div>
      )}

      {!isPaid && !isValidating && (
        <div className="w-full max-w-[480px] bg-[#121214] rounded-[32px] border border-white/5 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500 p-8">
            
            {isViral && (
              <div className={`absolute -right-12 top-8 bg-green-500 text-black text-[10px] font-black px-12 py-1 rotate-45 uppercase shadow-[0_0_20px_rgba(34,197,94,0.4)] z-20 tracking-widest`}>
                  {t.viralDeal}
              </div>
            )}

            <div className="flex flex-col items-center text-center mb-6">
                {data.cn && (
                    <div className="mb-6 inline-flex items-center gap-2 bg-green-900/20 border border-green-500/20 px-4 py-1.5 rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{t.bill}: {data.cn}</span>
                    </div>
                )}

                {data.pr && (
                    <div className="w-full relative mb-6 group overflow-hidden rounded-[24px] border border-white/5">
                        <img src={data.pr} className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105" alt="Preview" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-left">
                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-wider mb-1">
                                {t.preview}
                            </p>
                        </div>
                    </div>
                )}

                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none mb-2">{data.n}</h1>
                
                <div className="inline-block bg-white/5 px-3 py-1 rounded-lg border border-white/5 mb-3">
                   <p className="text-[10px] text-green-500/80 font-bold truncate italic uppercase">
                     {data.fn || "Secure_Attachment.enc"}
                   </p>
                </div>
                
                {isViral && (
                   <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest block">
                     {t.reward}
                   </p>
                )}
                
                {data.l && (
                    <div className="mt-2 mb-2 text-center">
                        <span className="inline-block bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black uppercase px-2 py-1 rounded animate-pulse">
                            {t.left} {data.l - soldCount}
                        </span>
                    </div>
                )}

                {data.d && <div className="mt-4 bg-zinc-900/50 p-3 rounded-xl border border-white/5 w-full text-left">
                    <p className="text-zinc-400 text-[11px] leading-relaxed italic">{data.d}</p>
                </div>}

                {data.tk && !tokenVerified && (
                    <div className="mt-6 w-full bg-gradient-to-br from-[#0c1610] to-[#09090b] p-5 rounded-2xl border border-green-900/50 flex flex-col gap-4 text-start relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-xs font-black uppercase text-green-500 flex items-center gap-2">
                                {data.tk.type === 'gated' ? t.gatedWarning : t.discountAvailable} 
                                <span className="text-white bg-green-500/20 px-2 py-0.5 rounded-md tracking-widest">{data.tk.name}</span>
                            </h3>
                            
                            <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-green-900/30 mt-2">
                                <span className="text-[10px] text-zinc-400 font-mono">ID: {data.tk.id.substring(0, 8)}...{data.tk.id.substring(data.tk.id.length - 6)}</span>
                                <a href={`https://explorer.salemkode.com/token/${data.tk.id}`} target="_blank" rel="noopener noreferrer" className="bg-green-900/30 hover:bg-green-500/20 text-green-500 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors border border-green-500/20">
                                    <span className="text-[9px] font-black uppercase tracking-wider">{t.viewExplorer}</span>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                </a>
                            </div>

                            {data.tk.type === 'discount' && (
                                <p className="text-[10px] text-zinc-400 mt-2">{t.holdToGet} <span className="text-green-400 font-bold">{data.tk.discount}%</span> {t.discountOff}</p>
                            )}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <input 
                                type="text" 
                                placeholder={t.tokenWalletPlaceholder} 
                                value={tokenWallet} 
                                onChange={(e)=>setTokenWallet(e.target.value)} 
                                className="flex-1 bg-black/50 p-3 rounded-xl border border-green-900/50 text-xs text-green-400 font-mono outline-none focus:border-green-500"
                            />
                            <button 
                                onClick={handleVerifyToken}
                                disabled={verifyingToken || !tokenWallet}
                                className="bg-green-600 hover:bg-green-500 text-black font-bold text-[10px] px-5 rounded-xl uppercase disabled:opacity-50 transition-colors shadow-lg shadow-green-900/20"
                            >
                                {verifyingToken ? t.checkingToken : t.verifyToken}
                            </button>
                        </div>
                        {tokenError && <p className="text-[10px] text-red-500 font-bold uppercase">{tokenError}</p>}
                    </div>
                )}

                {tokenVerified && data.tk && (
                    <div className="mt-4 w-full bg-green-500/10 p-3 rounded-xl border border-green-500/30 text-green-500 text-[10px] font-black uppercase tracking-widest">
                        ✅ {t.tokenFound}
                    </div>
                )}

                {data.pc && !isPaid && !promoApplied && !tokenVerified && !isGated && (
                    <div className="mt-4 w-full bg-zinc-900/50 p-2 rounded-xl border border-white/5 flex gap-2">
                        <input 
                            type="text" 
                            placeholder={t.promo} 
                            value={promoCode} 
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            className="bg-transparent w-full text-xs p-2 outline-none text-white placeholder:text-zinc-600 font-mono"
                            maxLength={5}
                        />
                        <button 
                            onClick={handleApplyPromo}
                            className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 rounded-lg uppercase transition-all"
                        >
                            {t.apply}
                        </button>
                    </div>
                )}
                {promoError && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase">{promoError}</p>}
                {promoApplied && <p className="text-[9px] text-green-500 font-bold mt-1 uppercase">{t.applied}: {data.pc.discount}% {t.off}</p>}
            </div>

            {!isGated && (
                <>
                    <div className="bg-zinc-900/30 rounded-[24px] border border-white/5 p-6 mb-6">
                        <div className="flex flex-col items-center">
                            {!(isViral && qrMode === 'manual') && (
                                <div className="bg-white p-4 rounded-[24px] shadow-lg mb-6 relative group cursor-pointer hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-shadow">
                                    {!loadingPrice ? (
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`}
                                            alt="QR" className="w-[160px] h-[160px] mix-blend-multiply"
                                        />
                                    ) : <div className="w-[160px] h-[160px] bg-zinc-200 animate-pulse rounded-xl"></div>}
                                    
                                    {checking && (
                                        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-[24px] flex flex-col items-center justify-center">
                                            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                            <p className="text-[8px] font-black text-green-500 uppercase tracking-widest">{t.scan}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex bg-black p-1 rounded-xl border border-white/10 w-full mb-6">
                                {isViral ? (
                                    <>
                                        <button onClick={() => setQrMode('smart')} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${qrMode === 'smart' ? 'bg-green-600 text-black shadow' : 'text-zinc-500 hover:text-white'}`}>{t.smart}</button>
                                        <button onClick={() => setQrMode('manual')} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${qrMode === 'manual' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>{t.manual}</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setQrMode('address')} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${qrMode === 'address' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>{t.address}</button>
                                        <button onClick={() => setQrMode('smart')} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${qrMode === 'smart' ? 'bg-green-600 text-black shadow' : 'text-zinc-500 hover:text-white'}`}>{t.smart}</button>
                                    </>
                                )}
                            </div>

                            {qrMode === 'address' && !isViral && (
                                <div className="w-full bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-3 group hover:border-white/20 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">🏁</div>
                                    <div className="flex-1 overflow-hidden text-start">
                                        <p className="text-[8px] text-zinc-500 font-black uppercase mb-0.5">{t.recipient}</p>
                                        <p className="text-[10px] font-mono text-zinc-300 truncate">{displaySeller}</p>
                                    </div>
                                    <button onClick={() => copyToClipboard(displaySeller, 'seller')} className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-[10px] text-white transition-all">
                                        {copied === 'seller' ? t.done : t.copy}
                                    </button>
                                </div>
                            )}

                            {qrMode === 'manual' && isViral && (
                                <div className="w-full space-y-2">
                                         <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">🏪</div>
                                        <div className="flex-1 overflow-hidden text-start">
                                            <p className="text-[8px] text-zinc-500 font-black uppercase mb-0.5">{t.seller} (90%) - {sellerAmt} BCH</p>
                                            <p className="text-[10px] font-mono text-zinc-300 truncate">{displaySeller}</p>
                                        </div>
                                        <button onClick={() => copyToClipboard(displaySeller, 'seller')} className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-[10px] text-white">
                                            {copied === 'seller' ? t.done : t.copy}
                                        </button>
                                    </div>
                                    <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">🚀</div>
                                        <div className="flex-1 overflow-hidden text-start">
                                            <p className="text-[8px] text-zinc-500 font-black uppercase mb-0.5">{t.promoter} (10%) - {affAmt} BCH</p>
                                            <p className="text-[10px] font-mono text-zinc-300 truncate">{displayAff}</p>
                                        </div>
                                        <button onClick={() => copyToClipboard(displayAff, 'aff')} className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-[10px] text-white">
                                            {copied === 'aff' ? t.done : t.copy}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-[9px] text-zinc-500 font-black uppercase mb-1 tracking-widest">{t.total}</p>
                        <div className="flex items-baseline justify-center gap-2">
                            <span className="text-4xl font-black text-white tracking-tighter tabular-nums">
                                {fullPriceBch}
                            </span>
                            <span className="text-lg font-bold text-green-500 tracking-tight">BCH</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-1 font-bold">≈ ${currentPrice} USD</p>
                        {isViral && <span className="inline-block mt-2 text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase">Viral Mode Applied</span>}
                    </div>

                    <button 
                        onClick={handleVerifyClick} 
                        disabled={checking || !bchPrice}
                        className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-4 rounded-xl transition-all uppercase tracking-tight text-base shadow-[0_10px_30px_rgba(22,163,74,0.3)] hover:shadow-[0_10px_40px_rgba(22,163,74,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    >
                        {checking ? t.scanning : t.verify}
                    </button>

                    <div className="mt-8 w-full space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-[1px] bg-zinc-800 flex-1"></div>
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[3px]">Instant Connect</span>
                            <div className="h-[1px] bg-zinc-800 flex-1"></div>
                        </div>

                        {!loadingPrice && (
                            <button 
                                onClick={handleOpenWallet}
                                className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition-all group active:scale-[0.98] cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">⚡</div>
                                    <div className="text-start">
                                        <p className="text-[10px] font-black text-white uppercase italic">{t.open}</p>
                                        <p className="text-[8px] text-zinc-500 uppercase">{t.tap}</p>
                                    </div>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`text-zinc-600 group-hover:text-green-500 transition-colors ${lang === 'ar' ? 'rotate-180' : ''}`}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                            <span className="text-[7px] font-black text-zinc-600 uppercase block mb-1">{t.seller}</span>
                            <span className="text-[11px] font-bold text-white truncate block">{data.sn}</span>
                        </div>
                        <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                            <span className="text-[7px] font-black text-zinc-600 uppercase block mb-1">{t.support}</span>
                            <span className="text-[11px] font-bold text-green-500/70 truncate block">{data.se}</span>
                        </div>
                    </div>
                    
                    {data.a && !cleanAff && (
                        <button onClick={() => router.push(`/affiliate?product=${searchParams.get('cid')}`)} className="w-full mt-4 py-3 rounded-xl border border-dashed border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 text-[9px] font-black uppercase tracking-widest transition-all">
                            {t.become}
                        </button>
                    )}
                    
                    <div className="mt-6 flex justify-center items-center gap-4 opacity-30 grayscale">
                         <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold">{t.custodial}</span>
                         </div>
                         <div className="w-1 h-1 bg-white rounded-full"></div>
                         <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold">{t.p2p}</span>
                         </div>
                    </div>
                </>
            )}
        </div>
      )}

      {isPaid && !isValidating && (
        <div className="w-full max-w-[440px] bg-[#121214] p-10 rounded-[40px] border-2 border-green-500/30 text-center shadow-[0_0_100px_rgba(34,197,94,0.15)] animate-in zoom-in-95 duration-500 relative overflow-hidden">
            
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            
            <div className="relative z-10">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                
                <h1 className="text-3xl font-black mb-2 italic uppercase tracking-tighter text-white">{t.access}</h1>
                <p className="text-green-500 text-[10px] mb-6 uppercase tracking-[4px] font-black">
                    {t.verified}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-8">
                    <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                        <p className="text-[8px] text-zinc-500 uppercase font-black mb-1">{t.dsStatus}</p>
                        <p className="text-xs font-bold text-green-400 flex items-center justify-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span> {t.clean}
                        </p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                        <p className="text-[8px] text-zinc-500 uppercase font-black mb-1">{t.node}</p>
                        <p className="text-xs font-bold text-green-400">{t.reached}</p>
                    </div>
                </div>
                
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-8 text-start relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                     
                     <p className="text-[9px] text-zinc-500 uppercase font-black mb-2 tracking-wider">
                        {data.dt === 'link' ? t.redirect : (data.dt === 'file' ? t.content : t.asset)}
                     </p>

                     {data.dt === 'link' ? (
                        <div className="text-center py-2">
                            <a href={data.i} target="_blank" className="block w-full bg-white hover:bg-zinc-200 text-black font-black py-3 rounded-xl uppercase tracking-widest text-sm transition-all mb-2 shadow-lg">
                                {t.openLink}
                            </a>
                            <p className="text-[8px] text-zinc-500 font-mono break-all opacity-50">{t.target} {data.i.substring(0, 30)}...</p>
                        </div>
                     ) : data.dt === 'file' ? (
                        <div className="flex items-center justify-between">
                            <span className="text-white font-bold truncate pr-4">{data.fn || 'Download File'}</span>
                            <a href={`https://gateway.pinata.cloud/ipfs/${data.i}`} target="_blank" className="bg-white text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:scale-105 transition-transform">
                                {t.download}
                            </a>
                        </div>
                     ) : (
                        <div>
                            <p className="text-white font-mono text-sm break-all select-all leading-relaxed bg-black/50 p-3 rounded-lg border border-white/5">{data.i}</p>
                            <p className="text-[8px] text-zinc-600 mt-2 text-right">{t.click}</p>
                        </div>
                     )}
                </div>
                
                <div className="text-[9px] text-zinc-600 font-mono mb-6 truncate">TxID: {txHash}</div>

                <button onClick={handleDownloadReceipt} className="w-full bg-zinc-800 hover:bg-zinc-700 text-green-500 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest mb-4 flex items-center justify-center gap-2 transition-all border border-green-500/20 hover:border-green-500/50 shadow-lg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    {t.receipt}
                </button>
            </div>
        </div>
      )}
    </div>
  );
}

export default function UnlockPage() {
  return <Suspense fallback={null}><UnlockContent /></Suspense>;
}
