import React from 'react';
import { Facebook, Linkedin, Mail, MapPin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
                <h2 className="font-display text-2xl font-bold mb-4">DRSE.G</h2>
                <p className="text-slate-400 text-sm max-w-md mb-6">
                    Pioneering digital civic solutions for accountability, transparency, and engagement in Ethiopia.
                </p>
                <div className="flex gap-4">
                     <a href="https://www.facebook.com/share/1A7mjcr1mq/" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                         <Facebook size={18} />
                     </a>
                     <a href="https://www.linkedin.com/company/digtial-rogue-society-experiment-group/" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-700 transition-colors text-white">
                         <Linkedin size={18} />
                     </a>
                     <a href="https://www.youtube.com/@DRSE.G" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 transition-colors text-white">
                         <Youtube size={18} />
                     </a>
                </div>
            </div>

            <div>
                <h4 className="font-bold mb-4 text-sm tracking-widest uppercase">Expertise</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li>Privacy & Protection</li>
                    <li>Digital Literacy</li>
                    <li>AI Ethics</li>
                    <li>Civic Tech</li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold mb-4 text-sm tracking-widest uppercase">Contact</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                        <MapPin size={16} className="mt-1 flex-shrink-0" /> 
                        <span>Muller Bldg 4th Floor,<br/> Addis Ababa, Ethiopia</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <Mail size={16} /> communication@digitalroguesociety.org
                    </li>
                    <li className="text-blue-400 font-mono text-xs">
                        +251-927-987-727
                    </li>
                </ul>
            </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Digital Rogue Society Experiment Group.</p>
            <p>Designed with Civic Innovation.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;