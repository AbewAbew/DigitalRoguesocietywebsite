import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const programmesData = [
  {
    date: "April 2021 – September 2021",
    tag: "INCLUSION & VOTER AWARENESS",
    title: "Online Civic and Voter Education",
    desc: "Launched during Ethiopia's Sixth General Election, this project successfully boosted the participation of women, first-time voters, and persons with disabilities. Through the #MerchaEthiopia digital campaign, we delivered vital educational content in Amharic and Afan Oromo.",
    impact: "Reached over 400,000 Ethiopians in just three months via blogs, motion pictures, and infographics."
  },
  {
    date: "November 2022 – March 2023",
    tag: "CAPACITY BUILDING & LITERACY",
    title: "CSOs Digital Engagement Program",
    desc: "This pilot program established a benchmark for how digital learning platforms can strengthen civil society. We provided youth-focused organizations with intensive training in digital literacy, content preparation, and platform management.",
    impact: "Empowered 25+ youth organizations to professionalize their digital presence and content creation."
  },
  {
    date: "June 2023 – August 2023",
    tag: "MARGINALIZED YOUTH PARTICIPATION",
    title: "Heritage Ethiopia",
    desc: "We bridged the gap between marginalized youth—including taxi/auto-rickshaw drivers, local brokers, and sports fans—and the Ethiopian National Dialogue process. By combining in-person & online sessions with the #MekekerEthiopia digital campaign, we ensured their voices reached the highest levels of government.",
    impact: "Submitted 80+ grassroots issues to the Ethiopian National Dialogue Commission for official agenda framing."
  },
  {
    date: "January 2024 – June 2024",
    tag: "RESEARCH & POLICY ADVOCACY",
    title: "Bridging the Gender Gap in Digital Financial Service",
    desc: "Our research revealed critical barriers preventing women from accessing mobile money services (MMS). We moved beyond data by developing Women-Centered Design Principles and engaging directly with the National Bank of Ethiopia (NBE) and the Commercial Bank of Ethiopia (CBE).",
    impact: "Catalyzed official policy dialogues with the NBE and secured a commitment from CBEbirr to redesign their services for female users. The #ClosetheGenderGap campaign mobilized a national network of advocates."
  },
  {
    date: "July 2024 – December 2024",
    tag: "DIGITAL SECURITY & HUMAN RIGHTS",
    title: "Ethiopia Digital Rights Multiplier Program",
    desc: "Operating in Mekelle, Dire Dawa, and Jigjiga, this program built a frontline defense for digital rights. We trained a core group of \"Digital Rights Defenders,\" with a specific emphasis on protecting women, who are often the most vulnerable to online threats.",
    impact: "Developed 40 expert trainers who successfully empowered an additional 80 leaders in digital security and privacy tools."
  },
  {
    date: "September 2022 – August 2025",
    tag: "DIGITAL ACTIVISM & INSTITUTIONAL FRAMEWORKS",
    title: "Civil Society Innovation Fund",
    desc: "This flagship three-year program spans five major cities: Addis Ababa, Dire Dawa, Assosa, Hawassa, and Bahir Dar. We are pioneering the future of civic space by helping organizations transition from traditional methods to sophisticated digital activism while ensuring ethical standards are maintained.",
    impact: "Capacitated 80+ media outlets and CSOs through the installation of Digital Engagement Policy frameworks and the creation of a first-of-its-kind Guideline for Ethical Digital Activism. Key Achievement: Successfully built the Emerging CSO Online Network (DERSHA.net)."
  },
  {
    date: "October 2025 – December 2025",
    tag: "CYBERSECURITY & ADVOCACY",
    title: "Ethiopia Digital Safety Program",
    desc: "Focusing on Addis Ababa and Arba-Minch, this program equips journalists and civil society leaders with the technical skills needed to navigate a shifting digital landscape safely.",
    impact: "Graduated a cohort of 40 leaders specialized in safe communication, encryption, and digital rights advocacy, with a priority focus on female empowerment."
  }
];

const Programmes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end 80%"]
  });
  
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24 md:mb-40">
             <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-white">Our Programmes</h1>
             <p className="text-slate-400 max-w-2xl mx-auto">
                Executing impactful initiatives that bridge the gap between technology and civic responsibility.
             </p>
        </div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
            
            {/* The vertical line base (dim) */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-900/40 -translate-x-1/2 hidden md:block"></div>
            
            {/* The animated building line (bright) */}
            <motion.div 
              className="absolute left-4 md:left-1/2 top-0 w-0.5 bg-blue-500 -translate-x-1/2 hidden md:block origin-top z-0"
              style={{ height }}
            />

            <div className="w-full space-y-12 md:space-y-0">
                {programmesData.map((prog, i) => {
                    const isEven = i % 2 === 0;
                    return (
                        <div key={i} className="relative flex flex-col md:flex-row justify-between items-start w-full md:mb-16">
                            
                            {/* Marker dot on the line */}
                            <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                viewport={{ once: true, margin: "-10%" }}
                                className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] -translate-x-1/2 mt-7 z-10 hidden md:block" 
                            />

                            {/* Left Content */}
                            <div className="w-full md:w-[45%] flex md:justify-end">
                                {isEven ? (
                                    <ProgrammeCard prog={prog} />
                                ) : (
                                    <div className="hidden md:block w-full text-right pr-6 md:pr-12">
                                        <p className="text-blue-400 font-mono text-sm pt-5">{prog.date}</p>
                                    </div>
                                )}
                            </div>

                            {/* Right Content */}
                            <div className="w-full md:w-[45%] flex md:justify-start">
                                {!isEven ? (
                                    <ProgrammeCard prog={prog} />
                                ) : (
                                    <div className="hidden md:block w-full text-left pl-6 md:pl-12">
                                        <p className="text-blue-400 font-mono text-sm pt-5">{prog.date}</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>

        {/* Impact Data Chart */}
        <ImpactChart />

      </div>
    </motion.div>
  );
};

const impactData = [
  { label: 'Inclusion', value: 60, color: 'bg-blue-500' },
  { label: 'Capacity', value: 65, color: 'bg-indigo-500' },
  { label: 'Advocacy', value: 95, color: 'bg-blue-500' },
  { label: 'Rights', value: 60, color: 'bg-indigo-500' }
];

const ImpactChart = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-panel mt-20 md:mt-32 p-10 md:p-16 pb-12 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-16 w-full max-w-5xl mx-auto"
        >
            <div className="w-full md:w-1/3 text-left">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Impact Data</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Measuring our focus across key areas of civic engagement.
                </p>
            </div>
            
            <div className="w-full md:w-2/3 flex justify-between items-end h-48 md:h-64 gap-4 md:gap-8 px-2 md:px-4">
                {impactData.map((item, i) => (
                    <div key={i} className="flex flex-col items-center justify-end h-full w-full group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0f25] px-4 py-2 rounded-xl border border-white/10 pointer-events-none z-10 whitespace-nowrap shadow-2xl flex flex-col items-center">
                            <span className="font-bold text-white text-xs mb-1">{item.label}</span>
                            <span className="text-slate-500 text-[10px]">value : {item.value}</span>
                        </div>
                        
                        <motion.div 
                            initial={{ height: 0 }}
                            whileInView={{ height: `${item.value}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className={`w-full rounded-t-lg ${item.color} hover:brightness-110 transition-all shadow-lg cursor-pointer`}
                        />
                        <span className="text-[10px] md:text-xs text-slate-300 mt-4 font-medium">{item.label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const ProgrammeCard = ({ prog }: { prog: any }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-10%" }}
        className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-colors w-full relative z-20"
    >
        {/* Mobile date */}
        <p className="md:hidden text-blue-400 font-mono text-xs mb-4">{prog.date}</p>
        
        <div className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded mb-6">
            {prog.tag}
        </div>
        
        <h3 className="font-display text-2xl font-bold text-white mb-4">{prog.title}</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-8">{prog.desc}</p>
        
        <div className="pt-6 border-t border-white/5">
            <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Impact</h4>
            <p className="text-slate-200 text-sm">{prog.impact}</p>
        </div>
    </motion.div>
);

export default Programmes;
