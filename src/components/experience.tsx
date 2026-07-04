"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Award,
  Projector,
  ZoomIn,
  FileText,
} from "lucide-react";
import { useRef } from "react";
import { useModalStore } from "@/store/modal-store";

const itemsData = [
  { key: "hs_grad", type: "edu", date: "2024-06" },
  { key: "gdgoc_core", type: "vol", date: "2025-02" },
  { key: "speaker_n8n", type: "speak", date: "2025-04" },
  { key: "award_113_1", type: "award", date: "2025-04" },
  { key: "it_safety", type: "work", date: "2025-07" },
  { key: "class_rep", type: "vol", date: "2025-07" },
  { key: "gdgoc_lead", type: "lead", date: "2025-07" },
  { key: "sa_it", type: "vol", date: "2025-07" },
  { key: "it_guidance", type: "work", date: "2025-07" },
  { key: "speaker_cloud", type: "speak", date: "2025-10" },
  { key: "award_ai", type: "award", date: "2025-10" },
  { key: "award_113_2", type: "award", date: "2025-11" },
  { key: "contest_ta", type: "work", date: "2025-11" },
  { key: "speaker_gemini", type: "speak", date: "2025-11" },
  { key: "award_itsa", type: "award", date: "2025-12" },
  { key: "devfest_2025", type: "vol", date: "2025-12" },
  { key: "award_114_1", type: "award", date: "2026-02" },
  {key: "it_career", type: "work", date: "2026-02" },
  { key: "sitcon_2026", type: "vol", date: "2026-03" },
  { key: "twnog_7", type: "vol", date: "2026-05" },
  { key: "io_software", type: "lead", date: "2026-05" },
  { key: "nstc_research", type: "award", date: "2026-06" },
  { key: "speaker_hsnu", type: "speak", date: "2026-07" },
  { key: "sa_digital_minister", type: "lead", date: "2026-08" },
  { key: "it_network", type: "work", date: "2026-09" },
  ] as const;

// Sorting: Oldest to Newest
const items = [...itemsData].sort((a, b) => a.date.localeCompare(b.date));

const ExperienceItem = ({ 
  item, 
  index, 
  t, 
  slidesLinks, 
  certLinks, 
  openImageModal 
}: { 
  item: any, 
  index: number, 
  t: any, 
  slidesLinks: any,
  certLinks: any,
  openImageModal: (src: string, alt: string) => void
}) => {
  const slideUrl = slidesLinks[item.key];
  const certUrl = certLinks[item.key];

  const nodeVariants = {
    inactive: { 
      backgroundColor: "transparent", 
      boxShadow: "none",
      borderColor: "rgb(59, 130, 246)"
    },
    active: { 
      backgroundColor: "rgb(59, 130, 246)",
      boxShadow: "0 0 12px rgba(59, 130, 246, 0.8)",
      borderColor: "rgb(59, 130, 246)"
    }
  };

  const dateVariants = {
    inactive: { opacity: 0.2, color: "rgb(156, 163, 175)" },
    active: { opacity: 1, color: "rgb(37, 99, 235)" }
  };

  const contentVariants = {
    inactive: { opacity: 0, y: 15 },
    active: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="inactive"
      whileInView="active"
      viewport={{ once: true, margin: "0px 0px -45% 0px" }}
      className="relative grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-16 mb-12 last:mb-0 pl-10 md:pl-0 group/exp will-change-transform"
      style={{ backfaceVisibility: "hidden" }}
    >
      
      {/* Dynamic Tracking Node (Sync logic improved) */}
      <div className="absolute left-0 md:left-[224px] top-3 z-20 -translate-x-1/2">
        <motion.div 
          variants={nodeVariants}
          transition={{ duration: 0.4 }}
          className="w-3.5 h-3.5 rounded-full border-2 transition-colors"
        />
      </div>

      {/* Left: Sticky Year */}
      <div className="md:sticky md:top-32 h-fit md:text-right md:pr-4">
        <motion.div 
          variants={dateVariants}
          transition={{ duration: 0.4 }}
          className="text-lg md:text-xl font-bold tracking-tight font-mono italic whitespace-nowrap"
        >
          {t(`items.${item.key}.year`)}
        </motion.div>
      </div>

      {/* Right: Content Area */}
      <motion.div 
        variants={contentVariants}
        transition={{ duration: 0.5 }} 
        className="space-y-4 will-change-transform"
      >
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            {t(`items.${item.key}.title`)}
          </h3>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-4xl font-light italic">
            {t(`items.${item.key}.desc`).split(/(https?:\/\/[^\s]+)/g).map((part: string, i: number) => 
              part.match(/^https?:\/\//) ? (
                <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline underline-offset-4 transition-colors break-all">
                  {part}
                </a>
              ) : part
            )}
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {slideUrl && (
            <div className="relative w-full max-w-sm aspect-[1.414/1] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-900">
              <iframe 
                src={slideUrl} 
                className="absolute inset-0 w-full h-full" 
                frameBorder="0" 
                marginWidth={0} 
                marginHeight={0} 
                scrolling="no" 
                allowFullScreen
              />
            </div>
          )}

          {/* Bare Image Preview (No external container) */}
          {certUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10px" }}
              className="relative w-full max-w-sm aspect-[1.414/1] rounded-2xl overflow-hidden cursor-zoom-in group/img transition-all duration-500 border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-900 will-change-transform"
              onClick={() => openImageModal(certUrl, t(`items.${item.key}.title`))}
            >
              <img 
                src={certUrl} 
                alt="Preview" 
                className="w-full h-full object-contain transition-transform duration-700 group-hover/img:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-blue-600/0 group-hover/img:bg-blue-600/5 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all">
                <div className="p-3 bg-white/90 dark:bg-black/90 rounded-full shadow-xl">
                  <ZoomIn className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export function Experience() {
  const t = useTranslations("Experience");
  const { openModal } = useModalStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const slidesLinks: Record<string, string> = {
    speaker_n8n: "https://www.slideshare.net/slideshow/embed_code/key/1QT8eizVmSnyWg",
    speaker_cloud: "https://www.slideshare.net/slideshow/embed_code/key/8aKVVjvreMxVJZ",
    speaker_gemini: "https://www.slideshare.net/slideshow/embed_code/key/g8BbOUEW5z8hco",
  };

  const certLinks: Record<string, string> = {
    gdgoc_core: "/gdg_cert.webp",
    award_113_1: "/113-1.webp",
    award_113_2: "/113-2.webp",
    award_itsa: "/ITSA.webp",
    devfest_2025: "/devfest.webp",
    sitcon_2026: "/SITCON.webp",
    speaker_hsnu: "/hsnu.webp",
  };

  const openImageModal = (imgSrc: string, alt: string) => {
    openModal(
      <div className="relative w-[90vw] h-[90vh] pointer-events-auto flex items-center justify-center">
        <img 
            src={imgSrc} 
            alt={alt} 
            className="max-w-full max-h-full object-contain shadow-2xl"
            loading="eager"
            decoding="sync"
        />
      </div>,
      { variant: 'clean', className: "p-0", hideCloseButton: false },
    );
  };

  return (
    <section id="experience" className="pt-12 pb-24 bg-white dark:bg-[#050505] transition-colors duration-300 select-none overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-20 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-blue-600 dark:text-blue-500 font-mono text-sm md:text-base font-black uppercase tracking-[0.4em]">
            Milestones & Achievements
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
            {t("title")}<span className="text-blue-600">.</span>
          </motion.h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute left-0 md:left-[224px] top-0 bottom-0 w-px bg-gray-100 dark:bg-gray-800 z-0">
            <motion.div style={{ height: useTransform(pathLength, [0, 1], ["0%", "100%"]) }} className="absolute top-0 left-0 w-px bg-gradient-to-b from-blue-400 via-blue-600 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10" />
          </div>
          <div className="relative z-10">
            {items.map((item, index) => (
              <ExperienceItem key={item.key} item={item} index={index} t={t} slidesLinks={slidesLinks} certLinks={certLinks} openImageModal={openImageModal} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
