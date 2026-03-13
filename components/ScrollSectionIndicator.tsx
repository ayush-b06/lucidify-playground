"use client"

import { useEffect, useRef, useState } from 'react';

const sectionLabels = [
    'Home',
    'Dashboard',
    'Our Work',
    'Process',
    'Stats',
    'Features',
    'Get Started',
];

const ScrollSectionIndicator = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Track overall scroll progress for the fill line
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Track active section with IntersectionObserver
        const sections = Array.from(document.querySelectorAll('section'));
        const observers = sections.map((section, i) => {
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveIdx(i);
                },
                { threshold: 0.4 }
            );
            obs.observe(section);
            return obs;
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observers.forEach(o => o.disconnect());
        };
    }, []);

    const scrollToSection = (i: number) => {
        const sections = document.querySelectorAll('section');
        sections[i]?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="fixed right-[20px] top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center">
            {/* Vertical track */}
            <div className="absolute w-[1px] bg-white/8 inset-y-0 left-1/2 -translate-x-1/2" />
            {/* Scroll progress fill */}
            <div
                ref={lineRef}
                className="absolute w-[1px] top-0 left-1/2 -translate-x-1/2 origin-top"
                style={{
                    height: `${scrollProgress}%`,
                    background: 'linear-gradient(to bottom, #5240C9, #725CF7)',
                    transition: 'height 0.1s linear',
                }}
            />

            {/* Dots */}
            {sectionLabels.map((label, i) => (
                <div
                    key={label}
                    className="relative flex items-center justify-center group cursor-pointer py-[10px]"
                    onClick={() => scrollToSection(i)}
                >
                    <div
                        className={`w-[5px] h-[5px] rounded-full transition-all duration-300 relative z-10 ${
                            i === activeIdx
                                ? 'SectionDotActive scale-125'
                                : i < activeIdx
                                ? 'bg-[#725CF7] opacity-50'
                                : 'bg-white/20'
                        }`}
                    />
                    {/* Label tooltip on hover */}
                    <span className="absolute right-[14px] text-[10px] font-light tracking-[1px] opacity-0 group-hover:opacity-50 whitespace-nowrap transition-opacity duration-200 pointer-events-none">
                        {label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ScrollSectionIndicator;
