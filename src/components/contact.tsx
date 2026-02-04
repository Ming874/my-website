"use client"

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Github, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function Contact() {
  const t = useTranslations('Contact');
  
  const contacts = [
    { 
      name: "GitHub", 
      value: "@Ming874", 
      icon: Github, 
      url: "https://github.com/Ming874",
      color: "hover:text-gray-900 dark:hover:text-white"
    },
    { 
      name: "Email", 
      value: "3526ming@gmail.com", 
      icon: Mail, 
      url: "mailto:3526ming@gmail.com",
      color: "hover:text-red-500 dark:hover:text-red-400"
    },
    { 
      name: "LINE", 
      value: "Ming", 
      icon: MessageCircle, 
      url: "https://line.me/ti/p/aM_h9C0qjG",
      color: "hover:text-green-500 dark:hover:text-green-400"
    }
  ];

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-12 text-lg">
                {t('desc')}
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6">
                {contacts.map((contact, index) => (
                    <Link 
                        key={contact.name}
                        href={contact.url}
                        target="_blank"
                        className="group"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all min-w-[200px]"
                        >
                            <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-opacity-80 transition-colors ${contact.color.replace('hover:', 'text-').split(' ')[0]}`}>
                                <contact.icon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{contact.name}</div>
                                <div className={`font-semibold ${contact.color} transition-colors`}>{contact.value}</div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.div>
      </div>
    </section>
  );
}