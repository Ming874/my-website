"use client"

import { useTranslations } from 'next-intl';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Share2, Copy, Check, Instagram, MessageCircle, MoreHorizontal, ChevronRight } from 'lucide-react';

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
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

  const shareLinks = [
    {
      name: t('copyLink'),
      icon: copied ? Check : Copy,
      action: handleCopy,
      color: copied ? "text-green-500" : "text-gray-700 dark:text-gray-200"
    },
    {
      name: t('line'),
      icon: MessageCircle, // Placeholder for LINE
      action: () => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`, '_blank'),
      color: "text-[#00B900]"
    },
    {
      name: t('instagram'),
      icon: Instagram,
      action: () => {
         // Instagram does not have a direct web share URL for links like FB/Twitter.
         // Common practice is to just copy link or open app. 
         // Since 'native share' covers app opening, and 'copy link' covers manual sharing,
         // We can redirect to Instagram profile or just trigger native share if available, fallback to copy.
         // However, user specifically asked for "Share on IG". 
         // Given web limitations, the best specific action is often copying the link 
         // and telling the user, OR using native share.
         // For now, I will use a simple workaround: Open Instagram. 
         // Or better, since this is a "Share" button, maybe just trigger copy and toast "Link copied! Open Instagram to paste."
         // But to keep it simple and consistent with "buttons": 
         // I'll leave it as opening instagram website for now, or just use native share wrapper.
         // Actually, most "Share to IG" buttons on web just don't exist because of this API limitation.
         // But since I MUST implement it:
         if (navigator.share) {
            navigator.share({ title: document.title, url: shareUrl }).catch(console.error);
         } else {
             handleCopy();
             window.open('https://instagram.com', '_blank');
         }
      },
      color: "text-[#E1306C]"
    },
  ];

  // Only show Native Share option if supported (mostly mobile)
  const isNativeShareSupported = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={t('title')}
      >
        <Share2 className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
          >
            <div className="p-2 space-y-1">
              {shareLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => { link.action(); if(link.name !== t('copyLink')) setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <link.icon className={`w-4 h-4 ${link.color}`} />
                  <span className="text-gray-700 dark:text-gray-200">{link.name}</span>
                </button>
              ))}
              
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

export function Navbar() {
  const t = useTranslations('Nav');
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
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
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || isOpen
            ? 'bg-white/50 dark:bg-black/50 backdrop-blur-2xl shadow-sm border-b border-white/20 dark:border-white/10' 
            : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="#" className="text-xl font-bold tracking-tighter text-gray-900 dark:text-white">
          Tai Ming Chen
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
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <ShareButton />
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 dark:border-white/5 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-1">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}