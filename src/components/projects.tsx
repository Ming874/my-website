"use client"

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Sparkles, Bot, Globe, ArrowUpRight, Monitor, Cpu, ShieldCheck, Database, Zap, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useModalStore } from '@/store/modal-store';

const ProjectRow = ({ project, index, t }: { project: any, index: number, t: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { openModal } = useModalStore();
  const isScholarship = project.key === 'scholarship';
  const isEven = index % 2 === 0;

  const showcaseImages = [
    '/p01.webp',
    '/p02.webp',
    '/p03.webp',
    '/p04.webp',
    '/p05.webp',
    '/p06.webp',
    '/p07.webp'
  ];
  
  const [activeImg, setActiveImg] = useState(0);
  
  useEffect(() => {
    if (isScholarship) {
      const interval = setInterval(() => {
        setActiveImg((prev) => (prev + 1) % showcaseImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isScholarship]);

  const handleZoomImage = (src: string, alt: string) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        window.open(src, "_blank");
        return;
    }
    openModal(
        <div className="relative w-[90vw] h-[90vh] pointer-events-auto">
            <Image 
                src={src} 
                alt={alt} 
                fill
                className="object-contain"
                quality={100}
                priority
                unoptimized
            />
        </div>,
        { 
            variant: 'clean',
            className: "p-0",
            hideCloseButton: false 
        }
    );
  }

  const backgroundNumber = (
    <div className={`absolute inset-0 flex items-center pointer-events-none z-0 select-none ${
      !isEven ? 'justify-start lg:pl-20' : 'justify-end lg:pr-20'
    } ${index === 0 ? 'lg:hidden' : ''}`}>
      <motion.span 
        initial={{ opacity: 0, x: !isEven ? -100 : 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`text-[12rem] md:text-[20rem] lg:text-[28rem] font-black leading-none ${
          isEven 
            ? 'text-gray-200/60 dark:text-blue-500/[0.12]' 
            : 'text-gray-300/50 dark:text-white/[0.12]'
        }`}
      >
        0{index + 1}
      </motion.span>
    </div>
  );

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
        className={`relative w-full py-12 lg:py-24 transition-all duration-500 ${
          isEven ? 'bg-white dark:bg-[#050505]' : 'bg-gray-50/60 dark:bg-[#0a0a0a]'
        }`}
      >
        {backgroundNumber}
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className={`lg:col-span-7 space-y-8 ${!isEven ? 'lg:order-2 lg:text-right' : ''}`}>
              <div className={`flex items-center gap-6 ${!isEven ? 'lg:justify-end' : ''}`}>
                <span className="text-sm font-mono text-blue-600 dark:text-blue-500 font-bold tracking-widest">PROJECT 0{index + 1}</span>
                <div className="h-px w-12 bg-blue-600/30 dark:bg-blue-500/30" />
                <div className="flex gap-3">
                  {project.tags.map((tag: string) => (
                    <span key={tag} className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.1]">
                {t(`items.${project.key}.title`)}
              </h3>

              {/* Mobile Image Carousel - Shown only on small screens */}
              <div className="lg:hidden w-full -mx-6 px-6 sm:mx-0 sm:px-0">
                <div 
                    className="group relative aspect-video rounded-2xl overflow-hidden cursor-zoom-in transition-all shadow-xl"
                    onClick={() => handleZoomImage(showcaseImages[activeImg], "Scholarship Platform")}
                >
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeImg} 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            transition={{ duration: 0.5 }} 
                            className="absolute inset-0"
                        >
                            <Image src={showcaseImages[activeImg]} alt="Showcase" fill className="object-contain" />
                        </motion.div>
                    </AnimatePresence>
                </div>
              </div>

              <p className={`text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl font-light leading-relaxed ${!isEven ? 'lg:ml-auto' : ''}`}>
                {t(`items.${project.key}.desc`)}
              </p>
              
              {/* Features List for Scholarship */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-4 ${!isEven ? 'lg:justify-items-end' : ''}`}>
                {(t.raw(`items.${project.key}.features`) as string[]).map((feature, i) => (
                  <div key={i} className={`flex items-center gap-3 text-gray-700 dark:text-gray-300 ${!isEven ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-sm md:text-base font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className={`flex flex-wrap gap-4 pt-6 ${!isEven ? 'lg:justify-end' : ''}`}>
                {project.link && (
                  <Link href={project.link} target="_blank" className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest group/link bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap">
                    <Globe className="w-4 h-4" />
                    <span>Live Demo</span>
                    <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                )}
                {project.github && (
                  <Link href={project.github} target="_blank" className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest group/link border border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-all whitespace-nowrap">
                    <Github className="w-4 h-4" />
                    <span>Source Code</span>
                  </Link>
                )}
              </div>
            </div>
            <div className={`hidden lg:block lg:col-span-5 relative ${!isEven ? 'lg:order-1' : ''}`}>
               <div 
                    className="group relative aspect-video rounded-2xl overflow-hidden cursor-zoom-in transition-all"
                    onClick={() => handleZoomImage(showcaseImages[activeImg], "Scholarship Platform")}
                >
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeImg} 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            transition={{ duration: 0.5 }} 
                            className="absolute inset-0"
                        >
                            <Image src={showcaseImages[activeImg]} alt="Showcase" fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
                        </motion.div>
                    </AnimatePresence>
                    
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                        <div className="bg-white/90 dark:bg-black/90 p-3 rounded-full shadow-xl">
                            <ZoomIn className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Regular Projects without Image
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative w-full py-16 lg:py-24 transition-all duration-500 ${
        isEven ? 'bg-white dark:bg-[#050505]' : 'bg-gray-50/60 dark:bg-[#0a0a0a]'
      }`}
    >
      {backgroundNumber}
      <div className="container mx-auto px-6 relative z-10">
        <div className={`flex flex-col ${!isEven ? 'lg:items-end lg:text-right' : 'lg:items-start'}`}>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            {t(`items.${project.key}.title`)}
          </h3>
          <p className={`text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-4xl font-light leading-relaxed mb-10 ${!isEven ? 'lg:ml-auto' : ''}`}>
            {t(`items.${project.key}.desc`)}
          </p>
          <div className="flex gap-4">
            {project.link && (
              <Link href={project.link} target="_blank" className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:border-blue-500 transition-all font-bold text-sm bg-white dark:bg-transparent shadow-sm">
                <Globe className="w-4 h-4" />
                <span>View Live</span>
              </Link>
            )}
            {project.github && (
              <Link href={project.github} target="_blank" className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:border-blue-500 transition-all font-bold text-sm bg-white dark:bg-transparent shadow-sm">
                <Github className="w-4 h-4" />
                <span>Source</span>
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
    { key: "scholarship", link: "https://scholarship.ncuesa.org.tw", github: "https://github.com/GDG-on-campus-NCUE/NCUE-Scholarship", tags: ["Next.js", "Supabase", "Gemini"] },
    { key: "vote", link: "https://election.ncuesa.org.tw", github: "https://github.com/GDG-on-campus-NCUE/NCUE-SAVote", tags: ["React", "NestJS", "ZK Proof", "Circom"] },
    { key: "fin_agent", github: "https://github.com/Ming874/FinAgent", tags: ["Python", "Streamlit", "Gemini"] },
    { key: "meal_voucher", tags: ["GAS", "Google Sheets API", "Google Docs API", "Gmail Service"] }
  ];

  return (
    <section id="projects" className="bg-white dark:bg-[#050505] transition-colors duration-300 select-none overflow-hidden">
      <div className="container mx-auto px-6 pt-16 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-200 dark:border-gray-800 pb-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-[11px] md:text-xs font-black uppercase tracking-[0.3em] rounded-full">
              <Zap className="w-3 h-3 fill-white" /> Selected Works
            </div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              {t('title')}<span className="text-blue-600">.</span>
            </motion.h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-mono text-xs md:text-sm max-w-xs md:text-right leading-relaxed">
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
