
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Compass } from 'lucide-react';

const About: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Registration Info */}
        <div className="mb-16 text-center border-b border-white/10 pb-12">
             <p className="text-slate-400 text-sm max-w-3xl mx-auto font-mono">
                DRSE.G is a civil society organization registered in accordance to the Ethiopian Civil Society Organizations Proclamation with Registration Number <span className="text-blue-400 font-bold">4628</span>.
             </p>
        </div>

        {/* Mission / Vision Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
            <div>
                <span className="text-blue-500 font-display tracking-widest text-sm mb-4 block font-bold">WHO WE ARE</span>
                <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-8 text-white">
                    Innovating for <span className="text-blue-400">Accountability</span> & Inclusion
                </h1>
                <p className="text-lg text-slate-200 font-light leading-relaxed mb-6">
                    The Experiment Group uses technology to inform and advocate civic engagements with the introduction of effective and reliable ways of experimentation. 
                </p>
                <p className="text-lg text-slate-200 font-light leading-relaxed">
                    We advocate for informed digital inclusion and seek innovative solutions to fake news and disinformation, and work to ensure accountability and transparency of government, civic actors, and businesses.
                </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                {/* Vision */}
                <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-3 mb-3">
                        <Eye className="text-blue-400" size={24} />
                        <h3 className="font-display text-xl font-bold text-white">Our Vision</h3>
                    </div>
                    <p className="text-slate-300 font-light">
                        To see a digitally empowered Ethiopian society where technology serves as a bridge for transparency, accountability, and equitable civic participation.
                    </p>
                </div>

                {/* Mission */}
                <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-purple-500">
                     <div className="flex items-center gap-3 mb-3">
                        <Target className="text-purple-400" size={24} />
                        <h3 className="font-display text-xl font-bold text-white">Our Mission</h3>
                    </div>
                    <p className="text-slate-300 font-light">
                        To design and deploy innovative digital solutions that enhance civic engagement, foster media literacy, and protect digital rights in Ethiopia.
                    </p>
                </div>
            </div>
        </div>

        {/* Core Values */}
        <div className="mb-32">
            <h2 className="font-display text-3xl font-bold mb-12 text-center text-white">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Innovation", desc: "Constantly experimenting with new technologies." },
                    { title: "Integrity", desc: "Upholding truth and transparency in all we do." },
                    { title: "Inclusivity", desc: "Leaving no one behind in the digital era." },
                    { title: "Accountability", desc: "Taking ownership of our impact and actions." }
                ].map((val, i) => (
                    <div key={i} className="glass-panel p-6 rounded-xl text-center hover:bg-white/5 transition-colors">
                        <Heart className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                        <h4 className="font-bold text-lg text-white mb-2">{val.title}</h4>
                        <p className="text-slate-400 text-sm">{val.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Strategic Objectives */}
        <div className="glass-panel p-8 md:p-16 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
                        <Compass size={24} />
                    </div>
                    <h2 className="font-display text-3xl font-bold text-white">Strategic Objectives</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {[
                        "Enhance digital literacy among marginalized communities",
                        "Develop tools for real-time hate speech detection and monitoring",
                        "Strengthen the capacity of Civic Actors through technology",
                        "Foster Digital Rights Education and advocating Consumer Protection",
                        "Shape a responsible AI future for Ethiopia by leading the conversation on Governance, Ethics, and Inclusive Innovation",
                        "Promote Women's Participation in the Digital Civic and Financial spaces"
                    ].map((obj, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs font-bold mt-1 shrink-0">{i + 1}</span>
                            <p className="text-slate-300">{obj}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </motion.div>
  );
};

export default About;
