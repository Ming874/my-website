"use client";

import { useTranslations } from "next-intl";
import { Github, Mail, MessageCircle, ArrowUpRight, Heart, Code, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export function Footer() {
  const t = useTranslations("Contact");
  const tNav = useTranslations("Nav");
  const [activeLink, setActiveLink] = useState<string | null>(null);
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
    },
    {
      name: "Email",
      value: "contact@mingchen.dev",
      icon: Mail,
      url: "mailto:contact@mingchen.dev",
      className: "hover:text-red-500 hover:bg-red-600/20 hover:border-red-600",
      activeClassName: "text-red-500 bg-red-600/20 border-red-600",
      activeTextColor: "text-red-500",
    },
    {
      name: "LINE",
      value: "Tai Ming Chen",
      icon: MessageCircle,
      url: "https://line.me/ti/p/aM_h9C0qjG",
      className: "hover:text-green-500 hover:bg-green-600/20 hover:border-green-600",
      activeClassName: "text-green-500 bg-green-600/20 border-green-600",
      activeTextColor: "text-green-500",
    },
  ];

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      // Only run on mobile/tablet (simplistic check, can be refined)
      if (window.innerWidth >= 1024) {
        setActiveLink(null);
        return;
      }

      const viewportCenterY = window.innerHeight / 2;
      let closestLink = null;
      let minDistance = Infinity;

      contacts.forEach((contact) => {
        const el = linkRefs.current.get(contact.name);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elCenterY = rect.top + rect.height / 2;
          const distance = Math.abs(elCenterY - viewportCenterY);

          // Activation threshold (e.g., within 150px of center)
          if (distance < 150 && distance < minDistance) {
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
    <footer id="contact" className="relative bg-black text-white pt-32 pb-16 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,50,0.2),transparent_70%)]" />
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent opacity-50" />
      </div>
      
      {/* Animated Glow Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" 
      />
       <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" 
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 mb-24">
          {/* Left Section: CTA */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Terminal className="w-12 h-12 text-blue-500 mb-6 opacity-80" />
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
                Let&apos;s <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-[length:200%_auto] animate-gradient">
                  Connect.
                </span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed border-l-2 border-gray-800 pl-6">
                {t("desc")}
              </p>
            </motion.div>
          </div>

          {/* Right Section: Contact Cards */}
          <div className="lg:w-1/2 flex flex-col justify-center gap-4">
            {contacts.map((contact, index) => {
              const isActive = activeLink === contact.name;
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
                  className={`group relative flex items-center justify-between p-6 md:p-8 rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isActive ? contact.activeClassName : "bg-white/[0.03] border-white/10 " + contact.className
                  } ${!isActive && "hover:border-white/20"}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                  
                  <div className="flex items-center gap-6 relative z-10 w-full overflow-hidden">
                    <div className={`p-4 rounded-2xl text-gray-300 transition-all duration-300 flex-shrink-0 ${isActive ? "scale-110 bg-white/10" : "bg-white/5 group-hover:scale-110 group-hover:bg-white/10"}`}>
                      <contact.icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-xs max-[360px]:text-[10px] font-mono mb-1 uppercase tracking-widest transition-colors truncate ${isActive ? contact.activeTextColor + " opacity-80" : "text-gray-500 group-hover:text-gray-400"}`}>
                        {contact.name}
                      </div>
                      <div className={`text-base sm:text-xl md:text-2xl max-[360px]:text-sm font-bold transition-colors truncate ${isActive ? contact.activeTextColor : "text-gray-200 group-hover:text-white"}`}>
                        {contact.value}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className={`w-6 h-6 flex-shrink-0 transition-all duration-300 ${isActive ? contact.activeTextColor + " translate-x-1 -translate-y-1" : "text-gray-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1"}`} />
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Info */}
        <div className="pt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-4 text-center md:text-left w-full md:w-auto">
              <div className="text-sm max-[360px]:text-xs font-bold tracking-wide text-white px-2">
                 © {currentYear} Tai Ming Chen. All rights reserved.
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs max-[360px]:text-[10px] text-gray-500 font-mono px-2">
                 <Code className="w-3 h-3 flex-shrink-0" />
                 <span>Made with Next.js, Tailwind CSS, TypeScript &</span>
                 <Heart className="w-3 h-3 text-red-500 animate-pulse flex-shrink-0" />
              </div>
            </div>

            <nav className="flex items-center gap-8">
              {["about", "experience", "projects"].map((item) => (
                <a 
                  key={item}
                  href={`#${item}`} 
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
                >
                  {tNav(item)}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all group-hover:w-full" />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}