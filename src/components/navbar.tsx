"use client"

import { useTranslations } from 'next-intl';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Navbar() {
  const t = useTranslations('Nav');
  const [scrolled, setScrolled] = useState(false);

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
        scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="#" className="text-xl font-bold tracking-tighter">
          Ming
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-blue-500 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </motion.nav>
  );
}
