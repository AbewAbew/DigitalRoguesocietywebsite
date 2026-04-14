import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Facebook, Linkedin, Youtube, Twitter } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Info */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-12">
                <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
                  Get In <br/><span className="text-blue-500">Touch</span>
                </h1>
                <p className="text-slate-400 text-lg font-light border-l-2 border-blue-500 pl-6">
                  239 - 408, Mickey Leland St., Muller Bldg – 4th Floor<br/> Addis Ababa, Ethiopia
                </p>
            </div>

            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-start gap-6 group hover:bg-white/5 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <Phone size={24} />
                    </div>
                    <div>
                        <h3 className="font-display text-xl font-bold text-white mb-2">Phone</h3>
                         <p className="text-slate-400 font-mono text-lg">
                           +251-927-987-727
                        </p>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-start gap-6 group hover:bg-white/5 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h3 className="font-display text-xl font-bold text-white mb-2">Email</h3>
                        <p className="text-slate-400 font-mono">
                           communication@digitalroguesociety.org
                        </p>
                    </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-4 mt-8">
                     <a href="https://www.facebook.com/share/1A7mjcr1mq/" target="_blank" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                         <Facebook size={20} />
                     </a>
                     <a href="https://www.linkedin.com/company/digtial-rogue-society-experiment-group/" target="_blank" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-700 transition-colors text-white">
                         <Linkedin size={20} />
                     </a>
                     <a href="https://www.youtube.com/@DRSE.G" target="_blank" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 transition-colors text-white">
                         <Youtube size={20} />
                     </a>
                </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[50px] rounded-full pointer-events-none"></div>
             
             <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="text-blue-400" />
                <h3 className="font-display text-2xl font-bold text-white">Send Message</h3>
             </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-slate-500 uppercase">First Name</label>
                  <input type="text" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Enter name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-slate-500 uppercase">Last Name</label>
                  <input type="text" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Enter name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-slate-500 uppercase">Email</label>
                <input type="email" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" placeholder="name@organization.com" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-slate-500 uppercase">Message</label>
                <textarea rows={5} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none" placeholder="Type your message here..."></textarea>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-display font-bold tracking-wider uppercase py-4 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                Send 
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default Contact;