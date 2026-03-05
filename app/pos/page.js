'use client';

import { useState, useEffect, useRef } from 'react';

const translations = {
  en: {
    setup: "Terminal Setup",
    merchAddr: "Merchant Address",
    localCurr: "Local Currency",
    save: "Save & Start",
    live: "Live",
    scan: "Scan with Zapit, Paytaca, or Electron Cash",
    destAddr: "Destination Address",
    copy: "Copy",
    cex: "⚠️ Centralized Exchanges Only",
    useFor: "Use this for Binance, OKX, Bybit manually.",
    mempool: "Scanning Mempool...",
    close: "Close / New Order",
    verifying: "Verifying 0-Conf...",
    double: "Checking Double-Spend Proofs",
    paid: "PAID",
    safe: "Safe Transaction Detected",
    newOrder: "New Order",
    charge: "CHARGE",
    smart: "⚡ Smart Pay",
    exchange: "🏦 Exchange",
    warning: "Warning: Double Spend Attempt Detected!"
  },
  ar: {
    setup: "إعداد المحطة",
    merchAddr: "عنوان التاجر",
    localCurr: "العملة المحلية",
    save: "حفظ وبدء",
    live: "مباشر",
    scan: "امسح باستخدام Bitcoin.com، Paytaca، أو Electron",
    destAddr: "عنوان الوجهة",
    copy: "نسخ",
    cex: "⚠️ المنصات المركزية فقط",
    useFor: "استخدم هذا لـ Binance، OKX، Bybit يدوياً.",
    mempool: "فحص الذاكرة المؤقتة...",
    close: "إغلاق / طلب جديد",
    verifying: "التحقق من 0-Conf...",
    double: "فحص إثباتات الإنفاق المزدوج",
    paid: "تم الدفع",
    safe: "تم اكتشاف معاملة آمنة",
    newOrder: "طلب جديد",
    charge: "تحصيل",
    smart: "⚡ دفع ذكي",
    exchange: "🏦 تحويل",
    warning: "تحذير: محاولة إنفاق مزدوج!"
  },
  zh: {
    setup: "终端设置",
    merchAddr: "商户地址",
    localCurr: "本地货币",
    save: "保存并开始",
    live: "实时",
    scan: "使用 Bitcoin.com, Paytaca 或 Electron 扫描",
    destAddr: "目标地址",
    copy: "复制",
    cex: "⚠️ 仅限中心化交易所",
    useFor: "手动用于 Binance, OKX, Bybit。",
    mempool: "扫描内存池...",
    close: "关闭 / 新订单",
    verifying: "正在验证 0-Conf...",
    double: "检查双花证明",
    paid: "已支付",
    safe: "检测到安全交易",
    newOrder: "新订单",
    charge: "收款",
    smart: "⚡ 智能支付",
    exchange: "🏦 兑换",
    warning: "警告：检测到双花尝试！"
  }
};

export default function POSPage() {
  const [amount, setAmount] = useState('0');
  const [showQR, setShowQR] = useState(false);
  const [merchantAddress, setMerchantAddress] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [qrTab, setQrTab] = useState('smart'); 
  const [currency, setCurrency] = useState('usd');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [txHash, setTxHash] = useState('');
  const [lang, setLang] = useState('en');
  
  const [rates, setRates] = useState({
    usd: 450.00,
    jod: 319.05,
    sar: 1687.50,
    aed: 1652.85,
    eur: 415.20,
    cny: 3250.00
  });

  const initialTxHistory = useRef(new Set());
  const isHistoryLoaded = useRef(false);

  const currencies = [
    { code: 'usd', symbol: '$', flag: '🇺🇸' },
    { code: 'jod', symbol: 'JD', flag: '🇯🇴' },
    { code: 'sar', symbol: '﷼', flag: '🇸🇦' },
    { code: 'aed', symbol: 'د.إ', flag: '🇦🇪' },
    { code: 'eur', symbol: '€', flag: '🇪🇺' },
    { code: 'cny', symbol: '¥', flag: '🇨🇳' },
  ];

  useEffect(() => {
    const savedLang = localStorage.getItem('payonce_lang');
    if (savedLang) setLang(savedLang);

    const fetchPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd,jod,sar,aed,eur,cny');
        if (!res.ok) throw new Error('API Limit');
        const data = await res.json();
        if (data['bitcoin-cash']) {
            setRates(data['bitcoin-cash']);
        }
      } catch (error) {
        console.log("Using cached rates");
      }
    };
    
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); 
    
    const savedAddr = localStorage.getItem('pos_wallet');
    const savedCurr = localStorage.getItem('pos_currency');
    
    if (savedAddr) {
        setMerchantAddress(savedAddr);
        setIsSettingsOpen(false);
    }
    if (savedCurr && currencies.some(c => c.code === savedCurr)) {
        setCurrency(savedCurr);
    }

    return () => clearInterval(interval);
  }, []);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('payonce_lang', l);
  };

  const t = translations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const handleSaveSettings = (e) => {
      e.preventDefault();
      const cleanAddr = merchantAddress.replace('bitcoincash:', '');
      localStorage.setItem('pos_wallet', cleanAddr);
      localStorage.setItem('pos_currency', currency);
      setMerchantAddress(cleanAddr);
      setIsSettingsOpen(false);
  };

  const handlePress = (val) => {
    if (showQR) {
        setShowQR(false);
        setPaymentStatus('pending');
    }
    if (val === 'C') {
      setAmount('0');
      return;
    }
    if (val === '.') {
      if (amount.includes('.')) return;
    }
    setAmount(prev => (prev === '0' ? val : prev + val));
  };

  const handleBackspace = () => {
    setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const activeCurrency = currencies.find(c => c.code === currency) || currencies[0];
  const currentRate = rates[currency] || 0;
  const bchAmount = currentRate > 0 ? (parseFloat(amount) / currentRate).toFixed(8) : '0.00';
  
  const smartLink = `bitcoincash:${merchantAddress}?amount=${bchAmount}`;
  const simpleLink = merchantAddress;

  const currentLink = qrTab === 'smart' ? smartLink : simpleLink;
  const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(currentLink)}&size=300&centerImageUrl=https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png&centerImageSizeRatio=0.2&dark=000000&light=ffffff`;

  useEffect(() => {
      let interval;
      
      const loadInitialHistory = async () => {
          if (!merchantAddress) return;
          try {
              const res = await fetch(`https://api.blockchair.com/bitcoin-cash/dashboards/address/${merchantAddress}`);
              const json = await res.json();
              const addressData = json.data[merchantAddress];
              
              if (addressData && addressData.transactions) {
                  addressData.transactions.forEach(tx => initialTxHistory.current.add(tx));
              }
              isHistoryLoaded.current = true;
          } catch (e) {
              console.error("Failed to load initial history", e);
          }
      };

      if (merchantAddress && !isHistoryLoaded.current) {
          loadInitialHistory();
      }

      if (showQR && paymentStatus === 'pending' && merchantAddress && bchAmount > 0) {
          const expectedSats = Math.floor(parseFloat(bchAmount) * 100000000) - 1000;

          interval = setInterval(async () => {
              try {
                  
                  const res = await fetch(`https://api.blockchair.com/bitcoin-cash/dashboards/address/${merchantAddress}`);
                  const json = await res.json();
                  const addressData = json.data[merchantAddress];
                  
                  if (!addressData || !addressData.transactions) return;

                  
                  const newHashes = addressData.transactions.filter(tx => !initialTxHistory.current.has(tx));

                  for (const hash of newHashes) {
                      
                      const txRes = await fetch(`https://api.blockchair.com/bitcoin-cash/dashboards/transaction/${hash}`);
                      const txJson = await txRes.json();
                      const txData = txJson.data[hash];

                      if (txData && txData.outputs) {
                         
                          const cleanMerchantAddr = merchantAddress.replace('bitcoincash:', '');
                          
                          const matchingOutput = txData.outputs.find(out => {
                              const cleanRecipient = out.recipient.replace('bitcoincash:', '');
                              return cleanRecipient === cleanMerchantAddr && out.value >= expectedSats;
                          });

                          if (matchingOutput) {
                              clearInterval(interval);
                              setPaymentStatus('verifying');
                              setTxHash(hash);
                              
                              if (txData.transaction && !txData.transaction.is_double_spend_detected) {
                                  setPaymentStatus('success');
                              } else {
                                  alert(t.warning);
                                  setPaymentStatus('pending'); 
                              }
                              return; 
                          } else {
                            
                              initialTxHistory.current.add(hash);
                          }
                      }
                  }
              } catch (err) {
                  console.error("Polling error:", err);
              }
          }, 4000); 
      return () => clearInterval(interval);
  }, [showQR, paymentStatus, merchantAddress, bchAmount, lang]);


  return (
    <div dir={dir} className={`min-h-screen bg-black text-white font-sans flex items-center justify-center p-4 selection:bg-green-500/30 ${lang === 'ar' ? 'font-arabic' : ''}`}>
      
      <div className="absolute top-6 right-6 flex gap-2 text-[10px] font-black uppercase z-50">
        <button onClick={() => changeLang('en')} className={`${lang === 'en' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>EN</button>
        <button onClick={() => changeLang('ar')} className={`${lang === 'ar' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>AR</button>
        <button onClick={() => changeLang('zh')} className={`${lang === 'zh' ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>CN</button>
      </div>

      {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-3xl w-full max-w-sm animate-fade-in-up">
                  <h2 className="text-xl font-black uppercase italic mb-4">{t.setup}</h2>
                  <div className="mb-4">
                      <label className="text-xs text-zinc-500 uppercase font-bold">{t.merchAddr}</label>
                      <input 
                        type="text" 
                        placeholder="qpm2q..." 
                        value={merchantAddress}
                        onChange={(e) => setMerchantAddress(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl p-3 mt-2 text-sm focus:border-green-500 outline-none transition-colors"
                      />
                  </div>
                  <div className="mb-6">
                      <label className="text-xs text-zinc-500 uppercase font-bold">{t.localCurr}</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                          {currencies.map((c) => (
                              <button 
                                key={c.code}
                                onClick={() => setCurrency(c.code)}
                                className={`p-2 rounded-lg text-xs font-bold border ${currency === c.code ? 'bg-green-600 border-green-500 text-white' : 'bg-black border-white/10 text-zinc-500'}`}
                              >
                                  {c.flag} {c.code.toUpperCase()}
                              </button>
                          ))}
                      </div>
                  </div>
                  <button 
                    onClick={handleSaveSettings}
                    disabled={!merchantAddress}
                    className="w-full bg-green-500 text-black font-bold py-3 rounded-xl disabled:opacity-50 hover:bg-green-400 transition-all shadow-lg shadow-green-900/20"
                  >
                      {t.save}
                  </button>
              </div>
          </div>
      )}

      <div className="w-full max-w-sm bg-[#111] border border-zinc-800 rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col h-[750px]">
        
        <div className={`absolute top-6 ${lang === 'ar' ? 'right-6' : 'left-6'} z-10`}>
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">{t.live}</span>
            </div>
        </div>

        <button onClick={() => setIsSettingsOpen(true)} className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} text-zinc-600 hover:text-white transition-colors z-10 p-2`}>
            ⚙️
        </button>

        <div className={`flex-1 flex flex-col justify-end p-8 ${lang === 'ar' ? 'text-left' : 'text-right'} bg-gradient-to-b from-[#0a0a0a] to-[#141414]`}>
            <div className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-auto text-center opacity-60 bg-green-900/10 py-1 rounded-full border border-green-500/10 mx-auto px-4 mt-8">
                1 BCH ≈ {activeCurrency.symbol}{currentRate}
            </div>
            
            <div className="text-zinc-500 text-sm font-mono mb-1">
                ≈ {bchAmount} BCH
            </div>
            
            <div className={`flex ${lang === 'ar' ? 'justify-start' : 'justify-end'} items-center gap-4`}>
                {amount !== '0' && (
                    <button 
                        onClick={handleBackspace}
                        className="text-zinc-500 hover:text-red-500 transition-colors text-2xl p-2"
                    >
                        ⌫
                    </button>
                )}
                
                <div className="flex items-end gap-1">
                    <span className="text-zinc-500 text-3xl font-light mb-2">{activeCurrency.symbol}</span>
                    <span className={`text-7xl font-black tracking-tighter transition-all ${amount === '0' ? 'text-zinc-700' : 'text-white'}`}>
                        {amount}
                    </span>
                </div>
            </div>
        </div>

        {showQR && (
            <div className="absolute inset-0 bg-black/95 z-20 flex flex-col items-center justify-start pt-10 animate-fade-in px-6 text-center backdrop-blur-md">
                
                {paymentStatus === 'pending' && (
                    <>
                        <div className="flex bg-zinc-900 p-1 rounded-xl w-full mb-6 border border-white/10">
                            <button 
                                onClick={() => setQrTab('smart')}
                                className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${qrTab === 'smart' ? 'bg-green-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                            >
                                {t.smart}
                            </button>
                            <button 
                                onClick={() => setQrTab('exchange')}
                                className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${qrTab === 'exchange' ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                            >
                                {t.exchange}
                            </button>
                        </div>

                        <div className="bg-white p-4 rounded-3xl mb-4 shadow-[0_0_60px_rgba(0,0,0,0.5)] ring-4 ring-green-500/20 transition-all duration-300 transform hover:scale-105 relative">
                            <img 
                                src={qrImageUrl} 
                                alt="Payment QR"
                                className="w-[220px] h-[220px] object-contain"
                            />
                        </div>

                        {qrTab === 'smart' ? (
                            <div className="animate-fade-in">
                                <h3 className="text-2xl font-black text-white mb-1">{activeCurrency.symbol}{amount}</h3>
                                <p className="text-green-500 font-mono text-sm mb-2 bg-green-500/10 px-4 py-1 rounded-full border border-green-500/20 inline-block">{bchAmount} BCH</p>
                                <p className="text-[10px] text-zinc-500 mt-2">{t.scan}</p>
                            </div>
                        ) : (
                            <div className="animate-fade-in w-full">
                                <h3 className="text-2xl font-black text-white mb-1">{activeCurrency.symbol}{amount}</h3>
                                <p className="text-green-500 font-mono text-sm mb-4 bg-green-500/10 px-4 py-1 rounded-full border border-green-500/20 inline-block">{bchAmount} BCH</p>
                                
                                <div 
                                    onClick={() => navigator.clipboard.writeText(merchantAddress)}
                                    className="w-full bg-zinc-900/80 border border-white/5 p-4 rounded-2xl cursor-pointer hover:bg-zinc-900 transition-colors group"
                                >
                                    <p className={`text-[9px] text-zinc-500 uppercase font-bold mb-2 tracking-widest flex ${lang === 'ar' ? 'justify-between flex-row-reverse' : 'justify-between'}`}>
                                        {t.destAddr}
                                        <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">{t.copy}</span>
                                    </p>
                                    <p className="font-mono text-xs text-zinc-300 break-all text-left">
                                        {merchantAddress}
                                    </p>
                                    <div className="w-full h-[1px] bg-white/5 my-3"></div>
                                    <p className="text-[10px] text-zinc-400 text-left">
                                        <span className="block text-white font-bold mb-1">{t.cex}</span>
                                        {t.useFor}
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-auto mb-6 w-full space-y-3">
                            <div className="flex items-center justify-center gap-2 text-[10px] text-green-500/70 font-mono animate-pulse">
                                <span>{t.mempool}</span>
                            </div>
                            <button 
                                onClick={() => setShowQR(false)}
                                className="w-full bg-zinc-800 text-white py-4 rounded-2xl font-bold hover:bg-zinc-700 border border-white/5 transition-all mt-auto mb-6"
                            >
                                {t.close}
                            </button>
                        </div>
                    </>
                )}

                {paymentStatus === 'verifying' && (
                    <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in-95">
                        <div className="w-20 h-20 border-4 border-zinc-800 border-t-green-500 rounded-full animate-spin mb-6"></div>
                        <h2 className="text-xl font-black uppercase italic text-white tracking-tight">{t.verifying}</h2>
                        <p className="text-xs text-zinc-500 mt-2 font-mono">{t.double}</p>
                    </div>
                )}

                {paymentStatus === 'success' && (
                    <div className="flex flex-col items-center justify-center h-full w-full bg-green-500 animate-in slide-in-from-bottom-10 duration-500">
                        <div className="bg-white text-green-600 w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 shadow-2xl scale-110">
                            ✓
                        </div>
                        <h1 className="text-4xl font-black uppercase italic text-black tracking-tighter mb-2">{t.paid}</h1>
                        <p className="text-black font-bold text-lg">{activeCurrency.symbol}{amount}</p>
                        <div className="bg-black/10 px-6 py-2 rounded-full mt-4">
                            <p className="text-black text-[10px] font-black uppercase tracking-widest">{t.safe}</p>
                        </div>
                        <p className="text-black/50 text-[9px] font-mono mt-2">TxID: {txHash.slice(0, 15)}...</p>
                        
                        <button 
                            onClick={() => { setShowQR(false); setPaymentStatus('pending'); setAmount('0'); }}
                            className="mt-12 bg-black text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
                        >
                            {t.newOrder}
                        </button>
                    </div>
                )}
            </div>
        )}

        <div className="grid grid-cols-3 gap-[1px] bg-zinc-800 border-t border-zinc-800">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'C'].map((btn) => (
                <button 
                    key={btn}
                    onClick={() => handlePress(btn.toString())}
                    className={`h-20 text-2xl font-bold transition-all active:bg-zinc-700 outline-none ${
                        btn === 'C' ? 'bg-[#1a1111] text-red-400 hover:bg-red-900/20' : 'bg-[#1a1a1a] text-white hover:bg-[#202020]'
                    }`}
                >
                    {btn}
                </button>
            ))}
        </div>

        <button 
            onClick={() => amount !== '0' && setShowQR(true)}
            className="w-full bg-green-600 text-white font-black text-xl py-6 hover:bg-green-500 transition-all active:scale-[0.99] shadow-[0_-10px_40px_rgba(34,197,94,0.2)]"
        >
            {t.charge}
        </button>

      </div>
    </div>
  );
}
