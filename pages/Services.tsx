import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Shield, Globe, BookOpen, Lock, Megaphone, CheckCircle2 } from 'lucide-react';

// Visual Component for each section
const ServiceVisual = ({ id }: { id: string }) => {
  switch (id) {
    case "01": // Empowerment
      return (
        <div className="relative w-full h-[400px] flex items-center justify-center bg-blue-900/10 rounded-3xl border border-white/10 overflow-hidden group hover:border-blue-500/30 transition-colors">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
             <motion.div 
               animate={{ y: [-10, 10, -10] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="relative z-10"
             >
                <Smartphone size={120} strokeWidth={1} className="text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
             </motion.div>
             <motion.div 
               animate={{ x: [20, 40, 20], y: [-20, -40, -20], rotate: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity }}
               className="absolute top-1/4 right-1/4 text-purple-400/60"
             >
                <BookOpen size={40} />
             </motion.div>
        </div>
      );
    case "02": // Reporting
      return (
        <div className="relative w-full h-[400px] flex items-center justify-center bg-emerald-900/10 rounded-3xl border border-white/10 overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
             <motion.div 
               animate={{ scale: [1, 1.05, 1] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="relative z-10"
             >
                <Shield size={120} strokeWidth={1} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
             </motion.div>
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute z-0 w-48 h-48 border border-dashed border-white/20 rounded-full"
             />
             <motion.div 
               animate={{ x: [30, 10, 30], opacity: [0.4, 0.8, 0.4] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute top-1/3 right-10 text-red-400/70"
             >
                <Lock size={30} />
             </motion.div>
        </div>
      );
    case "03": // Advocacy
      return (
        <div className="relative w-full h-[400px] flex items-center justify-center bg-orange-900/10 rounded-3xl border border-white/10 overflow-hidden group hover:border-orange-500/30 transition-colors">
             <motion.div 
               animate={{ rotate: [-5, 5, -5] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="relative z-10"
             >
                <Globe size={120} strokeWidth={1} className="text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" />
             </motion.div>
             {[1, 2, 3].map((i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5] }}
                 transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                 className="absolute z-0 border-2 border-orange-500/30 rounded-full w-32 h-32"
               />
             ))}
              <motion.div 
               animate={{ x: [-30, -50, -30], y: [20, 30, 20] }}
               transition={{ duration: 6, repeat: Infinity }}
               className="absolute bottom-1/4 left-1/4 text-white/50"
             >
                <Megaphone size={32} />
             </motion.div>
        </div>
      );
    default:
      return null;
  }
};

const Services: React.FC = () => {
  const steps = [
    {
      id: "01",
      title: "Empowerment Platforms",
      subtitle: "For Individuals, Businesses, Media & CSOs",
      desc: "The foundation of a strong democratic system is a well-informed citizenry. Our Web, App, SMS, and USSD platforms allow users to create profiles and access personalized educational content aligned with democratic nation-building. Users retain full control over their data.",
      features: ["Personalized Content", "Democratic Education", "Data Sovereignty"]
    },
    {
      id: "02",
      title: "Reporting Tools",
      subtitle: "For Stakeholders & Government",
      desc: "Our software includes dashboard tools designed to trace, track, and report illegal encounters in civic engagements. These fact-checking and reporting pools allow stakeholders to submit evidence, helping to track actions taken and conduct opinion polls.",
      features: ["Fact-Checking", "Evidence Submission", "Action Tracking"]
    },
    {
      id: "03",
      title: "Networking & Advocacy",
      subtitle: "For Individuals, CSOs & Businesses",
      desc: "Our integrated platform enables advocacy for policy wins or Executive attention. This networking and evidence-based influence tool ensures accountability among government officials and civic actors. We shape public opinions and strengthen missions.",
      features: ["Policy Influence", "Public Opinion Shaping", "Accountability Tools"]
    }
  ];

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
             <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-white">Thematic Areas</h1>
             <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                The redefined role of civil societies is demonstrated and interconnected within our experimentation hub.
             </p>
          </div>

          {/* Sections */}
          <div className="space-y-32">
             {steps.map((step, index) => (
               <motion.div 
                 key={index}
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.8 }}
                 className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
               >
                  {/* Visual Side */}
                  <div className="w-full lg:w-1/2">
                      <ServiceVisual id={step.id} />
                  </div>

                  {/* Text Side */}
                  <div className="w-full lg:w-1/2">
                      <div className="inline-block px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 font-display font-bold mb-6 border border-blue-500/30 text-sm">
                        ECOSYSTEM {step.id}
                      </div>
                      <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">{step.title}</h2>
                      <p className="font-mono text-sm text-slate-500 uppercase tracking-widest mb-6">{step.subtitle}</p>
                      
                      <p className="text-slate-300 text-lg leading-relaxed mb-8 border-l-2 border-blue-500/50 pl-6">
                        {step.desc}
                      </p>

                      <div className="flex flex-wrap gap-4">
                        {step.features.map((feat, i) => (
                            <div key={i} className="flex items-center gap-2 text-slate-400 text-sm font-medium bg-white/5 px-4 py-2 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors">
                                <CheckCircle2 size={16} className="text-blue-500" />
                                {feat}
                            </div>
                        ))}
                      </div>
                  </div>
               </motion.div>
             ))}
          </div>
       </div>
    </motion.div>
  );
};

export default Services;