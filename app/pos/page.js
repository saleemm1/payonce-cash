'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function POSPage() {
  const [amount, setAmount] = useState('0');
  const [showQR, setShowQR] = useState(false);
  
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

  const generatePayment = () => {
    if (amount === '0') return;
    setShowQR(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#111] border border-zinc-800 rounded-[40px] shadow-2xl overflow-hidden relative">
        <div className="pt-8 pb-4 text-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-1">PayOnce Terminal</div>
            <div className="flex justify-center items-end gap-1">
                <span className="text-zinc-500 text-2xl font-light">$</span>
                <span className={`text-6xl font-black tracking-tighter ${showQR ? 'text-zinc-600' : 'text-white'}`}>
                    {amount}
                </span>
            </div>
        </div>

        {showQR && (
            <div className="absolute inset-0 bg-black/95 z-20 flex flex-col items-center justify-center animate-fade-in">
                <div className="bg-white p-4 rounded-3xl mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                    <QRCodeSVG 
                        value={`bitcoincash:?amount=${amount}&label=POS_Order`} 
                        size={200} 
                        level={"H"}
                        includeMargin={true}
                    />
                </div>
                <p className="text-zinc-400 text-sm animate-pulse mb-8">Waiting for payment...</p>
                <button 
                    onClick={() => setShowQR(false)}
                    className="bg-zinc-800 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-zinc-700"
                >
                    Cancel / New Order
                </button>
            </div>
        )}

        <div className="grid grid-cols-3 gap-3 p-6 bg-zinc-900/50 rounded-t-[40px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'C'].map((btn) => (
                <button 
                    key={btn}
                    onClick={() => handlePress(btn.toString())}
                    className={`h-20 rounded-2xl text-2xl font-bold transition-all active:scale-95 ${
                        btn === 'C' 
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                        : 'bg-[#1a1a1a] text-white hover:bg-[#252525]'
                    }`}
                >
                    {btn}
                </button>
            ))}
        </div>

        <div className="p-6 pt-0 bg-zinc-900/50">
            <button 
                onClick={generatePayment}
                className="w-full bg-green-500 text-black font-black text-xl py-5 rounded-2xl hover:bg-green-400 active:scale-95 transition-all shadow-lg shadow-green-900/20"
            >
                CHARGE
            </button>
        </div>
      </div>
    </div>
  );
}
