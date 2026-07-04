"use client"

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Globe, ArrowUpRight, Zap, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useModalStore } from '@/store/modal-store';

const ProjectRow = ({ project, index, t, mounted }: { project: any, index: number, t: any, mounted: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { openModal } = useModalStore();
  const isScholarship = project.key === 'scholarship';
  const isEven = index % 2 === 0;
  const isTablet = mounted && window.innerWidth >= 768;

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
        <div className="relative w-[90vw] h-[90vh] pointer-events-auto flex items-center justify-center">
            <img 
                src={src} 
                alt={alt} 
                className="max-w-full max-h-full object-contain shadow-2xl"
                loading="eager"
                decoding="sync"
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
        key={mounted ? 'mounted' : 'server'}
        variants={{
          hidden: { opacity: 0, x: !isEven ? -100 : 100 },
          visible: { opacity: 1, x: 0 }
        }}
        initial={isTablet ? "hidden" : "visible"}
        whileInView={isTablet ? "visible" : "visible"}
        viewport={{ once: true, amount: 0.1 }}
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isTablet ? 30 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  // Featured Project with Image
  if (isScholarship) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-full py-12 lg:py-24 transition-all duration-500 will-change-transform ${
          isEven ? 'bg-white dark:bg-[#050505]' : 'bg-gray-50/60 dark:bg-[#0a0a0a]'
        }`}
        style={{ backfaceVisibility: "hidden" }}
      >
        {backgroundNumber}
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <motion.div variants={itemVariants} className={`lg:col-span-7 space-y-8 ${!isEven ? 'lg:order-2 lg:text-right' : ''}`}>
              <motion.div variants={itemVariants} className={`flex items-center gap-6 ${!isEven ? 'lg:justify-end' : ''}`}>
                <span className="text-sm font-mono text-blue-600 dark:text-blue-500 font-bold tracking-widest">PROJECT 0{index + 1}</span>
                <div className="h-px w-12 bg-blue-600/30 dark:bg-blue-500/30" />
                <div className="flex gap-3">
                  {project.tags.map((tag: string) => (
                    <span key={tag} className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
              <motion.h3 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.1]">
                {t(`items.${project.key}.title`)}
              </motion.h3>

              {/* Mobile Image Carousel - Shown only on small screens */}
              <motion.div variants={itemVariants} className="lg:hidden w-full -mx-6 px-6 sm:mx-0 sm:px-0">
                <div 
                    className="group relative aspect-video rounded-2xl overflow-hidden cursor-zoom-in transition-all shadow-xl bg-gray-100 dark:bg-gray-900"
                    onClick={() => handleZoomImage(showcaseImages[activeImg], "Scholarship Platform")}
                >
                    <AnimatePresence mode="popLayout">
                        <motion.div 
                            key={activeImg} 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            transition={{ duration: 0.4 }} 
                            className="absolute inset-0"
                        >
                            <img 
                              src={showcaseImages[activeImg]} 
                              alt="Showcase" 
                              className="w-full h-full object-contain"
                              loading="eager"
                              decoding="async"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
              </motion.div>

              <motion.p variants={itemVariants} className={`text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl font-light leading-relaxed ${!isEven ? 'lg:ml-auto' : ''}`}>
                {t(`items.${project.key}.desc`)}
              </motion.p>
              
              {/* Features List for Scholarship */}
              <motion.div variants={itemVariants} className={`grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-4 ${!isEven ? 'lg:justify-items-end' : ''}`}>
                {(t.raw(`items.${project.key}.features`) as string[]).map((feature, i) => (
                  <div key={i} className={`flex items-center gap-3 text-gray-700 dark:text-gray-300 ${!isEven ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-sm md:text-base font-medium">{feature}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className={`flex flex-wrap gap-4 pt-6 ${!isEven ? 'lg:justify-end' : ''}`}>
                {project.link && (
                  <motion.a href={project.link} target="_blank" 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest group/link bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 whitespace-nowrap">
                    <Globe className="w-4 h-4" />
                    <span>Live Demo</span>
                    <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </motion.a>
                )}
                {project.github && (
                  <motion.a href={project.github} target="_blank" 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest group/link border border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors whitespace-nowrap">
                    <Github className="w-4 h-4" />
                    <span>Source Code</span>
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
            <motion.div variants={itemVariants} className={`hidden lg:block lg:col-span-5 relative ${!isEven ? 'lg:order-1' : ''}`}>
               <div 
                    className="group relative aspect-video rounded-2xl overflow-hidden cursor-zoom-in transition-all bg-gray-100 dark:bg-gray-900"
                    onClick={() => handleZoomImage(showcaseImages[activeImg], "Scholarship Platform")}
                >
                    <AnimatePresence mode="popLayout">
                        <motion.div 
                            key={activeImg} 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            transition={{ duration: 0.4 }} 
                            className="absolute inset-0"
                        >
                            <img 
                              src={showcaseImages[activeImg]} 
                              alt="Showcase" 
                              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                              loading="eager"
                              decoding="async"
                            />
                        </motion.div>
                    </AnimatePresence>
                    
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                        <div className="bg-white/90 dark:bg-black/90 p-3 rounded-full shadow-xl">
                            <ZoomIn className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Regular Projects without Image
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className={`group relative w-full py-16 lg:py-24 transition-all duration-500 will-change-transform ${
        isEven ? 'bg-white dark:bg-[#050505]' : 'bg-gray-50/60 dark:bg-[#0a0a0a]'
      }`}
      style={{ backfaceVisibility: "hidden" }}
    >
      {backgroundNumber}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div variants={itemVariants} className={`flex flex-col ${!isEven ? 'lg:items-end lg:text-right' : 'lg:items-start'}`}>
          <motion.div variants={itemVariants} className={`flex items-center gap-4 md:gap-6 mb-4 ${!isEven ? 'lg:justify-end' : ''}`}>
            <span className="text-sm font-mono text-blue-600 dark:text-blue-500 font-bold tracking-widest">PROJECT 0{index + 1}</span>
            <div className="h-px w-12 bg-blue-600/30 dark:bg-blue-500/30" />
            <div className="flex flex-wrap gap-2 md:gap-3">
              {project.tags?.map((tag: string) => (
                <span key={tag} className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.h3 variants={itemVariants} className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            {t(`items.${project.key}.title`)}
          </motion.h3>
          <motion.p variants={itemVariants} className={`text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-4xl font-light leading-relaxed mb-6 ${!isEven ? 'lg:ml-auto' : ''}`}>
            {t(`items.${project.key}.desc`)}
          </motion.p>
          {project.hasFeatures && (
            <motion.div variants={itemVariants} className={`grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-10 ${!isEven ? 'lg:justify-items-end' : ''}`}>
              {(t.raw(`items.${project.key}.features`) as string[]).map((feature, i) => (
                <div key={i} className={`flex items-center gap-3 text-gray-700 dark:text-gray-300 ${!isEven ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-sm md:text-base font-medium">{feature}</span>
                </div>
              ))}
            </motion.div>
          )}
          <motion.div variants={itemVariants} className="flex gap-4">
            {project.link && (
              <motion.a href={project.link} target="_blank" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:border-blue-500 transition-colors font-bold text-sm bg-white dark:bg-transparent shadow-sm">
                <Globe className="w-4 h-4" />
                <span>View Live</span>
              </motion.a>
            )}
            {project.github && (
              <motion.a href={project.github} target="_blank" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:border-blue-500 transition-colors font-bold text-sm bg-white dark:bg-transparent shadow-sm">
                <Github className="w-4 h-4" />
                <span>Source</span>
              </motion.a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export function Projects() {
  const t = useTranslations('Projects'); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const projects = [
    { key: "scholarship", link: "https://scholarship.ncuesa.org.tw", github: "https://github.com/Ming874/NCUE-Scholarship", tags: ["Next.js", "Supabase", "Gemini"], hasFeatures: true },
    { key: "vote", link: "https://election.ncuesa.org.tw", github: "https://github.com/GDG-on-campus-NCUE/NCUE-SAVote", tags: ["React", "NestJS", "ZK Proof", "Circom"] },
    { key: "fin_agent", github: "https://github.com/Ming874/FinAgent", tags: ["Python", "Streamlit", "Gemini"] },
    { key: "meal_voucher", tags: ["GAS", "Google Sheets API", "Google Docs API", "Gmail Service"] },
    { key: "ai_gateway", link: "https://ai-gateway.iosoftware.ai", tags: ["AI Gateway", "Gemini", "Imagen 4.0", "ElevenLabs"], hasFeatures: true }
  ];

  return (
    <section id="projects" className="bg-white dark:bg-[#050505] transition-colors duration-300 select-none overflow-hidden">
      <div className="container mx-auto px-6 pt-16 pb-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-200 dark:border-gray-800 pb-8"
        >
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } } }} className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-[11px] md:text-xs font-black uppercase tracking-[0.3em] rounded-full">
              <Zap className="w-3 h-3 fill-white" /> Selected Works
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              {t('title')}<span className="text-blue-600">.</span>
            </h2>
          </motion.div>
          <motion.p variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } } }} className="text-gray-500 dark:text-gray-400 font-mono text-xs md:text-sm max-w-xs md:text-right leading-relaxed">
            Crafting digital experiences with purpose, precision, and passion.
          </motion.p>
        </motion.div>
      </div>
      <div className="flex flex-col">
        {projects.map((project, index) => (
          <ProjectRow key={project.key} project={project} index={index} t={t} mounted={mounted} />
        ))}
      </div>
    </section>
  );
}
