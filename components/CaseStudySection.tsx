"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useRef, useState, useCallback } from 'react'

const projects = [
    {
        num: '01',
        name: 'VENSAR',
        year: '2024',
        tags: ['Web Design', 'Development', 'Branding'],
        description: 'In just 2 weeks, we created a modern, responsive website that boosted conversion rates by 30% and increased user engagement by 25%.',
        stats: [{ value: '+30%', label: 'Conversion Rate' }, { value: '+25%', label: 'User Engagement' }, { value: '2wk', label: 'Turnaround' }],
        previewImage: '/VENSAR Homepage.png',
        href: 'https://vensar.vercel.app/',
    },
    {
        num: '02',
        name: 'BGINTL',
        year: '2024',
        tags: ['Web Design', 'Development', 'Portfolio'],
        description: 'We revamped BGINTL\'s portfolio site, attracting higher-quality leads and driving a 30% increase in client inquiries within two months.',
        stats: [{ value: '+30%', label: 'Client Inquiries' }, { value: '2mo', label: 'Time to Results' }, { value: '100%', label: 'Satisfaction' }],
        previewImage: '/BGINTL Homepage.png',
        href: 'https://bgintl.vercel.app/',
    },
];

const CaseStudySection = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const previewRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!listRef.current) return;
        const rect = listRef.current.getBoundingClientRect();
        mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            if (!previewRef.current) return;
            previewRef.current.style.left = `${mousePos.current.x + 36}px`;
            previewRef.current.style.top  = `${mousePos.current.y - 110}px`;
        });
    }, []);

    const handleRowMouseMove = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
        // 3D tilt on the preview card
        if (!previewRef.current || hoveredIndex !== i) return;
        const rect = previewRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rx = ((e.clientY - cy) / (rect.height / 2)) * -5;
        const ry = ((e.clientX - cx) / (rect.width / 2)) * 5;
        previewRef.current.style.transform = `translate(0, 0) perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    const handleRowLeave = () => {
        setHoveredIndex(null);
        if (previewRef.current) {
            previewRef.current.style.transform = 'translate(0, 0) perspective(600px) rotateX(0deg) rotateY(0deg)';
        }
    };

    return (
        <section className="items-center">
            <div className="mx-auto mt-[120px] max-w-[1080px] px-[32px] sm:px-[48px]">

                {/* Header */}
                <div className="flex items-end justify-between mb-[16px]">
                    <div>
                        <span className="text-[10px] tracking-[4px] font-medium opacity-25">OUR WORK</span>
                        <h1 className="HeadingFont mt-[10px]">Our work.</h1>
                    </div>
                    <Link
                        href="/creations"
                        className="hidden sm:flex items-center gap-[8px] text-[11px] tracking-[2px] font-medium"
                        style={{ opacity: 0.3, transition: 'opacity 0.25s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '0.3')}
                    >
                        VIEW ALL
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>

                {/* Sub-heading */}
                <p className="text-[14px] font-light mb-[56px]" style={{ opacity: 0.35 }}>
                    Every business is different — we put time and quality into every project.
                </p>

                {/* Project list */}
                <div
                    ref={listRef}
                    className="relative"
                    onMouseMove={onMouseMove}
                >
                    {/* Floating cursor-following image preview */}
                    <div
                        ref={previewRef}
                        className="absolute pointer-events-none z-50 rounded-[18px] overflow-hidden"
                        style={{
                            width: '300px',
                            height: '190px',
                            opacity: hoveredIndex !== null ? 1 : 0,
                            transition: 'opacity 0.25s ease',
                            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
                        }}
                    >
                        {hoveredIndex !== null && (
                            <Image
                                src={projects[hoveredIndex].previewImage}
                                alt={projects[hoveredIndex].name}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        )}
                    </div>

                    {projects.map((p, i) => {
                        const isHovered = hoveredIndex === i;
                        return (
                            <div key={p.num}>
                                {/* Top divider */}
                                <div style={{ height: '1px', background: 'var(--color-border-mid)' }} />

                                <Link href={p.href} target="_blank">
                                    <div
                                        className="relative py-[32px] sm:py-[40px]"
                                        onMouseEnter={() => setHoveredIndex(i)}
                                        onMouseLeave={handleRowLeave}
                                        onMouseMove={(e) => handleRowMouseMove(e, i)}
                                        style={{ cursor: 'none' }}
                                    >
                                        {/* Row hover background glow */}
                                        <div
                                            className="absolute inset-0 pointer-events-none rounded-[12px]"
                                            style={{
                                                background: isHovered
                                                    ? 'linear-gradient(to right, rgba(114,92,247,0.05) 0%, transparent 70%)'
                                                    : 'transparent',
                                                transition: 'background 0.4s ease',
                                            }}
                                        />

                                        {/* Main row */}
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-[20px] sm:gap-[32px]">
                                                <span
                                                    className="text-[12px] font-light flex-shrink-0"
                                                    style={{
                                                        opacity: isHovered ? 0.5 : 0.2,
                                                        transition: 'opacity 0.3s ease',
                                                    }}
                                                >
                                                    {p.num}
                                                </span>
                                                <div className="relative" style={{ display: 'inline-block' }}>
                                                    <h2
                                                        className="font-bold leading-none"
                                                        style={{
                                                            fontSize: 'clamp(36px, 6vw, 72px)',
                                                            letterSpacing: '-2px',
                                                            color: 'var(--color-text)',
                                                            opacity: isHovered ? 0 : 1,
                                                            transition: 'opacity 0.35s ease',
                                                        }}
                                                    >
                                                        {p.name}
                                                    </h2>
                                                    <h2
                                                        className="font-bold leading-none TextGradient absolute top-0 left-0"
                                                        style={{
                                                            fontSize: 'clamp(36px, 6vw, 72px)',
                                                            letterSpacing: '-2px',
                                                            opacity: isHovered ? 1 : 0,
                                                            transition: 'opacity 0.35s ease',
                                                        }}
                                                    >
                                                        {p.name}
                                                    </h2>
                                                </div>
                                            </div>

                                            {/* Right: year + arrow */}
                                            <div className="flex items-center gap-[20px] flex-shrink-0">
                                                <span
                                                    className="text-[13px] font-light hidden sm:block"
                                                    style={{ opacity: 0.3 }}
                                                >
                                                    {p.year}
                                                </span>
                                                <div
                                                    className="w-[42px] h-[42px] rounded-full flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        border: isHovered ? '1px solid rgba(114,92,247,0.6)' : '1px solid rgba(255,255,255,0.15)',
                                                        background: isHovered ? 'rgba(114,92,247,0.15)' : 'transparent',
                                                        transition: 'border-color 0.3s ease, background 0.3s ease, transform 0.3s ease',
                                                        transform: isHovered ? 'rotate(-45deg)' : 'rotate(0deg)',
                                                    }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex gap-[8px] mt-[14px] ml-[32px] sm:ml-[52px] flex-wrap relative z-10">
                                            {p.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] tracking-[1.5px] px-[10px] py-[4px] rounded-full"
                                                    style={{
                                                        background: 'rgba(255,255,255,0.06)',
                                                        opacity: isHovered ? 0.8 : 0.45,
                                                        transition: 'opacity 0.3s ease',
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Expandable: description + stats */}
                                        <div
                                            className="overflow-hidden relative z-10"
                                            style={{
                                                maxHeight: isHovered ? '200px' : '0px',
                                                opacity: isHovered ? 1 : 0,
                                                transition: 'max-height 0.5s cubic-bezier(0.25,1,0.5,1), opacity 0.35s ease',
                                            }}
                                        >
                                            <div className="ml-[32px] sm:ml-[52px] mt-[20px] flex flex-col sm:flex-row sm:items-end justify-between gap-[20px]">
                                                <p className="text-[13px] font-light leading-relaxed max-w-[420px]" style={{ opacity: 0.5 }}>
                                                    {p.description}
                                                </p>
                                                <div className="flex gap-[24px] flex-shrink-0">
                                                    {p.stats.map(s => (
                                                        <div key={s.label} className="flex flex-col items-center">
                                                            <span className="text-[20px] font-bold TextGradient leading-none">{s.value}</span>
                                                            <span className="text-[9px] tracking-[1px] font-light mt-[4px]" style={{ opacity: 0.35 }}>{s.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}

                    {/* Bottom divider */}
                    <div style={{ height: '1px', background: 'var(--color-border-mid)' }} />
                </div>

                {/* Mobile view all */}
                <Link href="/creations" className="flex items-center mt-[32px] sm:hidden ViewAllWorkHover">
                    <div className="ViewAllWorkCircle rounded-full border-[1px] shadow-inner shadow-gray-700 border-solid border-white w-[10px] h-[10px] opacity-60" />
                    <div className="-ml-[5px] w-[30px] mr-[10px] ViewAllWorkArrow">
                        <Image src="/Left White Arrow.png" alt="Left Arrow" layout="responsive" width={0} height={0} />
                    </div>
                    <h3 className="text-[18px] tracking-[1px] ViewAllWorkText">VIEW ALL WORK</h3>
                </Link>
            </div>
        </section>
    );
};

export default CaseStudySection;
