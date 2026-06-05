"use client"

import { useTranslations } from 'next-intl';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Share2, Copy, MessageCircle, ChevronRight, MoreHorizontal, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

const AnimatedCheck = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-green-500"
    >
      <motion.path
        d="M20 6L9 17l-5-5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </motion.svg>
  );
};

function ShareButton() {
  const t = useTranslations('Share');
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      const baseUrl = 'https://mingchen.dev';
      await navigator.clipboard.writeText(baseUrl);
      setCopied(true);

      // Trigger confetti
      const rect = menuRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { x, y },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
          disableForReducedMotion: true,
          gravity: 5,
          ticks: 100,
          scalar: 0.8,
          startVelocity: 45
        });
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareUrl = 'https://mingchen.dev';

  const [isNativeShareSupported, setIsNativeShareSupported] = useState(false);

  useEffect(() => {
    setIsNativeShareSupported(!!navigator.share);
  }, []);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: shareUrl,
        });
        setIsOpen(false);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleShare = () => {
     setIsOpen(!isOpen);
  };


  const shareLinks = [
    {
      name: t('copyLink'),
      icon: Copy,
      activeIcon: AnimatedCheck,
      action: handleCopy,
      color: "text-gray-700 dark:text-gray-200",
      activeColor: "text-green-500"
    },
    {
      name: t('line'),
      icon: MessageCircle,
      action: () => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`, '_blank'),
      color: "text-[#00B900]"
    },
  ];


  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={handleShare}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={t('title')}
      >
        <Share2 className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, mass: 1.2 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
          >
            <div className="p-2 space-y-1">
              {shareLinks.map((link) => {
                const Icon = (link.activeIcon && copied) ? link.activeIcon : link.icon;
                const iconColor = (link.activeColor && copied && link.name === t('copyLink')) ? link.activeColor : link.color;

                return (
                  <button
                    key={link.name}
                    onClick={() => { link.action(); if(link.name !== t('copyLink')) setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                  >
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${iconColor}`} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200">{link.name}</span>
                  </button>
                );
              })}

              {isNativeShareSupported && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-t border-gray-100 dark:border-gray-700 mt-1 pt-2"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-200">{t('native')}</span>
                </button>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToolsDropdown() {
  const t = useTranslations('Nav');
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div 
      className="relative" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="relative text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group py-2 flex items-center gap-1"
      >
        {t('tools')}
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-0 w-48 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
          >
            <div className="p-2">
              <Link
                href="https://auth.mingchen.dev"
                target="_blank"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-gray-700 dark:text-gray-200"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                {t('authenticator')}
              </Link>
              <Link
                href="https://cloud.mingchen.dev"
                target="_blank"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-gray-700 dark:text-gray-200"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                {t('cloud')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const t = useTranslations('Nav');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 50);

      // Hide instantly when scrolling down, show instantly when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('about'), href: '#about' },
    { name: t('experience'), href: '#experience' },
    { name: t('projects'), href: '#projects' },
    { name: t('articles'), href: '#articles' },
    { name: t('contact'), href: '#contact' },
  ];

  return (
    <>
      <header className="fixed top-4 md:top-6 w-full z-[45] flex justify-center pointer-events-none px-4">
        <motion.nav
          className={`pointer-events-auto w-full max-w-5xl transition-colors duration-500 select-none rounded-full ${
            scrolled
                ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/50 dark:border-gray-700/50' 
                : 'bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-gray-800/30'
          }`}
          initial={{ y: -50, opacity: 0, scale: 0.8 }}
          animate={{ 
            y: hidden ? -50 : 0, 
            opacity: hidden ? 0 : 1,
            scale: hidden ? 0.8 : 1
          }}
          transition={{ 
            type: "spring", 
            stiffness: 350, 
            damping: 25,
            mass: 1.2
          }}
        >
        <div className="px-6 h-14 md:h-16 flex items-center justify-between">
          <Link href="#" className="text-xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 hover:opacity-80 transition-opacity">
            Ming Chen
          </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group py-2"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <ToolsDropdown />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <ShareButton />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
      </motion.nav>
      </header>

      {/* Mobile Navigation Menu Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[50] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-[100dvh] w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-l border-white/20 dark:border-white/10 z-[60] shadow-2xl flex flex-col md:hidden overflow-y-auto"
          >
            {/* Close button inside drawer */}
            <div className="flex justify-end p-6">
              <button
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors bg-white/50 dark:bg-black/50"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 pb-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-4 text-base font-bold text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all flex items-center justify-between group"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                </Link>
              ))}

              {/* Mobile Tools Menu */}
              <div className="flex flex-col mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-800/50">
                <button
                  onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                  className="px-4 py-4 text-base font-bold text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all flex items-center justify-between group"
                >
                  {t('tools')}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isMobileToolsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isMobileToolsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 flex flex-col gap-1 overflow-hidden"
                    >
                      <Link
                        href="https://auth.mingchen.dev"
                        target="_blank"
                        className="px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {t('authenticator')}
                      </Link>
                      <Link
                        href="https://cloud.mingchen.dev"
                        target="_blank"
                        className="px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {t('cloud')}
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}