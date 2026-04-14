import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Hand, Zap, X, Landmark, Smartphone, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contribute: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
              <div className="inline-block p-4 rounded-full bg-blue-600/20 mb-6">
                  <Zap className="w-12 h-12 text-blue-400" />
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-white">Contribute to the <br/><span className="text-blue-500">Experiment</span></h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Join us in shaping the future of civic technology in Ethiopia. Your support fuels our research, development, and advocacy efforts.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-colors text-left">
                  <Heart className="w-10 h-10 text-red-500 mb-6" />
                  <h3 className="font-display text-2xl font-bold text-white mb-2">Donate</h3>
                  <p className="text-slate-400 mb-6">Support our open-source tools and educational programs financially.</p>
                  <button 
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors w-full"
                  >
                      Make a Donation
                  </button>
              </div>

              <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-colors text-left">
                  <Hand className="w-10 h-10 text-emerald-500 mb-6" />
                  <h3 className="font-display text-2xl font-bold text-white mb-2">Volunteer</h3>
                  <p className="text-slate-400 mb-6">Lend your skills in coding, design, or advocacy to our projects.</p>
                  <Link to="/contact" className="block text-center px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors w-full">
                      Join the Team
                  </Link>
              </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f25]/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0f172a] rounded-3xl p-8 border border-white/10 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
              <h2 className="text-3xl font-bold font-display text-white mb-1">Support the Cause</h2>
              <p className="text-sm text-slate-400 mb-8">Every contribution fuels our mission.</p>
              
              <div className="space-y-6">
                {/* Bank Transfer */}
                <div className="bg-[#1e293b]/40 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-4 text-white font-bold ml-1">
                    <div className="bg-blue-600/20 p-2 rounded-lg">
                      <Landmark size={18} className="text-blue-400" />
                    </div>
                    Bank Transfer
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-[#0f172a] border border-white/5 rounded-xl p-3 px-4">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Bank Name</p>
                      <p className="text-white font-bold text-sm">Nib International Bank</p>
                    </div>
                    
                    <div className="bg-[#0f172a] border border-white/5 rounded-xl p-3 px-4 flex justify-between items-center group">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Account Number</p>
                        <p className="text-white font-bold tracking-wider">7000022953384</p>
                      </div>
                      <button 
                        onClick={() => handleCopy('7000022953384')}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                      >
                        {copied === '7000022953384' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="group-hover:text-white" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Telebirr */}
                <div className="bg-[#1e293b]/40 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-4 text-white font-bold ml-1">
                    <div className="bg-emerald-600/20 p-2 rounded-lg">
                      <Smartphone size={18} className="text-emerald-400" />
                    </div>
                    Telebirr Merchant ID
                  </div>
                  
                  <div className="bg-[#0f172a] border border-white/5 rounded-xl p-3 px-4 flex justify-between items-center group">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Merchant ID</p>
                      <p className="text-white font-bold tracking-wider">870946</p>
                    </div>
                    <button 
                      onClick={() => handleCopy('870946')}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                    >
                      {copied === '870946' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="group-hover:text-white" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="text-center text-[11px] text-slate-500 italic mt-8 font-medium">
                Please include your name in the transaction reference so we can thank you!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Contribute;
