"use client";

import { useTranslations } from "next-intl";
import { Github, Mail, MessageCircle, ArrowUpRight, Code, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export function Footer() {
  const t = useTranslations("Contact");
  const tNav = useTranslations("Nav");
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const isManuallyActive = useRef<boolean>(false);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const contacts = [
    {
      name: "GitHub",
      value: "@Ming874",
      icon: Github,
      url: "https://github.com/Ming874",
      className: "hover:text-white hover:bg-gray-700 hover:border-gray-600",
      activeClassName: "text-white bg-gray-700 border-gray-600",
      activeTextColor: "text-white",
      hoverTextColor: "group-hover:text-white",
    },
    {
      name: "Email",
      value: "contact@mingchen.dev",
      icon: Mail,
      url: "mailto:contact@mingchen.dev",
      className: "hover:text-red-500 hover:bg-red-600/20 hover:border-red-600",
      activeClassName: "text-red-500 bg-red-600/20 border-red-600",
      activeTextColor: "text-red-500",
      hoverTextColor: "group-hover:text-red-500",
    },
    {
      name: "LINE",
      value: "Tai Ming Chen",
      icon: MessageCircle,
      url: "https://line.me/ti/p/aM_h9C0qjG",
      className: "hover:text-green-500 hover:bg-green-600/20 hover:border-green-600",
      activeClassName: "text-green-500 bg-green-600/20 border-green-600",
      activeTextColor: "text-green-500",
      hoverTextColor: "group-hover:text-green-500",
    },
  ];

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      // If user recently clicked, don't let scroll override for 1 second
      if (isManuallyActive.current) return;

      // Only run on mobile/tablet (simplistic check, can be refined)
      if (window.innerWidth >= 1024) {
        setActiveLink(null);
        return;
      }

      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 1;
      
      // Dynamic focus point: moves from center towards bottom as we reach the end of the page
      // This ensures the last item gets highlighted even if it can't reach the exact center.
      const focusPointY = (window.innerHeight / 2) + (scrollProgress > 0.8 ? (scrollProgress - 0.8) * 5 * (window.innerHeight / 4) : 0);

      let closestLink = null;
      let minDistance = Infinity;

      contacts.forEach((contact) => {
        const el = linkRefs.current.get(contact.name);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elCenterY = rect.top + rect.height / 2;
          const distance = Math.abs(elCenterY - focusPointY);

          // Activation threshold: only highlight if reasonably close to the focus point
          if (distance < 200 && distance < minDistance) {
            minDistance = distance;
            closestLink = contact.name;
          }
        }
      });

      setActiveLink(closestLink);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <footer id="contact" className="relative bg-gray-100 dark:bg-black text-gray-900 dark:text-white pt-16 pb-8 overflow-hidden transition-colors duration-300 select-none">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,50,0.2),transparent_70%)]" />
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent opacity-50" />
      </div>
      
      {/* Animated Glow Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" 
      />
       <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" 
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Left Section: CTA */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Terminal className="w-10 h-10 text-blue-600 dark:text-blue-500 mb-4 opacity-80" />
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none">
                Let&apos;s <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-[length:200%_auto] animate-gradient">
                  Connect.
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                {t("desc")}
              </p>
            </motion.div>
          </div>

          {/* Right Section: Contact Cards */}
          <div className="lg:w-1/2 flex flex-col justify-center gap-3">
            {contacts.map((contact, index) => {
              const isActive = activeLink === 'ALL' || activeLink === contact.name;
              return (
                <motion.a
                  key={contact.name}
                  ref={(el) => { if (el) linkRefs.current.set(contact.name, el); }}
                  href={contact.url}
                  target="_blank"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setActiveLink(contact.name);
                    isManuallyActive.current = true;
                    // Release the manual lock after a delay
                    setTimeout(() => {
                      isManuallyActive.current = false;
                    }, 1500);
                  }}
                  className={`group relative flex items-center justify-between p-4 md:p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isActive ? contact.activeClassName : "bg-white border-gray-200 dark:bg-white/[0.03] dark:border-white/10 " + contact.className
                  } ${!isActive && "hover:border-gray-300 dark:hover:border-white/20"}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-gray-100/50 to-transparent dark:from-white/[0.05] dark:to-transparent transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                  
                  <div className="flex items-center gap-4 relative z-10 w-full overflow-hidden">
                    <div className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0 ${isActive ? "scale-110 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-300" : "bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-300 group-hover:scale-110 group-hover:bg-gray-100 dark:group-hover:bg-white/10"}`}>
                      <contact.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-mono mb-0.5 uppercase tracking-widest transition-colors truncate ${isActive ? contact.activeTextColor + " opacity-80" : `text-gray-500 dark:text-gray-400 ${contact.hoverTextColor} group-hover:opacity-80`}`}>
                        {contact.name}
                      </div>
                      <div className={`text-lg sm:text-xl md:text-2xl font-bold transition-colors truncate ${isActive ? contact.activeTextColor : `text-gray-900 dark:text-gray-200 ${contact.hoverTextColor}`}`}>
                        {contact.value}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${isActive ? contact.activeTextColor + " translate-x-1 -translate-y-1" : `text-gray-400 dark:text-gray-600 ${contact.hoverTextColor} group-hover:translate-x-1 group-hover:-translate-y-1`}`} />
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Info */}
        <div className="pt-8 border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden">
            <div className="flex flex-col gap-2 text-center md:text-left w-full md:w-auto overflow-hidden">
              <div className="text-[clamp(0.7rem,3.8vw,1rem)] sm:text-base font-bold tracking-wide text-gray-900 dark:text-white px-2 whitespace-nowrap">
                 © {currentYear} Tai Ming Chen. All rights reserved.
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-[clamp(0.65rem,3.5vw,0.875rem)] sm:text-sm text-gray-500 font-mono px-2 whitespace-nowrap">
                 <Code className="w-3 h-3 flex-shrink-0" />
                 <span>Made with Next.js, Tailwind CSS, TypeScript</span>
              </div>
            </div>

            <nav className="flex items-center gap-6">
              {["about", "experience", "projects"].map((item) => (
                <a 
                  key={item}
                  href={`#${item}`} 
                  className="text-base font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors relative group"
                >
                  {tNav(item)}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-600 dark:bg-blue-500 transition-all group-hover:w-full" />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
