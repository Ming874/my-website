"use client"

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useModalStore } from '@/store/modal-store';
import { Presentation, Award, Briefcase, GraduationCap, Mic, Projector } from 'lucide-react';
import { useRef } from 'react';

export function Experience() {
  const t = useTranslations('Experience');
  const { openModal } = useModalStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const itemsData = [
    { key: 'sitcon_2026', type: 'vol', date: '2026-03' },
    { key: 'gdgoc_lead', type: 'lead', date: '2025-07' },
    { key: 'general_affairs_2025', type: 'work', date: '2025-07' },
    { key: 'class_rep', type: 'vol', date: '2025-09' },
    { key: 'it_parttime_2025', type: 'work', date: '2025-09' },
    { key: 'devfest_2025', type: 'vol', date: '2025-12' },
    { key: 'itsa_2025', type: 'award', date: '2025-12' },
    { key: 'web_maint_2025', type: 'work', date: '2025-07' },
    { key: 'academic_award_3', type: 'award', date: '2026-02' }, // 114-1 (Awarded early 2026 typically)
    { key: 'gdgoc_core', type: 'vol', date: '2025-02' },
    { key: 'ai_contest_2025', type: 'award', date: '2025-06' },
    { key: 'academic_award_2', type: 'award', date: '2025-09' }, // 113-2 (Awarded Sep 2025)
    { key: 'dorm_manager', type: 'vol', date: '2025-02' },
    { key: 'contest_ta', type: 'work', date: '2025-01' },
    { key: 'speaker_gemini', type: 'speak', date: '2025-05' },
    { key: 'speaker_n8n', type: 'speak', date: '2025-04' },
    { key: 'speaker_cloud', type: 'speak', date: '2025-03' },
    { key: 'academic_award_1', type: 'award', date: '2025-02' }, // 113-1 (Awarded Feb 2025)
    { key: 'high_school', type: 'edu', date: '2024-06' }
  ] as const;

  // Sorting: Oldest to Newest (Ascending) as requested "最新的在最後面"
  const items = [...itemsData].sort((a, b) => a.date.localeCompare(b.date));

  const slidesLinks: Record<string, string> = {
    'speaker_n8n': 'https://www.slideshare.net/slideshow/embed_code/key/1QT8eizVmSnyWg',
    'speaker_cloud': 'https://www.slideshare.net/slideshow/embed_code/key/8aKVVjvreMxVJZ',
    'speaker_gemini': 'https://www.slideshare.net/slideshow/embed_code/key/g8BbOUEW5z8hco'
  };

  const getIcon = (type: string) => {
    switch(type) {
        case 'award': return <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
        case 'work': return <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
        case 'edu': return <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />;
        case 'speak': return <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
        default: return <Presentation className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <section id="experience" className="py-24 bg-gray-100 dark:bg-black transition-colors duration-300" ref={containerRef}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white"
            >
              {t('title').split(' ')[0]}<br/>
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
                Exploring the timeline of achievements,<br/>contributions, and milestones.
            </motion.div>
        </div>

        {/* Masonry-like Grid / Staggered Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => {
                const hasSlides = !!slidesLinks[item.key];
                const slideUrl = slidesLinks[item.key];
                
                return (
                    <motion.div 
                        key={item.key}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        className={`
                            group relative rounded-3xl p-8 
                            bg-white dark:bg-gray-900 
                            border border-gray-200 dark:border-gray-800 
                            shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
                            flex flex-col justify-between min-h-[200px]
                        `}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    {getIcon(item.type)}
                                </div>
                                <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full uppercase tracking-wider">
                                    {t(`items.${item.key}.year`)}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {t(`items.${item.key}.title`)}
                            </h3>
                            
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                                {t(`items.${item.key}.desc`)}
                            </p>
                        </div>

                        {/* Auto-expand Slides when in view */}
                        {hasSlides && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                whileInView={{ height: 'auto', opacity: 1 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.5 }}
                                className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
                            >
                                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                                    <Projector className="w-3 h-3" />
                                    Live Preview
                                </div>
                                <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-inner">
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
                            </motion.div>
                        )}
                    </motion.div>
                );
            })}
        </div>
      </div>
    </section>
  );
}