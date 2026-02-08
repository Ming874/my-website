"use client"

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useMotionValue, useAnimation, useMotionTemplate } from 'framer-motion';
import Image from 'next/image';
import { Cpu, ZoomIn, Award, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import { useModalStore } from '@/store/modal-store';
import { useRef, useState } from 'react';

// Reusable Highlighter Component
const Highlighter = ({ children }: { children: React.ReactNode }) => (
  <span className="relative inline-block font-bold text-gray-900 dark:text-white">
    <span className="absolute bottom-1 left-0 right-0 h-[30%] bg-blue-200/60 dark:bg-blue-500/30 -z-10 rounded-sm" />
    {children}
  </span>
);

const ResearchHighlighter = ({ children }: { children: React.ReactNode }) => (
  <span className="relative inline-block font-bold text-gray-900 dark:text-white group cursor-default">
    <motion.span
      initial={{ width: "0%" }}
      whileInView={{ width: "100%" }}
      viewport={{ once: false }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute bottom-1 left-0 h-[40%] bg-yellow-300/60 dark:bg-yellow-500/50 -z-10 rounded-sm group-hover:bg-yellow-300/90 dark:group-hover:bg-yellow-500/80 transition-colors duration-300"
    />
    {children}
  </span>
);

// Slide to Unlock Button Component
const SlideButton = ({ onUnlock, text }: { onUnlock: () => void, text: string }) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [unlocked, setUnlocked] = useState(false);

  // Calculate progress for opacity/style changes
  const bgOpacity = useTransform(x, [0, 200], [0.5, 1]);
  const width = useTransform(x, (latest) => Math.max(56, latest + 56)); // Handle width (56px) + drag distance

  const handleDragEnd = () => {
    setIsDragging(false);
    const currentX = x.get();
    if (constraintsRef.current) {
        const constraintWidth = constraintsRef.current.offsetWidth;
        // If dragged more than 60% of the width
        if (currentX > constraintWidth * 0.6) {
            setUnlocked(true);
            controls.start({ x: constraintWidth - 56 }); // Snap to end (56 is handle width)
            onUnlock();
            // Reset after a delay
            setTimeout(() => {
                setUnlocked(false);
                controls.start({ x: 0 });
            }, 2000);
        } else {
            controls.start({ x: 0 });
        }
    }
  };

  return (
    <div 
        ref={constraintsRef} 
        className="relative w-full sm:w-[350px] h-16 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner select-none"
    >
        {/* Track Progress Fill */}
        <motion.div 
            className="absolute top-1 bottom-1 left-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full z-10"
            style={{ opacity: bgOpacity, width }} 
        />
        
        {/* Text Label */}
        <motion.div 
            className="absolute inset-0 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 pointer-events-none z-0"
            style={{ opacity: useTransform(x, [0, 150], [1, 0]) }}
        >
            <span className="flex items-center gap-2 text-sm uppercase tracking-widest pl-12 drop-shadow-sm"> 
                {text} <ChevronRight className="w-4 h-4 animate-pulse" />
            </span>
        </motion.div>

        {/* Success Label */}
        {unlocked && (
            <div className="absolute inset-0 flex items-center justify-center font-bold text-white pointer-events-none animate-in fade-in zoom-in z-20">
                <span className="flex items-center gap-2 drop-shadow-md">
                    Opening PDF...
                </span>
            </div>
        )}

        {/* Draggable Handle */}
        <motion.div
            className="absolute left-1 top-1 bottom-1 w-14 rounded-full shadow-lg border flex items-center justify-center cursor-grab active:cursor-grabbing z-30 transition-colors duration-300 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700"
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0.05}
            dragMomentum={false}
            whileDrag={{ scale: 1.05 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{ x }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="transition-colors duration-300 text-blue-600 dark:text-blue-400">
                <ArrowRight className="w-6 h-6" />
            </div>
        </motion.div>
    </div>
  );
};

export function About() {
  const t = useTranslations('About');
  const { openModal } = useModalStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // --- Mouse Parallax Logic ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5; // Range: -0.5 to 0.5
    const y = (clientY - top) / height - 0.5; // Range: -0.5 to 0.5
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // --- Parallax Transforms ---
  // Mouse Parallax (Desktop)
  const xBack = useTransform(mouseX, [-0.5, 0.5], ["1.5%", "-1.5%"]);
  const yMouseBack = useTransform(mouseY, [-0.5, 0.5], ["1.5%", "-1.5%"]);
  
  const xFront = useTransform(mouseX, [-0.5, 0.5], ["4%", "-4%"]);
  const yMouseFront = useTransform(mouseY, [-0.5, 0.5], ["4%", "-4%"]);

  // Scroll Parallax (Mobile & Desktop)
  // Background moves slower (appears further)
  const yScrollBack = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]); 
  // Foreground moves faster (appears closer)
  const yScrollFront = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  // Combine
  const yBack = useMotionTemplate`calc(${yScrollBack} + ${yMouseBack})`;
  const yFront = useMotionTemplate`calc(${yScrollFront} + ${yMouseFront})`;
  
  // 3D Rotation (Subtle)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-2deg", "2deg"]);

  // Background gradient movement
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleOpenPdf = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      window.open("research.pdf", "_blank");
      return;
    }
    openModal(
      <div className="relative w-[90vw] h-[90vh] pointer-events-auto">
           <iframe 
              src="research.pdf" 
              width="100%" 
              height="100%" 
              className="absolute inset-0 w-full h-full rounded-lg bg-white"
          />
      </div>,
      { 
          variant: 'clean',
          className: "p-0",
          hideCloseButton: false 
      }
    );
  };

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

  const tags = t.raw('tags') as string[];

  return (
    <section id="about" ref={containerRef} className="py-24 lg:py-32 relative overflow-hidden bg-white dark:bg-[#050505]">
      
      {/* Background Ambience */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* LEFT COLUMN: Parallax Image Stack & Focus Areas */}
            <div className="lg:col-span-5 flex flex-col gap-12 lg:sticky lg:top-32">
                
                {/* 2-Layer Interactive Parallax Image */}
                <motion.div 
                    className="relative w-full aspect-[3/4] rounded-[2rem] shadow-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 perspective-1000"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                >
                    
                    {/* Layer 2: Background */}
                    <motion.div 
                        style={{ y: yBack, x: xBack, scale: 1.25 }} 
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image 
                            src="/2.png" 
                            alt="Background Layer" 
                            fill 
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>

                    {/* Layer 1: Foreground */}
                    <motion.div 
                        style={{ y: yFront, x: xFront, scale: 1.25 }} 
                        className="absolute inset-0 w-full h-full"
                    >
                         <Image 
                            src="/1.png" 
                            alt="Ming" 
                            fill 
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>

                    {/* Static Floating Card (No Parallax) */}
                    <div className="absolute bottom-8 left-8 right-8 z-10 pointer-events-none">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shrink-0">
                                    <Sparkles className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-white text-xs font-bold uppercase tracking-wider opacity-90">Current Status</p>
                                    <p className="text-white font-bold text-sm">Exploring & Building</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Focus Areas (Moved to Left Column) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                     <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                        <Award className="w-6 h-6 text-yellow-500" />
                        {t('focusTitle')}
                     </h4>
                     <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                            <motion.span 
                                key={tag}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800/50 border border-transparent hover:border-blue-500/50 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors cursor-default"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                {tag}
                            </motion.span>
                        ))}
                     </div>
                </motion.div>
            </div>

            {/* RIGHT COLUMN: Content */}
            <div className="lg:col-span-7 space-y-16 pt-0 lg:pt-10">
                
                {/* Intro Header & Text */}
                <div className="space-y-8">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight"
                    >
                        {t('title')}
                        <span className="text-blue-600 dark:text-blue-500">.</span>
                    </motion.h2>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="prose prose-lg md:prose-xl dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 font-light leading-relaxed"
                    >
                        <p>
                            {t.rich('intro', {
                                highlight: (chunks) => <Highlighter>{chunks}</Highlighter>
                            })}
                        </p>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

                {/* Research Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">{t('recentResearch')}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                        {t('researchTitle')}
                    </h3>

                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        {t.rich('researchDesc', {
                            highlight: (chunks) => <ResearchHighlighter>{chunks}</ResearchHighlighter>
                        })}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        {/* Research Image Thumbnail */}
                        <div className="space-y-3">
                            <div 
                                className="relative aspect-video rounded-xl overflow-hidden cursor-zoom-in group border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-md hover:shadow-xl transition-all"
                                onClick={() => handleZoomImage("/research.png", "Architecture Diagram")}
                            >
                                <Image 
                                    src="/research.png" 
                                    alt="Research" 
                                    fill 
                                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                        <ZoomIn className="w-4 h-4" /> View
                                    </span>
                                </div>
                            </div>
                            
                            {/* Tap to view Hint moved here */}
                            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                                {t.rich('clickToView', { 
                                    b: (chunks) => <b>{chunks}</b> 
                                }) || "Tap to view full diagram"}
                            </p>
                        </div>

                        {/* Slide to Unlock Action */}
                        <div className="flex flex-col justify-center gap-4">
                            <div className="w-full flex justify-start md:justify-center">
                                <SlideButton 
                                    onUnlock={handleOpenPdf} 
                                    text={t('researchButton')} // "Read Research Proposal"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </div>
    </section>
  )
}