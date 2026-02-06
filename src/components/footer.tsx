"use client";

import { useTranslations } from "next-intl";
import { Github, Mail, MessageCircle, ArrowUpRight, Heart, Code, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const t = useTranslations("Contact");
  const tNav = useTranslations("Nav");

  const contacts = [
    {
      name: "GitHub",
      value: "@Ming874",
      icon: Github,
      url: "https://github.com/Ming874",
      color: "hover:text-white hover:bg-gray-800 hover:border-gray-700",
    },
    {
      name: "Email",
      value: "3526ming@gmail.com",
      icon: Mail,
      url: "mailto:3526ming@gmail.com",
      color: "hover:text-red-400 hover:bg-red-900/20 hover:border-red-800",
    },
    {
      name: "LINE",
      value: "Tai Ming Chen",
      icon: MessageCircle,
      url: "https://line.me/ti/p/aM_h9C0qjG",
      color: "hover:text-green-400 hover:bg-green-900/20 hover:border-green-800",
    },
  ];

  const currentYear = new Date().getFullYear();

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
            {contacts.map((contact, index) => (
              <motion.a
                key={contact.name}
                href={contact.url}
                target="_blank"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative flex items-center justify-between p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden ${contact.color}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="flex items-center gap-6 relative z-10">
                  <div className="p-4 bg-white/5 rounded-2xl text-gray-300 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                    <contact.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-1 uppercase tracking-widest group-hover:text-gray-400 transition-colors">
                      {contact.name}
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-gray-200 group-hover:text-white transition-colors">
                      {contact.value}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-6 h-6 text-gray-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Info */}
        <div className="pt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-4 text-center md:text-left">
              <div className="text-sm font-bold tracking-wide text-white">
                 © {currentYear} Tai Ming Chen. All rights reserved.
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-gray-500 font-mono">
                 <Code className="w-3 h-3" />
                 <span>Made with Next.js, Tailwind CSS, TypeScript &</span>
                 <Heart className="w-3 h-3 text-red-500 animate-pulse" />
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