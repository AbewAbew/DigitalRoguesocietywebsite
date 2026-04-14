
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NavLink } from '../types';
import { motion } from 'framer-motion';

const navLinks: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Programmes', path: '/programmes' },
  { label: 'Solutions', path: '/solutions' },
  { label: 'Partners', path: '/partners' },
  { label: 'Insights', path: '/insights' },
  { label: 'Contribute', path: '/contribute' },
  { label: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed w-full z-50 top-0 py-6 px-6 md:px-12"
    >
      <div className="glass-panel rounded-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="DRSE.G Logo" className="h-12 w-auto object-contain shrink-0" />
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-none tracking-widest text-white group-hover:text-blue-400 transition-colors">
              DRSE.G
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex space-x-1">
          {navLinks.map((link) => {
            const isActive =
              link.path === '/'
                ? location.pathname === '/'
                : location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
            const isContribute = link.label === 'Contribute';
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 group overflow-hidden rounded-full ${isContribute ? 'border border-blue-500/50 ml-2' : ''}`}
              >
                <span className={`relative z-10 text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 ${isActive || isContribute ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                  {link.label}
                </span>
                {isActive && !isContribute && (
                  <motion.div
                    layoutId="navHighlight"
                    className="absolute inset-0 bg-blue-600/80"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {isContribute && (
                   <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600 transition-colors duration-300" />
                )}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white hover:text-blue-400 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-24 left-4 right-4 glass-panel rounded-3xl overflow-hidden"
        >
          <div className="p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-center py-3 rounded-xl text-sm font-display uppercase tracking-widest ${
                  (link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname === link.path || location.pathname.startsWith(`${link.path}/`))
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
