"use client"

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HeroParticles } from './ui/hero-particles';
import { useState, useEffect } from 'react';

export function Hero() {
  const t = useTranslations('Hero');
  const roleText = t('role');
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText(''); // Reset on lang change
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => roleText.slice(0, index + 1));
      index++;
      if (index > roleText.length) {
        clearInterval(intervalId);
      }
    }, 50); // Typing speed
    return () => clearInterval(intervalId);
  }, [roleText]);

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden bg-slate-50 dark:bg-black transition-colors duration-300">
        {/* Interactive Background */}
        <HeroParticles />
        
        {/* Gradient Orbs (Subtle) */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

      <div className="container mx-auto px-4 text-center z-10 select-none">
        <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white drop-shadow-sm"
        >
          {t('greeting')}
        </motion.h1>

        <motion.h2 
            className="text-2xl md:text-4xl font-bold mb-8 text-blue-600 dark:text-blue-400 tracking-tight min-h-[1.5em]"
        >
          {displayedText}
          <span className="animate-pulse">|</span>
        </motion.h2>

        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          {t('description')}
        </motion.p>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
        >
            <a 
                href="#contact" 
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(66,153,225,0.6)]"
            >
                <span className="relative z-10 flex items-center gap-2">
                    {t('cta')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity" />
            </a>
        </motion.div>
      </div>
    </section>
  );
}