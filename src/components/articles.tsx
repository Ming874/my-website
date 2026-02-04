"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Hash,
  Loader2,
  Menu,
  Maximize2,
  Minimize2,
  ExternalLink,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

export function Articles() {
  const t = useTranslations("Articles");

  const [activeKey, setActiveKey] = useState("git");
  const [isMobile, setIsMobile] = useState(false);

  // Mobile: Sidebar state (default open)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fullscreen state
  const [isMaximized, setIsMaximized] = useState(false);

  // Detect Mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Ensure sidebar is open on desktop by default
      if (!mobile) {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSelect = (key: string) => {
    setActiveKey(key);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const articles = [
    { key: "git", url: "https://hackmd.io/@mingchen/git", status: "published" },
    { key: "gcp", url: "https://hackmd.io/@mingchen/gcp", status: "published" },
    {
      key: "linux",
      url: "https://hackmd.io/@mingchen/linux",
      status: "published",
    },
    { key: "pqc", status: "wip" },
    { key: "cv", status: "wip" },
    { key: "docker", status: "wip" },
  ];

  const activeArticle = articles.find((a) => a.key === activeKey);

  return (
    <section
      id="articles"
      className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400"
        >
          {t("title")}
        </motion.h2>

        {/* Main Window Container */}
        <motion.div
          className={`
          relative bg-white dark:bg-gray-950 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row transition-all duration-300
          ${isMaximized ? "fixed inset-0 z-50 h-full rounded-none" : "max-w-7xl mx-auto min-h-[800px] h-[800px]"}
        `}
        >
          {/* Mobile: Toggle Button (Floating when sidebar closed) */}
          {isMobile && !isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-4 left-4 z-30 p-2 bg-gray-900/90 text-white rounded-lg shadow-lg backdrop-blur-sm hover:scale-105 transition-transform"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Sidebar (Control Panel) */}
          <motion.div
            initial={false}
            animate={{
              width: isSidebarOpen ? (isMobile ? "100%" : 280) : 0,
              opacity: isSidebarOpen ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
                ${isMobile ? "absolute inset-0 z-20" : "relative border-r shrink-0"} 
                bg-gray-50/95 dark:bg-gray-900/95 border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col backdrop-blur-md
            `}
          >
            <div className="p-4 flex flex-col h-full min-w-[280px]">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="text-xs font-mono text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>EXPLORER</span>
                </div>
                {/* Mobile Close Button */}
                {isMobile && (
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Article List */}
              <div className="space-y-1 overflow-y-auto flex-1">
                {articles.map((article) => (
                  <button
                    key={article.key}
                    onClick={() => handleSelect(article.key)}
                    className={`
                                        w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative
                                        ${
                                          activeKey === article.key
                                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                                        }
                                    `}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      {article.status === "wip" ? (
                        <Loader2
                          className={`w-4 h-4 ${activeKey === article.key ? "animate-spin" : ""}`}
                        />
                      ) : (
                        <Hash className="w-4 h-4 opacity-70" />
                      )}

                      <div className="flex-1">
                        <div className="truncate font-semibold">
                          {t(`items.${article.key}.title`)}
                        </div>
                        <div className="text-[10px] opacity-60 font-mono truncate">
                          {article.status === "wip"
                            ? ">> IN_PROGRESS"
                            : ">> READY"}
                        </div>
                      </div>
                    </div>

                    {/* Active Indicator Line */}
                    {activeKey === article.key && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Content: Viewport */}
          <div className="flex-1 min-w-0 bg-white dark:bg-black relative flex flex-col h-full z-10">
            {/* Toolbar */}
            <div className="h-12 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between bg-gray-50 dark:bg-gray-900 shrink-0">
              <div className="flex items-center gap-4 pl-12 lg:pl-0">
                {" "}
                {/* Padding for mobile menu button */}
                {/* Window Controls (Red/Yellow/Green) */}
                <div className="flex items-center gap-2 group">
                  <button
                    onClick={handleSidebarToggle}
                    className={`
                                        w-3 h-3 rounded-full border flex items-center justify-center transition-colors
                                        ${
                                          isSidebarOpen
                                            ? "bg-red-300/50 border-red-400/30 hover:bg-red-500 cursor-pointer"
                                            : "bg-green-400/80 border-green-500/50 hover:bg-green-500 cursor-pointer"
                                        }
                                    `}
                    title="Toggle Sidebar"
                  >
                    {isSidebarOpen ? (
                        <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
                    ) : (
                        <Menu className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" />
                    )}
                  </button>

                  <div className="w-3 h-3 rounded-full bg-yellow-400/80 border border-yellow-500/50" />

                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="w-3 h-3 rounded-full bg-green-400/80 border border-green-500/50 hover:bg-green-500 flex items-center justify-center transition-colors cursor-pointer"
                    title="Maximize"
                  >
                    {isMaximized ? (
                      <Minimize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" />
                    ) : (
                      <Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" />
                    )}
                  </button>
                </div>
                <div className="hidden sm:flex text-xs font-mono text-gray-500 dark:text-gray-400 items-center gap-2">
                  <span
                    className={
                      activeArticle?.status === "published"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }
                  >
                    ●
                  </span>
                  <span>{activeKey}.md</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* External Link Button (Fallback) */}
                {activeArticle?.status === "published" && (
                  <a
                    href={activeArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"
                    title="Open in New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {/* Maximize Button */}
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"
                  title={isMaximized ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isMaximized ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative w-full h-full bg-gray-100 dark:bg-gray-950 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full min-h-[600px]"
                >
                  {activeArticle?.status === "published" ? (
                    <div className="w-full h-full relative group bg-white">
                      <iframe
                        src={activeArticle.url}
                        className="w-full h-full border-0"
                        title={activeKey}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="w-24 h-24 mb-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center animate-pulse">
                        <Loader2 className="w-10 h-10 opacity-50 animate-spin" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                        {t(`items.${activeKey}.title`)}
                      </h3>
                      <p className="font-mono text-sm opacity-60 mb-8 max-w-md">
                        {t(`items.${activeKey}.desc`)}
                      </p>
                      <div className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded text-xs font-mono border border-gray-300 dark:border-gray-700">
                        {t("wipTitle")}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}