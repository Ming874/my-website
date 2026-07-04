"use client";

import { useTranslations } from "next-intl";
import { Github, Mail, MessageCircle, Code } from "lucide-react";
import { useState, useEffect } from "react";

export function Footer() {
  const t = useTranslations("Contact");
  const tNav = useTranslations("Nav");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const contacts = [
    {
      name: "GitHub",
      value: "@Ming874",
      icon: Github,
      url: "https://github.com/Ming874",
      hoverClass: "hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10",
    },
    {
      name: "Email",
      value: "contact@mingchen.dev",
      icon: Mail,
      url: "mailto:contact@mingchen.dev",
      hoverClass: "hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10",
    },
    {
      name: "LINE",
      value: "Ming Chen",
      icon: MessageCircle,
      url: "https://line.me/ti/p/aM_h9C0qjG",
      hoverClass: "hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative bg-white dark:bg-[#050505] text-gray-900 dark:text-gray-300 pt-16 pb-8 overflow-hidden border-t border-gray-100 dark:border-white/5 transition-colors duration-300 select-none">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl relative z-10">
        
        {/* Compact Professional Layout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 relative z-20">
          
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              Let's Connect
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("desc")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {contacts.map((contact) => (
              <a
                key={contact.name}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 transition-all duration-300 ${contact.hoverClass}`}
              >
                <contact.icon className="w-4 h-4" />
                <span>{contact.value}</span>
              </a>
            ))}
          </div>

        </div>

        <div className="relative mt-12">
          <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md px-2">
            
            <div className="flex flex-col gap-1.5 text-center md:text-left">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                 © {currentYear} Ming Chen. All rights reserved.
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono">
                 <Code className="w-3.5 h-3.5" />
                 <span>Built with Next.js & Tailwind</span>
              </div>
            </div>

            <nav className="flex items-center gap-6">
              {["about", "experience", "projects"].map((item) => (
                <a 
                  key={item}
                  href={`#${item}`} 
                  className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {tNav(item)}
                </a>
              ))}
            </nav>
            
          </div>
        </div>
      </div>
    </footer>
  );
}