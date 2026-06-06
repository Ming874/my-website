"use client"

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function MobileLoader({ onComplete }: { onComplete: () => void }) {
  const t = useTranslations('Hero');
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if mobile. If desktop, skip loader.
    if (window.innerWidth >= 768) {
      setShow(false);
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setShow(false);
      onComplete();
    }, 1800); // 1.8 seconds loading screen

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center pointer-events-none md:hidden"
        >
          {/* Dinosaur Sprite Display & Animation */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 0.4, 
              repeat: Infinity, 
              ease: "easeOut" 
            }}
            className="w-16 h-16 relative overflow-hidden pixelated"
          >
            <div 
              className="absolute top-0 left-0 w-[500%] h-[500%] bg-[url('/dino.png')] bg-no-repeat bg-[length:100%_100%]"
              style={{
                backgroundPosition: '0% 0%', // First frame (standing/jumping)
              }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 font-mono text-sm text-gray-500 font-bold"
          >
            LOADING...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
