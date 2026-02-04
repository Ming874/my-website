'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * ScrollToTop Component
 * Implements a "Back to Top" button with a circular progress ring.
 */
export default function ScrollToTop() {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const prevYRef = useRef(0);

    const strokeWidth = 4;
    const progressDeg = progress * 360;

    useEffect(() => {
        // Monitor Modal open status (based on common patterns or body overflow)
        const checkModalStatus = () => {
            // Check for modal-open class or if body has overflow hidden
            const hasModalOpen = document.body.classList.contains('modal-open') || 
                                document.body.style.overflow === 'hidden';
            setIsModalOpen(hasModalOpen);
        };

        const observer = new MutationObserver(checkModalStatus);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
        
        checkModalStatus();
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const p = docH > 0 ? y / docH : 0;
            setProgress(Math.max(0, Math.min(p, 1)));

            const dy = y - prevYRef.current;
            
            if (y < 150) {
                setVisible(false);
            } else if (window.innerWidth < 768) {
                // On mobile: show when scrolling up, hide when scrolling down significantly
                if (dy < -4) setVisible(true);
                else if (dy > 4 && y > 300) setVisible(false);
            } else {
                setVisible(true);
            }
            prevYRef.current = y;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const size = 56;
    const center = size / 2;
    const r = (size - strokeWidth) / 2;
    const angleRad = (progressDeg * Math.PI) / 180;
    
    const endX = center + r * Math.sin(angleRad);
    const endY = center - r * Math.cos(angleRad);

    const shouldShow = visible && !isModalOpen;

    return (
        <div
            className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ease-in-out ${
                shouldShow ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
            }`}
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            <div className="relative w-full h-full">
                {/* Background Ring */}
                <div 
                    className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800" 
                    style={{ zIndex: 0 }}
                />

                {/* Progress Ring (Gradient) */}
                <div 
                    className="absolute inset-0 rounded-full" 
                    style={{ 
                        zIndex: 1,
                        background: `conic-gradient(from 0deg at 50% 50%, #60a5fa 0%, #9333ea ${progressDeg}deg, transparent ${progressDeg}deg)`,
                        WebkitMaskImage: 'radial-gradient(transparent 58%, black 61%)',
                        maskImage: 'radial-gradient(transparent 58%, black 61%)',
                    }}
                />

                {/* Caps for the progress line */}
                <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none" 
                    style={{ zIndex: 2 }}
                >
                    {progress > 0 && (
                        <circle cx={center} cy={strokeWidth/2} r={strokeWidth/2} fill="#60a5fa" />
                    )}
                    {progress > 0 && ( progress < 0.99) && (
                        <circle 
                            cx={endX} 
                            cy={endY} 
                            r={strokeWidth/2} 
                            fill="#9333ea" 
                        />
                    )}
                </svg>

                {/* Central Button */}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Back to Top"
                    className="absolute inset-1 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-gray-700 dark:text-gray-300 group"
                    style={{ zIndex: 10 }}
                >
                    <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
            </div>
        </div>
    );
}
