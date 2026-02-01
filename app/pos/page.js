'use client';

import { useState, useEffect } from 'react';

export default function POSPage() {
  const [amount, setAmount] = useState('0');
  const [bchPrice, setBchPrice] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [merchantAddress, setMerchantAddress] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [qrTab, setQrTab] = useState('smart'); 
  const [currency, setCurrency] = useState('usd');
  const [rates, setRates] = useState({});

  const currencies = [
    { code: 'usd', symbol: '$', flag: '🇺🇸' },
    { code: 'jod', symbol: 'JD', flag: '🇯🇴' },
    { code: 'sar', symbol: '﷼', flag: '🇸🇦' },
    { code: 'aed', symbol: 'د.إ', flag: '🇦🇪' },
    { code: 'eur', symbol: '€', flag: '🇪🇺' },
  ];

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd,jod,sar,aed,eur');
        const data = await res.json();
        setRates(data['bitcoin-cash']);
        setBchPrice(data['bitcoin-cash'][currency]);
      } catch (error) {
        setBchPrice(400); 
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
    if (savedCurr) setCurrency(savedCurr);

    return () => clearInterval(interval);
  }, [currency]);

  useEffect(() => {
      if (rates[currency]) {
          setBchPrice(rates[currency]);
      }
  }, [currency, rates]);

  const handleSaveSettings = (e) => {
      e.preventDefault();
      const cleanAddr = merchantAddress.replace('bitcoincash:', '');
      localStorage.setItem('pos_wallet', cleanAddr);
      localStorage.setItem('pos_currency', currency);
      setMerchantAddress(cleanAddr);
      setIsSettingsOpen(false);
  };

  const handlePress = (val) => {
    if (showQR) setShowQR(false);
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

  const bchAmount = bchPrice ? (parseFloat(amount) / bchPrice).toFixed(8) : '0.00';
  
  const smartLink = `bitcoincash:${merchantAddress}?amount=${bchAmount}`;
  const simpleLink = merchantAddress;

  const currentLink = qrTab === 'smart' ? smartLink : simpleLink;
  const activeCurrency = currencies.find(c => c.code === currency);
  
  const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(currentLink)}&size=300&centerImageUrl=https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png&centerImageSizeRatio=0.2&dark=000000&light=ffffff`;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4 selection:bg-green-500/30">
      
      {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-3xl w-full max-w-sm animate-fade-in-up">
                  <h2 className="text-xl font-black uppercase italic mb-4">Terminal Setup</h2>
                  <div className="mb-4">
                      <label className="text-xs text-zinc-500 uppercase font-bold">Merchant Address</label>
                      <input 
                        type="text" 
                        placeholder="qpm2q..." 
                        value={merchantAddress}
                        onChange={(e) => setMerchantAddress(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl p-3 mt-2 text-sm focus:border-green-500 outline-none transition-colors"
                      />
                  </div>
                  <div className="mb-6">
                      <label className="text-xs text-zinc-500 uppercase font-bold">Local Currency</label>
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
                      Save & Start
                  </button>
              </div>
          </div>
      )}

      <div className="w-full max-w-sm bg-[#111] border border-zinc-800 rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col h-[750px]">
        
        <div className="absolute top-6 left-6 z-10">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Live</span>
            </div>
        </div>

        <button onClick={() => setIsSettingsOpen(true)} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors z-10 p-2">
            ⚙️
        </button>

        <div className="flex-1 flex flex-col justify-end p-8 text-right bg-gradient-to-b from-[#0a0a0a] to-[#141414]">
            <div className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-auto text-center opacity-60 bg-green-900/10 py-1 rounded-full border border-green-500/10 mx-auto px-4 mt-8">
                1 BCH ≈ {activeCurrency.symbol}{bchPrice}
            </div>
            
            <div className="text-zinc-500 text-sm font-mono mb-1">
                ≈ {bchAmount} BCH
            </div>
            
            <div className="flex justify-end items-center gap-4">
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
                
                <div className="flex bg-zinc-900 p-1 rounded-xl w-full mb-6 border border-white/10">
                    <button 
                        onClick={() => setQrTab('smart')}
                        className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${qrTab === 'smart' ? 'bg-green-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                    >
                        ⚡ Smart Pay
                    </button>
                    <button 
                        onClick={() => setQrTab('exchange')}
                        className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${qrTab === 'exchange' ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                    >
                        🏦 Exchange
                    </button>
                </div>

                <div className="bg-white p-4 rounded-3xl mb-4 shadow-[0_0_60px_rgba(0,0,0,0.5)] ring-4 ring-green-500/20 transition-all duration-300 transform hover:scale-105">
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
                        <p className="text-[10px] text-zinc-500 mt-2">Scan with Bitcoin.com, Paytaca, or Electron Cash</p>
                    </div>
                ) : (
                    <div className="animate-fade-in w-full">
                        <h3 className="text-2xl font-black text-white mb-1">{activeCurrency.symbol}{amount}</h3>
                        <p className="text-green-500 font-mono text-sm mb-4 bg-green-500/10 px-4 py-1 rounded-full border border-green-500/20 inline-block">{bchAmount} BCH</p>
                        
                        <div 
                            onClick={() => navigator.clipboard.writeText(merchantAddress)}
                            className="w-full bg-zinc-900/80 border border-white/5 p-4 rounded-2xl cursor-pointer hover:bg-zinc-900 transition-colors group"
                        >
                            <p className="text-[9px] text-zinc-500 uppercase font-bold mb-2 tracking-widest flex justify-between">
                                Destination Address
                                <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                            </p>
                            <p className="font-mono text-xs text-zinc-300 break-all text-left">
                                {merchantAddress}
                            </p>
                            <div className="w-full h-[1px] bg-white/5 my-3"></div>
                            <p className="text-[10px] text-zinc-400 text-left">
                                <span className="block text-white font-bold mb-1">⚠️ Centralized Exchanges Only</span>
                                Use this for <span className="text-white">Binance, OKX, Bybit</span> manually.
                            </p>
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={() => setShowQR(false)}
                    className="w-full bg-zinc-800 text-white py-4 rounded-2xl font-bold hover:bg-zinc-700 border border-white/5 transition-all mt-auto mb-6"
                >
                    Close / New Order
                </button>
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
            CHARGE
        </button>

      </div>
    </div>
  );
}
