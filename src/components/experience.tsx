"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Presentation,
  Award,
  Briefcase,
  GraduationCap,
  Mic,
  Projector,
  ZoomIn,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useModalStore } from "@/store/modal-store";

export function Experience() {
  const t = useTranslations("Experience");
  const containerRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModalStore();

  // Mobile Scroll Spy State
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = entry.target.getAttribute("data-key");
            if (key) setActiveKey(key);
          }
        });
      },
      {
        threshold: 0.6,
        rootMargin: "-10% 0px -10% 0px",
      },
    );

    itemRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const itemsData = [
    { key: "sitcon_2026", type: "vol", date: "2026-03" },
    { key: "gdgoc_lead", type: "lead", date: "2025-07" },
    { key: "general_affairs_2025", type: "work", date: "2025-07" },
    { key: "class_rep", type: "vol", date: "2025-09" },
    { key: "it_parttime_2025", type: "work", date: "2025-09" },
    { key: "devfest_2025", type: "vol", date: "2025-12" },
    { key: "itsa_2025", type: "award", date: "2025-12" },
    { key: "web_maint_2025", type: "work", date: "2025-07" },
    { key: "academic_award_3", type: "award", date: "2026-02" }, // 114-1 (Awarded early 2026 typically)
    { key: "gdgoc_core", type: "vol", date: "2025-02" },
    { key: "ai_contest_2025", type: "award", date: "2025-06" },
    { key: "academic_award_2", type: "award", date: "2025-09" }, // 113-2 (Awarded Sep 2025)
    { key: "dorm_manager", type: "vol", date: "2025-02" },
    { key: "contest_ta", type: "work", date: "2025-01" },
    { key: "speaker_gemini", type: "speak", date: "2025-05" },
    { key: "speaker_n8n", type: "speak", date: "2025-04" },
    { key: "speaker_cloud", type: "speak", date: "2025-03" },
    { key: "academic_award_1", type: "award", date: "2025-02" }, // 113-1 (Awarded Feb 2025)
    { key: "high_school", type: "edu", date: "2024-06" },
  ] as const;

  // Sorting: Oldest to Newest (Ascending) as requested "最新的在最後面"
  const items = [...itemsData].sort((a, b) => a.date.localeCompare(b.date));

  const slidesLinks: Record<string, string> = {
    speaker_n8n:
      "https://www.slideshare.net/slideshow/embed_code/key/1QT8eizVmSnyWg",
    speaker_cloud:
      "https://www.slideshare.net/slideshow/embed_code/key/8aKVVjvreMxVJZ",
    speaker_gemini:
      "https://www.slideshare.net/slideshow/embed_code/key/g8BbOUEW5z8hco",
  };

  const certLinks: Record<string, string> = {
    gdgoc_core: "/gdg_cert.webp",
    academic_award_1: "/113-2.webp",
    academic_award_2: "/114-1.webp",
    itsa_2025: "/ITSA.webp",
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "award":
        return <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "work":
        return (
          <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        );
      case "edu":
        return (
          <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      case "speak":
        return <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return (
          <Presentation className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  const openImageModal = (imgSrc: string) => {
    openModal(
      <div className="relative w-full h-[80vh] flex items-center justify-center bg-black">
        <Image
          src={imgSrc}
          alt="Certificate Fullscreen"
          fill
          className="object-contain"
          sizes="100vw"
        />
      </div>,
      { className: "p-0 bg-black max-w-7xl w-full" },
    );
  };

  return (
    <section
      id="experience"
      className="py-24 bg-gray-100 dark:bg-black transition-colors duration-300"
      ref={containerRef}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white"
          >
            {t("title").split(" ")[0]}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Gallery.
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 dark:text-gray-400 font-mono text-sm max-w-xs text-right hidden md:block"
          >
            Exploring the timeline of achievements,
            <br />
            contributions, and milestones.
          </motion.div>
        </div>

        {/* Masonry-like Grid / Staggered Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const hasSlides = !!slidesLinks[item.key];
            const slideUrl = slidesLinks[item.key];

            const hasCert = !!certLinks[item.key];
            const certUrl = certLinks[item.key];

            const isActive = activeKey === item.key;

                            return (
                          <motion.div
                            key={item.key}
                            ref={(el) => {
                              if (el) itemRefs.current.set(item.key, el);
                            }}
                            data-key={item.key}
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ 
                                duration: 0.6,
                                delay: index * 0.1,
                                type: "spring",
                                bounce: 0.4
                            }}
                            className={`
                                        group relative rounded-3xl p-6 sm:p-8 
                                        border transition-all duration-500 ease-out
                                        flex flex-col h-full
                                        ${isActive 
                                            ? "shadow-2xl translate-y-[-12px] scale-[1.04] bg-blue-50/30 dark:bg-blue-900/10 border-blue-500/50 dark:border-blue-400/50 z-20 ring-8 ring-blue-500/5 dark:ring-blue-400/5" 
                                            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:translate-y-[-4px] hover:border-gray-300 dark:hover:border-gray-700 hover:z-10"}
                                    `}
                          >
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl border transition-all duration-300 ${isActive ? "bg-blue-100 dark:bg-blue-800 border-blue-200 dark:border-blue-700 scale-110 shadow-lg" : "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700"}`}>
                                  {getIcon(item.type)}
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors duration-300 ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                                  {t(`items.${item.key}.year`)}
                                </span>
                              </div>
            
                              <h3
                                className={`text-xl font-bold mb-3 transition-all duration-300 ${isActive ? "text-blue-700 dark:text-blue-300 scale-[1.02] origin-left" : "text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"}`}
                              >
                                {t(`items.${item.key}.title`)}
                              </h3>
            
                              <p className={`text-sm leading-relaxed mb-6 line-clamp-4 transition-colors duration-300 ${isActive ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200"}`}>
                                {t(`items.${item.key}.desc`)}
                              </p>
                            </div>
                {/* Static Slides Display - Fixed Height */}
                {hasSlides && (
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 w-full">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <Projector className="w-3 h-3" />
                      Live Preview
                    </div>
                    <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-950 rounded-lg overflow-hidden shadow-inner border border-gray-100 dark:border-gray-800">
                      <iframe
                        src={slideUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        marginWidth={0}
                        marginHeight={0}
                        scrolling="no"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                {/* Certificate Preview - Fixed Height & No Crop */}
                {hasCert && (
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 w-full">
                    <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
                      <Award className="w-3 h-3" />
                      Certificate Preview
                    </div>
                    <div
                      className="relative w-full h-48 bg-gray-200 dark:bg-gray-950 rounded-lg overflow-hidden shadow-inner cursor-pointer group/cert border border-gray-100 dark:border-gray-800"
                      onClick={() => openImageModal(certUrl)}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover/cert:bg-black/10 transition-colors z-10 flex items-center justify-center opacity-0 group-hover/cert:opacity-100">
                        <ZoomIn className="w-8 h-8 text-white drop-shadow-md" />
                      </div>
                      <Image
                        src={certUrl}
                        alt="Certificate"
                        fill
                        className="object-contain p-2 transition-transform duration-500 group-hover/cert:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
