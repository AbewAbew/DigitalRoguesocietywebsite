
import React from 'react';
import { motion } from 'framer-motion';

const partners = [
  { 
      name: "National Electoral Board of Ethiopia (NEBE)", 
      desc: "Licensed to undertake online voter education for both the Six and Seventh Ethiopian General election. Licensed for election observation focusing on political parties' social media activities.", 
      code: "NEBE",
      img: "/partners/National Electoral Board of Ethiopia (NEBE).png"
  },
  { 
      name: "Center for International Private Enterprise (CIPE)", 
      desc: "Partner for civic entrepreneurship incubation. Past recipient of organizational strengthening fund for 'Restoring Ethiopia’s Civic Space'.", 
      code: "CIPE",
      img: "/partners/Center for International Private Enterprise (CIPE).png"
  },
  { 
      name: "Agence française de développement (AFD)", 
      desc: "Implementing 'Ethiopian Civil Society Engagement Program'. Accelerating Digital Activism and AI skills among civic space actors.", 
      code: "AFD",
      img: "/partners/AFD.png"
  },
  { 
      name: "National Democratic Institute (NDI)", 
      desc: "Partnered to enhance capacity of marginalized Youth in National Dialogue processes. Pioneered AI-assisted 'Mekeker-Ethiopia' digital campaign.", 
      code: "NDI",
      img: "/partners/NDI.png"
  },
  { 
      name: "UN Capital Development Fund & Women’s World Banking", 
      desc: "Advocating for women's digital financial inclusion. Developed Women-Centered Design Principles for Mobile Money Service Providers.", 
      code: "UNCDF",
      img: "/partners/UN Capital Development Fund & Women’s World Banking.png"
  },
  { 
      name: "META", 
      desc: "Active partnership to advance digital rights promotion, privacy, and responsible technology use within Ethiopia's digital landscape.", 
      code: "META",
      img: "/partners/meta.png"
  },
  { 
      name: "Australian Embassy", 
      desc: "Implemented online voter education project targeting people with disabilities, first time and women voters, reaching over 400,000 Ethiopians using Amharic and Afan Oromo.", 
      code: "AU",
      img: "/partners/Australian Embassy.png"
  },
  { 
      name: "Grand Duchy of Luxembourg Embassy", 
      desc: "Promoting Digital Safety education and practice among Ethiopian Civic Space actors to foster a safer digital environment.", 
      code: "LUX",
      img: "/partners/Luxembourg.png"
  },
  { 
      name: "Coalition of Civil Societies for Election (CECOE)", 
      desc: "Member organization utilizing digital expertise to advance election dynamics through locally nurtured innovation.", 
      code: "CECOE",
      img: "/partners/Coalition of Civil Societies for Election (CECOE).png"
  },
  { 
      name: "Ethiopian CSO Council (ECSOC)", 
      desc: "Active MoU aimed at strengthening capacity and interconnectedness of CSOs through platforms developed by DRSE.G.", 
      code: "ECSOC",
      img: "/partners/Ethiopian CSO Council (ECSOC).png"
  },
  { 
      name: "Civic Tech Innovation Network (CTIN)", 
      desc: "Mapped from Ethiopia for employing civic technology solutions. Contributor to case studies and online discussion forums.", 
      code: "CTIN",
      img: "/partners/Civic Tech Innovation Network (CTIN).png"
  },
  { 
      name: "Alliance of CSOs of Tigray (ACSOT)", 
      desc: "Digitally empowering ACSOT member organizations through DERSHA.net and TSEDAL platforms for networking and capacity building.", 
      code: "ACSOT",
      img: "/partners/Alliance of CSOs of Tigray (ACSOT).png"
  }
];

const Partners: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
             <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">Strategic Partnerships</h1>
             <p className="text-slate-400 max-w-2xl mx-auto">
                Collaborating with global and local entities to drive digital change, policy influence, and civic innovation across Ethiopia.
             </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((p, i) => (
                <motion.div 
                    key={i}
                    layout
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    className="glass-panel p-8 rounded-2xl hover:bg-white/10 transition-colors duration-300 group flex flex-col justify-between overflow-hidden"
                >
                    <motion.div layout className="flex justify-between items-start mb-6">
                        {p.img ? (
                            <div className="h-16 w-auto min-w-[4rem] max-w-[8rem] bg-white rounded-xl p-2 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden">
                                <img src={p.img} alt={p.name} className="h-full w-full object-contain relative z-10" />
                            </div>
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold font-display text-white shrink-0">
                                {p.code}
                            </div>
                        )}
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)] mt-3"></div>
                    </motion.div>
                    
                    <div>
                        <motion.h3 layout className="font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors leading-tight">
                            {p.name}
                        </motion.h3>

                        <motion.div
                            variants={{
                                hover: { height: 'auto', opacity: 1, marginTop: 12 },
                                visible: { height: 0, opacity: 0, marginTop: 0 },
                                hidden: { height: 0, opacity: 0, marginTop: 0 }
                            }}
                            className="overflow-hidden"
                        >
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {p.desc}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Partners;
