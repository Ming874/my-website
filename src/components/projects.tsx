"use client"

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Sparkles, Bot, Globe, ArrowUpRight, Monitor, Cpu, ShieldCheck, Database, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const ProjectRow = ({ project, index, t }: { project: any, index: number, t: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isScholarship = project.key === 'scholarship';
  const isEven = index % 2 === 0;

  const showcaseImages = [
    '/idx.png',
    '/display.png',
    '/bot.png',
    '/backend.png'
  ];
  
  const [activeImg, setActiveImg] = useState(0);
  
  useEffect(() => {
    if (isScholarship && isHovered) {
      const interval = setInterval(() => {
        setActiveImg((prev) => (prev + 1) % showcaseImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isScholarship, isHovered]);

  // Featured Project with Image
  if (isScholarship) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-full border-b border-gray-200 dark:border-gray-800 py-12 lg:py-20 transition-all duration-500 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className={`lg:col-span-7 space-y-6 ${!isEven ? 'lg:order-2 lg:text-right' : ''}`}>
              <div className={`flex items-center gap-4 ${!isEven ? 'lg:justify-end' : ''}`}>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-500 font-bold tracking-widest">0{index + 1}</span>
                <div className="h-px w-8 bg-blue-600/30 dark:bg-blue-500/30" />
                <div className="flex gap-2">
                  {project.tags.map((tag: string) => (
                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                {t(`items.${project.key}.title`)}
              </h3>
              <p className={`text-base text-gray-600 dark:text-gray-400 max-w-2xl font-light leading-relaxed ${!isEven ? 'lg:ml-auto' : ''}`}>
                {t(`items.${project.key}.desc`)}
              </p>
              <div className={`flex gap-6 pt-4 ${!isEven ? 'lg:justify-end' : ''}`}>
                {project.link && (
                  <Link href={project.link} target="_blank" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter group/link">
                    <Globe className="w-4 h-4 transition-transform group-hover/link:rotate-12" />
                    <span>Live Demo</span>
                  </Link>
                )}
                {project.github && (
                  <Link href={project.github} target="_blank" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter group/link">
                    <Github className="w-4 h-4 transition-transform group-hover/link:rotate-12" />
                    <span>Source</span>
                  </Link>
                )}
              </div>
            </div>
            <div className={`lg:col-span-5 relative h-[300px] lg:h-[350px] rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 ${!isEven ? 'lg:order-1' : ''}`}>
              <AnimatePresence mode="wait">
                <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 p-4">
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
                    <Image src={showcaseImages[activeImg]} alt="Showcase" fill className="object-contain bg-white dark:bg-gray-800" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Regular Projects without Image (Alternating alignment)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative w-full border-b border-gray-100 dark:border-gray-900/50 py-10 lg:py-14 hover:bg-gray-50/30 dark:hover:bg-white/[0.01] transition-all duration-500`}
    >
      <div className="container mx-auto px-6">
        <div className={`flex flex-col ${!isEven ? 'lg:items-end lg:text-right' : 'lg:items-start'}`}>
          <div className="flex items-center gap-4 mb-4">
            {isEven && <span className="text-xs font-mono text-gray-400 font-bold">0{index + 1}</span>}
            <div className="flex gap-2">
              {project.tags.map((tag: string) => (
                <span key={tag} className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600/60 dark:text-blue-500/50">
                  {tag}
                </span>
              ))}
            </div>
            {!isEven && <span className="text-xs font-mono text-gray-400 font-bold">0{index + 1}</span>}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t(`items.${project.key}.title`)}
          </h3>
          <p className={`text-base text-gray-500 dark:text-gray-400 max-w-3xl font-light leading-relaxed mb-6`}>
            {t(`items.${project.key}.desc`)}
          </p>
          <div className="flex gap-6">
            {project.link && (
              <Link href={project.link} target="_blank" className="p-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-blue-600 transition-all">
                <Globe className="w-4 h-4" />
              </Link>
            )}
            {project.github && (
              <Link href={project.github} target="_blank" className="p-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-blue-600 transition-all">
                <Github className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function Projects() {
  const t = useTranslations('Projects'); 
  const projects = [
    { key: "scholarship", link: "https://scholarship.ncuesa.org.tw", github: "https://github.com/GDG-on-campus-NCUE/NCUE-Scholarship", tags: ["Next.js", "Supabase", "Gemini AI"] },
    { key: "vote", link: "https://election.ncuesa.org.tw", tags: ["Blockchain", "Web3", "Solidity"] },
    { key: "fin_agent", github: "https://github.com/Ming874/FinAgent", tags: ["Python", "Streamlit", "Gemini AI"] },
    { key: "meal_voucher", tags: ["React", "System Design"] }
  ];

  return (
    <section id="projects" className="bg-white dark:bg-[#050505] transition-colors duration-300 select-none overflow-hidden">
      <div className="container mx-auto px-6 pt-20 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-200 dark:border-gray-800 pb-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full">
              <Zap className="w-3 h-3 fill-white" /> Selected Works
            </div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              {t('title')}<span className="text-blue-600">.</span>
            </motion.h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-mono text-[10px] max-w-xs text-right leading-relaxed">
            Crafting digital experiences with purpose, precision, and passion.
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        {projects.map((project, index) => (
          <ProjectRow key={project.key} project={project} index={index} t={t} />
        ))}
      </div>
    </section>
  );
}
