"use client";

import { useTranslations } from "next-intl";
import { Github, Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
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
      value: "Ming",
      icon: MessageCircle,
      url: "https://line.me/ti/p/aM_h9C0qjG",
      color: "hover:text-green-400 hover:bg-green-900/20 hover:border-green-800",
    },
  ];

  return (
    <footer id="contact" className="relative bg-black text-white pt-24 pb-12 overflow-hidden">
      {/* Subtle Background Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* CTA Section */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            >
              Let's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Connect.
              </span>
            </motion.h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              {t("desc")}
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col justify-center gap-6">
            {contacts.map((contact, index) => (
              <motion.a
                key={contact.name}
                href={contact.url}
                target="_blank"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className={`group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 shadow-lg hover:shadow-2xl ${contact.color}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-gray-300 group-hover:scale-110 transition-transform">
                    <contact.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-mono mb-1 group-hover:text-gray-400 transition-colors">
                      {contact.name}
                    </div>
                    <div className="text-xl font-bold text-gray-200 group-hover:text-current transition-colors">
                      {contact.value}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-6 h-6 text-gray-500 group-hover:text-current group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-mono">
          <div>© {new Date().getFullYear()} Tai Ming Chen. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#about" className="hover:text-white transition-colors">
              {tNav("about")}
            </a>
            <a
              href="#experience"
              className="hover:text-white transition-colors"
            >
              {tNav("experience")}
            </a>
            <a href="#projects" className="hover:text-white transition-colors">
              {tNav("projects")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}