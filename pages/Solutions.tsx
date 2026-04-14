
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Database, GraduationCap, Vote, Smartphone, CheckCircle2, Link as LinkIcon, Users } from 'lucide-react';

const Solutions: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
         {/* Header */}
         <div className="text-center mb-24">
             <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-white">Our Solutions</h1>
             <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                The redefined role of civil societies is demonstrated and interconnected within our experimentation hub and digital arsenal.
             </p>
          </div>

        {/* Digital Arsenal Spotlight */}
        <div className="mb-32">
            <h2 className="font-display text-3xl font-bold mb-12 text-white border-l-4 border-blue-500 pl-4">The Digital Arsenal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* DERSHA */}
                <motion.a 
                    href="https://dersha.net/" 
                    target="_blank"
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel rounded-3xl border border-white/10 group relative overflow-hidden flex flex-col"
                >
                    <div className="absolute top-4 right-4 z-10 opacity-50 group-hover:opacity-100 transition-opacity bg-black/40 p-2 rounded-full backdrop-blur-sm">
                        <ExternalLink size={20} className="text-blue-400" />
                    </div>
                    <div className="w-full h-56 relative overflow-hidden bg-[#020617] border-b border-white/5">
                        <img src="/Dersha.png" alt="DERSHA.net Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-8 flex-grow">
                        <h3 className="font-display text-3xl font-bold text-white mb-2">DERSHA.net</h3>
                        <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">Civic Actors Network</p>
                        <p className="text-slate-300 leading-relaxed">
                            Empowers Ethiopian CSOs by connecting, collaborating, and sharing resources. Strengthens transparency and drives collective change through a centralized directory and resource hub.
                        </p>
                    </div>
                </motion.a>

                {/* TSEDAL */}
                <motion.a 
                    href="https://tsedal.et/en" 
                    target="_blank"
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel rounded-3xl border border-white/10 group relative overflow-hidden flex flex-col"
                >
                    <div className="absolute top-4 right-4 z-10 opacity-50 group-hover:opacity-100 transition-opacity bg-black/40 p-2 rounded-full backdrop-blur-sm">
                        <ExternalLink size={20} className="text-purple-400" />
                    </div>
                    <div className="w-full h-56 relative overflow-hidden bg-[#020617] border-b border-white/5">
                        <img src="/tsedal.png" alt="TSEDAL Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-8 flex-grow">
                        <h3 className="font-display text-3xl font-bold text-white mb-2">TSEDAL</h3>
                        <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">E-Learning Platform</p>
                        <p className="text-slate-300 leading-relaxed">
                            An online learning platform for youth and civic actors to boost digital literacy, AI ethics, and civic knowledge. Accessible education for a digital generation.
                        </p>
                    </div>
                </motion.a>

                 {/* MERCHA */}
                 <motion.a 
                    href="https://merchaethiopia.com/" 
                    target="_blank"
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel rounded-3xl border border-white/10 group relative overflow-hidden flex flex-col"
                >
                    <div className="absolute top-4 right-4 z-10 opacity-50 group-hover:opacity-100 transition-opacity bg-black/10 p-2 rounded-full backdrop-blur-sm">
                        <ExternalLink size={20} className="text-green-600" />
                    </div>
                    <div className="w-full h-56 relative overflow-hidden bg-white border-b border-white/5">
                        <img src="/mercha_ethiopia.png" alt="Mercha Ethiopia Banner" className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-8 flex-grow">
                        <h3 className="font-display text-3xl font-bold text-white mb-2">Mercha Ethiopia</h3>
                        <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">Voter Education</p>
                        <p className="text-slate-300 leading-relaxed">
                            Building participation of first-time voters, women, and people with disabilities through accessible digital tools and comprehensive voter information.
                        </p>
                    </div>
                </motion.a>

                {/* SEW */}
                 <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel rounded-3xl border border-white/10 group relative overflow-hidden flex flex-col"
                >
                     <div className="absolute top-4 right-4 z-10 opacity-50 group-hover:opacity-100 transition-opacity bg-black/40 p-2 rounded-full backdrop-blur-sm">
                        <ExternalLink size={20} className="text-orange-400" />
                    </div>
                    <div className="w-full h-56 relative overflow-hidden bg-[#020617] border-b border-white/5">
                        <img src="/sew.png" alt="SEW Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-8 flex-grow">
                        <h3 className="font-display text-3xl font-bold text-white mb-2">SEW</h3>
                        <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">Social Engagement Wing</p>
                        <p className="text-slate-300 leading-relaxed">
                            A robust platform designed to facilitate community organization and social connection, fostering deeper civic ties and grassroots mobilization.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>

        {/* Core Methodologies / Thematic Services */}
        <div>
             <h2 className="font-display text-3xl font-bold mb-12 text-white border-l-4 border-blue-500 pl-4">Core Methodologies</h2>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-8 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">Empowerment Platforms</h3>
                    <p className="text-slate-400 text-sm mb-4">For Individuals, Businesses, Media & CSOs</p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        Web, App, SMS, and USSD platforms allowing users to access personalized educational content aligned with democratic nation-building while retaining data sovereignty.
                    </p>
                    <ul className="space-y-2">
                        {["Personalized Content", "Democratic Education", "Data Control"].map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                <CheckCircle2 size={14} className="text-blue-500" /> {f}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-bold text-emerald-400 mb-4">Reporting Tools</h3>
                    <p className="text-slate-400 text-sm mb-4">For Stakeholders & Government</p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        Dashboard tools designed to trace, track, and report illegal encounters in civic engagements, helping stakeholders submit evidence and track actions.
                    </p>
                     <ul className="space-y-2">
                        {["Fact-Checking", "Evidence Submission", "Action Tracking"].map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                <CheckCircle2 size={14} className="text-emerald-500" /> {f}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-bold text-orange-400 mb-4">Networking & Advocacy</h3>
                    <p className="text-slate-400 text-sm mb-4">For Individuals, CSOs & Businesses</p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        Integrated platforms enabling advocacy for policy wins. An evidence-based influence tool ensuring accountability among government officials and civic actors.
                    </p>
                     <ul className="space-y-2">
                        {["Policy Influence", "Public Opinion", "Accountability"].map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                <CheckCircle2 size={14} className="text-orange-500" /> {f}
                            </li>
                        ))}
                    </ul>
                </div>
             </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Solutions;
