"use client"

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FileText, Cpu, ZoomIn } from 'lucide-react';
import { useModalStore } from '@/store/modal-store';

export function About() {
  const t = useTranslations('About');
  const { openModal } = useModalStore();

  const handleOpenPdf = () => {
    openModal(
      <div className="w-full h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-xl font-bold truncate pr-4">{t('researchTitle')}</h3>
        </div>
        <div className="relative w-full h-[80vh] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
             <iframe 
                src="research.pdf" 
                width="100%" 
                height="100%" 
                className="absolute inset-0 w-full h-full"
            />
        </div>
      </div>
    );
  };

  const handleZoomImage = (src: string, alt: string) => {
    openModal(
        <div className="w-full h-full flex items-center justify-center bg-black/95 cursor-zoom-out" onClick={() => useModalStore.getState().closeModal()}>
             <div className="relative w-full h-full p-4 md:p-8">
                <Image 
                    src={src} 
                    alt={alt} 
                    fill
                    className="object-contain"
                    quality={100}
                />
            </div>
        </div>,
        { 
            className: "!max-w-none !max-h-none !w-screen !h-screen !m-0 !rounded-none !bg-transparent !border-0 !shadow-none !p-0 overflow-hidden",
            hideCloseButton: false
        }
    );
  }

  const tags = ['TOEIC Gold', 'Cisco CCNA', 'FPGA Design', 'Hardware Security', 'Verilog', 'Post-Quantum Cryptography'];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
        >
          {t('title')}
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            {/* Left Column: Image */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
            >
                <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                    <Image 
                        src="/image.png"
                        alt="Ming"
                        fill
                        className="object-cover"
                    />
                </div>
                
                {/* Decorative Frame */}
                <div className="absolute inset-0 border-2 border-blue-500/30 rounded-2xl transform translate-x-4 translate-y-4 -z-10 hidden md:block" />
            </motion.div>

            {/* Right Column: Content */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
            >
                {/* Intro */}
                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                        {t('intro')}
                    </p>
                </div>

                {/* Research Card */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('researchTitle')}
                        </h3>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        {t('researchDesc')}
                    </p>

                    {/* Research Architecture Diagram */}
                    <div 
                        className="mb-8 relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-inner group/img cursor-zoom-in"
                        onClick={() => handleZoomImage("/research.png", "Research Architecture")}
                    >
                        <Image 
                            src="/research.png"
                            alt="Research Architecture"
                            fill
                            className="object-contain p-1 transition-transform duration-500 group-hover/img:scale-[1.02]"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <ZoomIn className="w-4 h-4"/>
                        </div>
                    </div>

                    <button
                        onClick={handleOpenPdf}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <FileText className="w-5 h-5" />
                        {t('researchButton')}
                    </button>
                </div>

                {/* Skills/Other Interests - Improved Visuals */}
                <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Focus & Certifications</h4>
                    <div className="flex flex-wrap gap-3">
                        {tags.map((tag) => (
                            <span 
                                key={tag} 
                                className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-semibold border border-blue-100 dark:border-blue-800 shadow-sm hover:scale-105 transition-transform cursor-default"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  )
}