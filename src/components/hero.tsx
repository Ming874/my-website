"use client"

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HeroParticles } from './ui/hero-particles';
import { useState, useEffect } from 'react';

export function Hero() {
  const t = useTranslations('Hero');
  // Use t.raw to get the array of roles. Type assertion might be needed depending on setup, 
  // but usually t.raw returns `any`.
  const roles = t.raw('roles') as string[]; 
  
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    // Handle the typing animation
    const handleTyping = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        // Deleting text
        setDisplayedText(prev => prev.substring(0, prev.length - 1));
        setTypingSpeed(50); // Faster when deleting
      } else {
        // Typing text
        setDisplayedText(currentRole.substring(0, displayedText.length + 1));
        setTypingSpeed(100); // Normal typing speed
      }

      // Check if finished typing current role
      if (!isDeleting && displayedText === currentRole) {
        // Pause before deleting
        setTimeout(() => setIsDeleting(true), 2000);
      } 
      // Check if finished deleting
      else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex, roles, typingSpeed]);

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden bg-slate-50 dark:bg-black transition-colors duration-300 select-none">
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
            className="text-[clamp(2rem,5vw,6rem)] sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white drop-shadow-sm whitespace-nowrap"
        >
          {t('greeting')}
        </motion.h1>

        <motion.h2 
            className="text-xl md:text-3xl lg:text-4xl font-bold mb-8 text-blue-600 dark:text-blue-400 tracking-tight min-h-[1.5em]"
        >
          {displayedText.split('').map((char, index) => {
            // Find the full word this character belongs to
            const currentRole = roles[roleIndex];
            const googleMatch = currentRole.match(/Google/);
            
            if (googleMatch) {
              const start = googleMatch.index!;
              const end = start + 6;
              if (index >= start && index < end) {
                const googleColors = ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335'];
                return (
                  <span key={index} style={{ color: googleColors[index - start] }}>
                    {char}
                  </span>
                );
              }
            }
            return <span key={index}>{char}</span>;
          })}
          <span className="animate-pulse ml-1 text-blue-600 dark:text-blue-400">|</span>
        </motion.h2>

        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          {t.rich('description', {
            b: (chunks) => <span className="font-bold">{chunks}</span>
          })}
        </motion.p>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
        >
            <motion.a 
                href="#contact" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-lg overflow-hidden shadow-lg hover:shadow-[0_0_40px_-10px_rgba(66,153,225,0.6)]"
            >
                <span className="relative z-10 flex items-center gap-2">
                    {t('cta')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity" />
            </motion.a>
        </motion.div>
      </div>
    </section>
  );
}