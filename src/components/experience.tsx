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
  { key: "sitcon_2026", type: "vol", date: "2026-03" },
  { key: "academic_award_3", type: "award", date: "2026-02" },
  { key: "itsa_2025", type: "award", date: "2025-12" },
  { key: "devfest_2025", type: "vol", date: "2025-12" },
  { key: "academic_award_2", type: "award", date: "2025-09" },
  { key: "it_parttime_2025", type: "work", date: "2025-09" },
  { key: "class_rep", type: "vol", date: "2025-09" },
  { key: "gdgoc_lead", type: "lead", date: "2025-07" },
  { key: "general_affairs_2025", type: "work", date: "2025-07" },
  { key: "web_maint_2025", type: "work", date: "2025-07" },
  { key: "ai_contest_2025", type: "award", date: "2025-06" },
  { key: "speaker_gemini", type: "speak", date: "2025-05" },
  { key: "speaker_n8n", type: "speak", date: "2025-04" },
  { key: "speaker_cloud", type: "speak", date: "2025-03" },
  { key: "academic_award_1", type: "award", date: "2025-02" },
  { key: "gdgoc_core", type: "vol", date: "2025-02" },
  { key: "dorm_manager", type: "vol", date: "2025-02" },
  { key: "contest_ta", type: "work", date: "2025-01" },
  { key: "high_school", type: "edu", date: "2024-06" },
] as const;

// Chronological Sequence: 2024 to 2026 (Growth)
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

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-16 mb-12 last:mb-0 pl-10 md:pl-0">
      
      {/* Dynamic Tracking Node (Fill logic improved) */}
      <div className="absolute left-0 md:left-[224px] top-3 z-20 -translate-x-1/2">
        <motion.div 
          initial={{ backgroundColor: "rgba(59, 130, 246, 0)" }}
          whileInView={{ 
            backgroundColor: "rgb(59, 130, 246)",
            boxShadow: "0 0 12px rgba(59, 130, 246, 0.8)" 
          }}
          viewport={{ once: false, amount: 0.8, margin: "-45% 0px -45% 0px" }}
          className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 transition-colors duration-300"
        />
      </div>

      {/* Left: Sticky Year */}
      <div className="md:sticky md:top-32 h-fit">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-black text-gray-200 dark:text-gray-800 tracking-tighter transition-colors group-hover:text-blue-600/20 break-words font-mono">
          {t(`items.${item.key}.year`)}
        </motion.div>
      </div>

      {/* Right: Content Area */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            {t(`items.${item.key}.title`)}
          </h3>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-4xl font-light italic">
            {t(`items.${item.key}.desc`)}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          {slideUrl && (
            <button onClick={() => window.open(slideUrl, '_blank')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest transition-all">
              <Projector className="w-4 h-4" /> View Slides
            </button>
          )}
          {certUrl && (
            <button onClick={() => openImageModal(certUrl, t(`items.${item.key}.title`))} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest transition-all">
              <Award className="w-4 h-4" /> View Certificate
            </button>
          )}
        </div>

        {/* Bare Image Preview (No external container) */}
        {certUrl && (
          <div className="pt-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-full max-w-sm aspect-[1.414/1] rounded-2xl overflow-hidden cursor-zoom-in group/img transition-all duration-500"
              onClick={() => openImageModal(certUrl, t(`items.${item.key}.title`))}
            >
              <Image src={certUrl} alt="Preview" fill className="object-contain transition-transform duration-700 group-hover/img:scale-105" />
              <div className="absolute inset-0 bg-blue-600/0 group-hover/img:bg-blue-600/5 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all">
                <div className="p-3 bg-white/90 dark:bg-black/90 rounded-full shadow-xl">
                  <ZoomIn className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
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
    academic_award_1: "/113-1.webp",
    academic_award_2: "/113-2.webp",
    itsa_2025: "/ITSA.webp",
  };

  const openImageModal = (imgSrc: string, alt: string) => {
    openModal(
      <div className="relative w-[90vw] h-[90vh] pointer-events-auto">
        <Image src={imgSrc} alt={alt} fill className="object-contain" quality={100} priority unoptimized />
      </div>,
      { variant: 'clean', className: "p-0", hideCloseButton: false },
    );
  };

  return (
    <section id="experience" className="py-24 bg-white dark:bg-[#050505] transition-colors duration-300 select-none overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-20 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-blue-600 dark:text-blue-500 font-mono text-xs font-black uppercase tracking-[0.4em]">
            Milestones & Achievements
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
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
