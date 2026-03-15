"use client"

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

const features = [
    {
        num: '01',
        icon: '/Web Design Icon.png',
        title: 'Free premium web designs.',
        description: 'We offer free web designs until you\'re satisfied. Only then do we move onto development — no upfront cost.',
        statValue: 100,
        statSuffix: '%',
        statLabel: 'client design approval',
        accentColor: 'rgba(114,92,247,0.20)',
        accentInset: 'rgba(114,92,247,0.10)',
        bracketColor: 'rgba(114,92,247,0.7)',
    },
    {
        num: '02',
        icon: '/Web Hosting Icon.png',
        title: 'Free website hosting.',
        description: 'Reliable, secure, and fast hosting at no cost. We handle everything so you can focus on growing your business.',
        statValue: 99.9,
        statSuffix: '%',
        statLabel: 'uptime guarantee',
        accentColor: 'rgba(70,120,217,0.18)',
        accentInset: 'rgba(70,120,217,0.09)',
        bracketColor: 'rgba(70,120,217,0.7)',
    },
    {
        num: '03',
        icon: '/Dollar Icon.png',
        title: 'High quality, affordable prices.',
        description: 'Premium solutions that fit your budget — no hidden fees, no surprises.',
        statValue: 50,
        statSuffix: '%',
        statLabel: 'below market rate',
        accentColor: 'rgba(44,173,110,0.16)',
        accentInset: 'rgba(44,173,110,0.08)',
        bracketColor: 'rgba(44,173,110,0.7)',
    },
];

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const Brackets = ({ color, visible }: { color: string; visible: boolean }) => {
    const size = visible ? '18px' : '0px';
    const opacity = visible ? 1 : 0;
    const base: React.CSSProperties = {
        position: 'absolute',
        width: size,
        height: size,
        opacity,
        transition: 'width 0.25s ease, height 0.25s ease, opacity 0.25s ease',
        pointerEvents: 'none',
        zIndex: 20,
    };
    return (
        <>
            <div style={{ ...base, top: 12, left: 12, borderTop: `1.5px solid ${color}`, borderLeft: `1.5px solid ${color}`, borderRadius: '2px 0 0 0' }} />
            <div style={{ ...base, top: 12, right: 12, borderTop: `1.5px solid ${color}`, borderRight: `1.5px solid ${color}`, borderRadius: '0 2px 0 0' }} />
            <div style={{ ...base, bottom: 12, left: 12, borderBottom: `1.5px solid ${color}`, borderLeft: `1.5px solid ${color}`, borderRadius: '0 0 0 2px' }} />
            <div style={{ ...base, bottom: 12, right: 12, borderBottom: `1.5px solid ${color}`, borderRight: `1.5px solid ${color}`, borderRadius: '0 0 2px 0' }} />
        </>
    );
};

const FeaturesSection = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
    const statRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const hasAnimated = useRef<boolean[]>([false, false, false]);
    const sectionRef = useRef<HTMLDivElement>(null);

    const runCountUp = (i: number) => {
        if (hasAnimated.current[i]) return;
        hasAnimated.current[i] = true;
        const el = statRefs.current[i];
        if (!el) return;
        const { statValue, statSuffix } = features[i];
        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const val = easeOutCubic(p) * statValue;
            el.textContent = (statValue % 1 !== 0 ? val.toFixed(1) : Math.round(val).toString()) + statSuffix;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    features.forEach((_, i) => runCountUp(i));
                    obs.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
        const card = cardRefs.current[i];
        const glow = glowRefs.current[i];
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rx = ((e.clientY - cy) / (rect.height / 2)) * -7;
        const ry = ((e.clientX - cx) / (rect.width / 2)) * 7;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
        if (glow) {
            glow.style.left = `${e.clientX - rect.left}px`;
            glow.style.top = `${e.clientY - rect.top}px`;
            glow.style.opacity = '1';
        }
    };

    const handleMouseEnter = (i: number) => {
        setHoveredIndex(i);
        const card = cardRefs.current[i];
        if (card) {
            card.style.boxShadow = `inset 0 0 80px ${features[i].accentInset}, 0 24px 60px rgba(0,0,0,0.2)`;
            card.style.background = 'var(--color-bg-card-hover)';
        }
    };

    const handleMouseLeave = (i: number) => {
        setHoveredIndex(null);
        const card = cardRefs.current[i];
        const glow = glowRefs.current[i];
        if (card) {
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
            card.style.boxShadow = '';
            card.style.background = 'var(--color-bg-card)';
        }
        if (glow) glow.style.opacity = '0';
    };

    const cardBase: React.CSSProperties = {
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg-card)',
        transition: 'box-shadow 0.35s ease, background 0.35s ease, transform 0.18s ease',
    };

    return (
        <section className="items-center">
            <div ref={sectionRef} className="relative my-[150px] w-full max-w-[1080px] mx-auto px-[32px] sm:px-[48px]">

                <div className="mb-[44px]">
                    <span className="text-[10px] tracking-[4px] font-medium opacity-25">WHY LUCIDIFY</span>
                    <h1 className="HeadingFont mt-[10px]">
                        Why businesses choose <span className="TextGradient">Lucidify</span>.
                    </h1>
                </div>

                {/* ── Desktop bento (lg+) ── */}
                <div
                    className="hidden lg:grid gap-[14px]"
                    style={{ gridTemplateColumns: 'repeat(5, 1fr)', gridAutoRows: 'auto' }}
                >
                    {/* Card 01 — tall portrait, left 2 cols, 2 rows */}
                    <div
                        ref={el => { cardRefs.current[0] = el; }}
                        onMouseEnter={() => handleMouseEnter(0)}
                        onMouseMove={e => handleMouseMove(e, 0)}
                        onMouseLeave={() => handleMouseLeave(0)}
                        className="relative rounded-[24px] overflow-hidden flex flex-col justify-between p-[32px]"
                        style={{ ...cardBase, gridColumn: '1 / 3', gridRow: '1 / 3', minHeight: '460px' }}
                    >
                        <Brackets color={features[0].bracketColor} visible={hoveredIndex === 0} />
                        <div ref={el => { glowRefs.current[0] = el; }} className="absolute pointer-events-none rounded-full" style={{ width: '320px', height: '320px', background: `radial-gradient(circle, ${features[0].accentColor} 0%, transparent 65%)`, transform: 'translate(-50%,-50%)', opacity: 0, transition: 'opacity 0.3s ease' }} />

                        <div className="relative z-10 flex items-start justify-between">
                            <span className="text-[11px] font-bold TextGradient opacity-50">{features[0].num}</span>
                            <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div className="w-[24px] h-[24px] relative"><Image src={features[0].icon} alt={features[0].title} fill style={{ objectFit: 'contain' }} /></div>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col py-[16px]">
                            <span ref={el => { statRefs.current[0] = el; }} className="TextGradient font-bold leading-none" style={{ fontSize: 'clamp(72px, 9vw, 100px)' }}>
                                0{features[0].statSuffix}
                            </span>
                            <span className="text-[12px] font-light tracking-[0.5px] mt-[10px]" style={{ opacity: 0.3 }}>{features[0].statLabel}</span>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-[18px] font-semibold leading-snug mb-[10px]">{features[0].title}</h2>
                            <p className="text-[13px] font-light leading-relaxed" style={{ opacity: 0.4 }}>{features[0].description}</p>
                        </div>
                    </div>

                    {/* Card 02 — landscape, right 3 cols, row 1 */}
                    <div
                        ref={el => { cardRefs.current[1] = el; }}
                        onMouseEnter={() => handleMouseEnter(1)}
                        onMouseMove={e => handleMouseMove(e, 1)}
                        onMouseLeave={() => handleMouseLeave(1)}
                        className="relative rounded-[24px] overflow-hidden flex flex-col justify-between p-[28px]"
                        style={{ ...cardBase, gridColumn: '3 / 6', gridRow: '1 / 2', minHeight: '210px' }}
                    >
                        <Brackets color={features[1].bracketColor} visible={hoveredIndex === 1} />
                        <div ref={el => { glowRefs.current[1] = el; }} className="absolute pointer-events-none rounded-full" style={{ width: '260px', height: '260px', background: `radial-gradient(circle, ${features[1].accentColor} 0%, transparent 65%)`, transform: 'translate(-50%,-50%)', opacity: 0, transition: 'opacity 0.3s ease' }} />

                        <div className="relative z-10 flex items-center justify-between">
                            <span className="text-[11px] font-bold TextGradient opacity-50">{features[1].num}</span>
                            <div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div className="w-[20px] h-[20px] relative"><Image src={features[1].icon} alt={features[1].title} fill style={{ objectFit: 'contain' }} /></div>
                            </div>
                        </div>

                        <div className="relative z-10 flex items-end justify-between gap-[20px] mt-[12px]">
                            <div className="flex-shrink-0">
                                <span ref={el => { statRefs.current[1] = el; }} className="TextGradient font-bold leading-none" style={{ fontSize: 'clamp(48px, 5vw, 60px)' }}>
                                    0{features[1].statSuffix}
                                </span>
                                <p className="text-[11px] font-light tracking-[0.5px] mt-[6px]" style={{ opacity: 0.3 }}>{features[1].statLabel}</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-[15px] font-semibold leading-snug">{features[1].title}</h2>
                                <p className="text-[12px] font-light mt-[6px] leading-relaxed" style={{ opacity: 0.35 }}>{features[1].description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 03 — landscape, right 3 cols, row 2 — slightly taller */}
                    <div
                        ref={el => { cardRefs.current[2] = el; }}
                        onMouseEnter={() => handleMouseEnter(2)}
                        onMouseMove={e => handleMouseMove(e, 2)}
                        onMouseLeave={() => handleMouseLeave(2)}
                        className="relative rounded-[24px] overflow-hidden flex flex-col justify-between p-[28px]"
                        style={{ ...cardBase, gridColumn: '3 / 6', gridRow: '2 / 3', minHeight: '240px' }}
                    >
                        <Brackets color={features[2].bracketColor} visible={hoveredIndex === 2} />
                        <div ref={el => { glowRefs.current[2] = el; }} className="absolute pointer-events-none rounded-full" style={{ width: '260px', height: '260px', background: `radial-gradient(circle, ${features[2].accentColor} 0%, transparent 65%)`, transform: 'translate(-50%,-50%)', opacity: 0, transition: 'opacity 0.3s ease' }} />

                        <div className="relative z-10 flex items-center justify-between">
                            <span className="text-[11px] font-bold TextGradient opacity-50">{features[2].num}</span>
                            <div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div className="w-[20px] h-[20px] relative"><Image src={features[2].icon} alt={features[2].title} fill style={{ objectFit: 'contain' }} /></div>
                            </div>
                        </div>

                        <div className="relative z-10 flex items-end justify-between gap-[20px] mt-[12px]">
                            <div className="flex-shrink-0">
                                <span ref={el => { statRefs.current[2] = el; }} className="TextGradient font-bold leading-none" style={{ fontSize: 'clamp(48px, 5vw, 60px)' }}>
                                    0{features[2].statSuffix}
                                </span>
                                <p className="text-[11px] font-light tracking-[0.5px] mt-[6px]" style={{ opacity: 0.3 }}>{features[2].statLabel}</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-[15px] font-semibold leading-snug">{features[2].title}</h2>
                                <p className="text-[12px] font-light mt-[6px] leading-relaxed" style={{ opacity: 0.35 }}>{features[2].description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Mobile stack ── */}
                <div className="flex flex-col gap-[14px] lg:hidden">
                    {features.map((f) => (
                        <div
                            key={f.num}
                            className="relative rounded-[20px] overflow-hidden flex flex-col justify-between p-[24px]"
                            style={{ ...cardBase, minHeight: '180px' }}
                        >
                            <div className="flex items-center justify-between mb-[16px]">
                                <span className="text-[11px] font-bold TextGradient opacity-50">{f.num}</span>
                                <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    <div className="w-[18px] h-[18px] relative"><Image src={f.icon} alt={f.title} fill style={{ objectFit: 'contain' }} /></div>
                                </div>
                            </div>
                            <div>
                                <span className="TextGradient font-bold leading-none" style={{ fontSize: '52px' }}>{f.statValue}{f.statSuffix}</span>
                                <p className="text-[11px] font-light mt-[4px]" style={{ opacity: 0.3 }}>{f.statLabel}</p>
                            </div>
                            <div className="mt-[16px]">
                                <h2 className="text-[15px] font-semibold leading-snug mb-[6px]">{f.title}</h2>
                                <p className="text-[12px] font-light leading-relaxed" style={{ opacity: 0.4 }}>{f.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-[12px] font-light mt-[20px]" style={{ opacity: 0.15 }}>
                    We don&apos;t just build websites, we build relationships.
                </p>
            </div>
        </section>
    );
};

export default FeaturesSection;
