'use client';

export default function BannerPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-10">
      
      {/* Twitter/X Header Dimensions: 1500x500 pixels 
        We use a scaled container to view it easily 
      */}
      <div className="relative w-[1500px] h-[500px] bg-[#050505] overflow-hidden flex items-center px-24 border border-zinc-800 shadow-2xl">
        
        {/* Background Effects */}
        <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-green-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full flex justify-between items-center">
            
            {/* Left Side: Text */}
            <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 border border-green-500/30 bg-green-500/10 px-4 py-1 rounded-full mb-6">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-green-400 font-mono text-sm font-bold tracking-widest uppercase">Live on Mainnet</span>
                </div>
                
                <h1 className="text-8xl font-black uppercase italic tracking-tighter leading-none mb-4 text-white">
                    Build The <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Sovereign Economy</span>
                </h1>
                
                <p className="text-2xl text-zinc-400 font-medium max-w-2xl leading-relaxed">
                    The non-custodial payment layer for Bitcoin Cash. <br/>
                    <span className="text-white">Instant. Trustless. Permissionless.</span>
                </p>
            </div>

            {/* Right Side: Abstract Visual / Code */}
            <div className="hidden md:block">
                <div className="relative">
                    {/* Code Snippet Card */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 font-mono text-sm text-zinc-400 shadow-2xl rotate-3 transform translate-x-10 scale-125">
                        <div className="flex gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div>
                            <span className="text-purple-400">const</span> pay <span className="text-purple-400">=</span> <span className="text-yellow-300">await</span> PayOnce.<span className="text-blue-400">charge</span>({'{'}
                        </div>
                        <div className="pl-4">
                            amount: <span className="text-orange-400">15.00</span>,
                        </div>
                        <div className="pl-4">
                            currency: <span className="text-green-400">'USD'</span>,
                        </div>
                         <div className="pl-4">
                            viral: <span className="text-blue-400">true</span>
                        </div>
                        <div>{'}'});</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Badge */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-50">
            <span className="text-xs font-black uppercase tracking-[4px] text-white">Powered by Bitcoin Cash</span>
             <img src="https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png" className="w-6 h-6 grayscale" alt="BCH" />
        </div>

      </div>
    </div>
  );
}
