
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Fingerprint, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Home: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Text Reveal Animation
    if (titleRef.current) {
        const words = titleRef.current.innerText.split(' ');
        // Wrap words in spans for animation
        titleRef.current.innerHTML = words.map(word => `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full reveal-text">${word}</span></span>`).join(' ');
        
        gsap.to(".reveal-text", {
            y: 0,
            stagger: 0.1,
            duration: 1.2,
            ease: "power4.out",
            delay: 0.5,
            onComplete: () => {
               // Ensure opacity is fully set after animation
               if (titleRef.current) titleRef.current.style.opacity = '1';
            }
        });
    }
    
    gsap.fromTo(subRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 1.5 }
    );
  }, []);

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-32 pb-20 min-h-screen flex flex-col justify-center relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-10">
        <div className="mb-12">
            {/* Replaced CSS animation with Framer Motion for reliability */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center gap-4 mb-6"
            >
                <div className="h-[1px] w-12 bg-blue-500"></div>
                <span className="text-blue-400 font-display tracking-[0.3em] text-xs font-bold">EST. 2019 // ETHIOPIA</span>
            </motion.div>

            {/* Changed to solid text-white for maximum visibility */}
            <h1 ref={titleRef} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] uppercase text-white mb-8">
              Pioneering Digital Civic Solutions
            </h1>

            <p ref={subRef} className="max-w-2xl text-lg md:text-xl text-slate-200 font-light leading-relaxed border-l-2 border-blue-600 pl-6 opacity-0">
              Digital Rogue Society Experiment Group (DRSE.G) stands at the forefront of digital rights, civic engagement, and well-being in Ethiopia. We address the challenges of the digital age through evidence-based advocacy and cutting-edge tools.
            </p>
        </div>

        {/* Focus Area Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
            {[
                { 
                  title: "Privacy & Protection", 
                  icon: <Fingerprint />, 
                  desc: "Safeguarding consumer protection and digital rights.",
                  link: "/solutions"
                },
                { 
                  title: "Civic Engagement & Media", 
                  icon: <Globe />, 
                  desc: "Democratizing access to information & responsible media usage.",
                  link: "/programmes"
                },
                { 
                  title: "AI & Civic Tech", 
                  icon: <Cpu />, 
                  desc: "Responsible utilization of AI and advancing civic technology.",
                  link: "/solutions"
                }
            ].map((item, i) => (
                <Link to={item.link} key={i} className="glass-panel p-8 rounded-2xl group hover:bg-white/10 transition-all duration-500 cursor-pointer hover:-translate-y-2 border border-white/10">
                    <div className="mb-4 text-blue-400 group-hover:text-white transition-colors">{item.icon}</div>
                    <h3 className="font-display text-xl font-bold mb-2 text-white">{item.title}</h3>
                    <p className="text-sm text-slate-300 font-light leading-relaxed">{item.desc}</p>
                    <div className="mt-4 flex justify-end">
                        <ArrowRight className="w-5 h-5 text-blue-400 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                    </div>
                </Link>
            ))}
        </motion.div>
      </div>

      {/* Decorative Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-display tracking-widest uppercase text-white">Scroll to Explore</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-blue-500 to-transparent"></div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
