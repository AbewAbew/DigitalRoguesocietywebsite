import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Partners from './pages/Partners';
import Solutions from './pages/Solutions';
import Programmes from './pages/Programmes';
import Insights from './pages/Insights';
import InsightArticle from './pages/InsightArticle';
import Contribute from './pages/Contribute';
import Contact from './pages/Contact';
import AdminBlog from './pages/AdminBlog';
import CanvasBackground from './components/CanvasBackground';
import LoadingScreen from './components/LoadingScreen';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/programmes" element={<Programmes />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/insights/:slug" element={<InsightArticle />} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppShell: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isLoading, setIsLoading] = useState(() => !isAdminRoute);

  useEffect(() => {
    if (isAdminRoute) {
      setIsLoading(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 2400);

    return () => window.clearTimeout(timer);
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <AnimatedRoutes />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#020617] font-sans text-white selection:bg-blue-500 selection:text-white">
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        <CanvasBackground />
      </div>

      {!isLoading && (
        <div className="relative z-10 flex min-h-screen flex-col animate-fadeIn">
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppShell />
  </HashRouter>
);

export default App;
