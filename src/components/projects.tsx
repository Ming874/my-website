"use client"

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Sparkles, Bot, Database, Globe, Lock, Cpu, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function Projects() {
  const t = useTranslations('Projects'); 
  
  const projects = [
    {
      key: "scholarship",
      link: "https://scholarship.ncuesa.org.tw",
      github: "https://github.com/GDG-on-campus-NCUE/NCUE-Scholarship",
      featured: true,
      tags: ["Next.js", "Supabase", "Gemini AI"]
    },
    {
      key: "vote",
      link: "https://election.ncuesa.org.tw",
      tags: ["Blockchain", "Web3", "Solidity"]
    },
    {
      key: "fin_agent",
      github: "https://github.com/Ming874/FinAgent",
      tags: ["Python", "Streamlit", "Gemini AI"]
    },
     {
      key: "meal_voucher",
      tags: ["React", "System Design"]
    }
  ];

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('AI') || feature.includes('Gemini')) return <Bot className="w-3 h-3" />;
    if (feature.includes('Pipeline') || feature.includes('爬蟲')) return <Database className="w-3 h-3" />;
    if (feature.includes('Web3') || feature.includes('Blockchain')) return <Lock className="w-3 h-3" />;
    if (feature.includes('FPGA') || feature.includes('Design')) return <Cpu className="w-3 h-3" />;
    if (feature.includes('Security') || feature.includes('PQC') || feature.includes('PUF') || feature.includes('安全')) return <ShieldCheck className="w-3 h-3" />;
    return <Sparkles className="w-3 h-3" />;
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
        >
          {t('title')}
        </motion.h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Project (Spans 2 columns on large screens) */}
            {projects.filter(p => p.featured).map((project) => (
                <motion.div
                    key={project.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-3 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-blue-100 dark:border-blue-900/30 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-48 h-48 text-blue-500" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                <Sparkles className="w-3 h-3" /> Featured Project
                            </div>
                            
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                {t(`items.${project.key}.title`)}
                            </h3>
                            
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                {t(`items.${project.key}.desc`)}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {(t.raw(`items.${project.key}.features`) as string[]).map((feature, i) => (
                                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {getFeatureIcon(feature)}
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-4 flex gap-4">
                                {project.link && (
                                    <Link href={project.link} target="_blank" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30">
                                        <Globe className="w-4 h-4" /> Live Demo
                                    </Link>
                                )}
                                {project.github && (
                                    <Link href={project.github} target="_blank" className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-semibold flex items-center gap-2 transition-all">
                                        <Github className="w-4 h-4" /> Source Code
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Other Projects */}
            {projects.filter(p => !p.featured).map((project, index) => (
                <motion.div
                    key={project.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 flex flex-col h-full group"
                >
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
                            {t(`items.${project.key}.title`)}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                            {t(`items.${project.key}.desc`)}
                        </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-4">
                         {project.link && (
                            <Link href={project.link} target="_blank" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1">
                                <ExternalLink className="w-4 h-4" /> Demo
                            </Link>
                        )}
                         {project.github && (
                            <Link href={project.github} target="_blank" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1">
                                <Github className="w-4 h-4" /> Code
                            </Link>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
