"use client";

import { useModalStore } from "@/store/modal-store";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";


export function GlobalModal() {
  const { isOpen, content, closeModal, options } = useModalStore();
  const variant = options?.variant || 'default';

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: variant === 'clean' ? 0 : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: variant === 'clean' ? 0 : 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className={
              variant === 'clean' 
                ? `relative flex items-center justify-center outline-none ${options?.className || ""}`
                : `relative w-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col ${options?.className || "max-w-5xl"}`
            }
            onClick={(e) => variant === 'clean' && e.stopPropagation()}
          >
            {/* Close Button */}
            {!options?.hideCloseButton && (
              <button
                onClick={closeModal}
                className={
                  variant === 'clean'
                    ? "fixed top-6 right-6 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm transition-all border border-white/10"
                    : "absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                }
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Content Area */}
            <div className={`flex-1 overflow-auto ${variant === 'clean' ? '' : (options?.className?.includes('p-0') ? '' : 'p-2 sm:p-6')}`}>
              {content}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
