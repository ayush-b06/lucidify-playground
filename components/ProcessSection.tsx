"use client"

import React, { useEffect, useRef } from 'react'

const steps = [
    { num: '01', title: 'PLAN',    desc: 'We get your vision and map out the plan.' },
    { num: '02', title: 'DESIGN',  desc: 'We design a stunning site that fits your brand.' },
    { num: '03', title: 'DEVELOP', desc: 'We build your site with precision, ensuring speed, functionality, and responsiveness.' },
    { num: '04', title: 'LAUNCH',  desc: "We launch your website for free. It's that simple." },
];

const CARD_H = 110;
const CARD_GAP = 20;
const STEP = CARD_H + CARD_GAP;
const INIT_STAGGER = 10; // px of initial "peek" per card

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const ProcessSection = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const numRefs = useRef<(HTMLDivElement | null)[]>([]);
    const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
    const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const activeRef = useRef(-1);

    useEffect(() => {
        const onScroll = () => {
            const el = wrapperRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const scrollable = el.offsetHeight - window.innerHeight;
            if (scrollable <= 0) return;
            const p = Math.max(0, Math.min(1, -rect.top / scrollable));

            // progress bar
            if (progressBarRef.current)
                progressBarRef.current.style.width = `${p * 100}%`;

            // fan cards out from initial stagger to final spread
            cardRefs.current.forEach((card, i) => {
                if (!card || i === 0) return;
                const phaseStart = (i - 1) / (steps.length - 1);
                const phaseEnd   =  i      / (steps.length - 1);
                const sp = Math.max(0, Math.min(1, (p - phaseStart) / (phaseEnd - phaseStart)));
                const e = easeOutCubic(sp);
                const y = i * INIT_STAGGER + (i * STEP - i * INIT_STAGGER) * e;
                const opacity = (1 - i * 0.2) + i * 0.2 * e;
                card.style.transform = `translateY(${y}px)`;
                card.style.opacity = String(opacity);
            });

            // active step (0-indexed)
            const next = Math.min(steps.length - 1, Math.floor(p * steps.length));
            if (next === activeRef.current) return;
            activeRef.current = next;

            // animate left-side number
            numRefs.current.forEach((el, i) => {
                if (!el) return;
                const active = i === next;
                el.style.opacity = active ? '1' : '0';
                el.style.transform = `translateY(${active ? 0 : i < next ? -24 : 20}px)`;
            });
            // animate left-side title
            titleRefs.current.forEach((el, i) => {
                if (!el) return;
                const active = i === next;
                el.style.opacity = active ? '1' : '0';
                el.style.transform = `translateY(${active ? 0 : 12}px)`;
            });
            // expand active dot to pill
            dotRefs.current.forEach((el, i) => {
                if (!el) return;
                const done = i <= next;
                el.style.width = done ? '20px' : '5px';
                el.style.background = done
                    ? 'linear-gradient(to right, #5240C9, #725CF7)'
                    : 'rgba(255,255,255,0.15)';
            });
            // highlight active card border
            cardRefs.current.forEach((el, i) => {
                if (!el) return;
                const active = i === next;
                el.style.borderColor = active ? 'rgba(114,92,247,0.45)' : 'rgba(255,255,255,0.05)';
                el.style.boxShadow   = active ? '0 0 0 1px rgba(114,92,247,0.12), 0 10px 40px rgba(114,92,247,0.14)' : '';
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <section className="items-center">
            {/* Tall scroll driver — sticky content lives inside */}
            <div
                ref={wrapperRef}
                className="relative mt-[150px]"
                style={{ minHeight: '290vh' }}
            >
                {/* Sticky frame */}
                <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden UpsideDownBackgroundGradient">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full max-w-[1080px] mx-auto px-[32px] sm:px-[48px] gap-[48px] lg:gap-[80px]">

                        {/* ── LEFT: scroll-driven counter ── */}
                        <div className="flex flex-col flex-shrink-0 w-full lg:w-[260px]">
                            <span className="text-[10px] tracking-[4px] font-medium opacity-25 mb-[24px]">
                                OUR PROCESS
                            </span>

                            {/* Animated big number */}
                            <div className="relative overflow-hidden mb-[6px]" style={{ height: 80 }}>
                                {steps.map((step, i) => (
                                    <div
                                        key={step.num}
                                        ref={el => { numRefs.current[i] = el; }}
                                        className="absolute inset-0 flex items-center"
                                        style={{
                                            opacity: i === 0 ? 1 : 0,
                                            transform: `translateY(${i === 0 ? 0 : 20}px)`,
                                            transition: 'opacity 0.4s cubic-bezier(0.25,1,0.5,1), transform 0.4s cubic-bezier(0.25,1,0.5,1)',
                                        }}
                                    >
                                        <span className="text-[68px] font-bold leading-none TextGradient">{step.num}</span>
                                        <span className="text-[12px] opacity-20 font-light ml-[8px] self-end mb-[8px]">
                                            /{String(steps.length).padStart(2, '0')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Animated step title */}
                            <div className="relative overflow-hidden mb-[22px]" style={{ height: 34 }}>
                                {steps.map((step, i) => (
                                    <div
                                        key={step.title}
                                        ref={el => { titleRefs.current[i] = el; }}
                                        className="absolute"
                                        style={{
                                            opacity: i === 0 ? 1 : 0,
                                            transform: `translateY(${i === 0 ? 0 : 12}px)`,
                                            transition: 'opacity 0.35s cubic-bezier(0.25,1,0.5,1), transform 0.35s cubic-bezier(0.25,1,0.5,1)',
                                        }}
                                    >
                                        <span className="text-[20px] font-semibold">{step.title}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Scroll progress bar */}
                            <div className="w-full h-[1.5px] bg-white/10 rounded-full mb-[14px]">
                                <div
                                    ref={progressBarRef}
                                    className="h-full rounded-full"
                                    style={{
                                        width: '0%',
                                        background: 'linear-gradient(to right, #5240C9, #998BF9)',
                                        transition: 'width 0.1s linear',
                                    }}
                                />
                            </div>

                            {/* Dot / pill indicators */}
                            <div className="flex gap-[6px] items-center mb-[20px]">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        ref={el => { dotRefs.current[i] = el; }}
                                        className="h-[4px] rounded-full"
                                        style={{
                                            width: i === 0 ? '20px' : '5px',
                                            background: i === 0
                                                ? 'linear-gradient(to right, #5240C9, #725CF7)'
                                                : 'rgba(255,255,255,0.15)',
                                            transition: 'width 0.35s cubic-bezier(0.25,1,0.5,1), background 0.35s ease',
                                        }}
                                    />
                                ))}
                            </div>

                            <p className="text-[12px] font-light tracking-[0.5px]" style={{ opacity: 0.2 }}>
                                It&apos;s that simple.
                            </p>
                        </div>

                        {/* ── RIGHT: stacked cards that fan out ── */}
                        <div
                            className="relative flex-1 w-full max-w-[520px] hidden lg:block"
                            style={{ height: `${(steps.length - 1) * STEP + CARD_H}px` }}
                        >
                            {steps.map((step, i) => (
                                <div
                                    key={step.num}
                                    ref={el => { cardRefs.current[i] = el; }}
                                    className="absolute w-full BlackGradient ContentCardShadow rounded-[18px] px-[28px] py-[24px] flex items-center gap-[20px] border"
                                    style={{
                                        top: 0,
                                        height: CARD_H,
                                        transform: `translateY(${i * INIT_STAGGER}px)`,
                                        zIndex: steps.length - i,
                                        opacity: 1 - i * 0.2,
                                        borderColor: i === 0 ? 'rgba(114,92,247,0.45)' : 'rgba(255,255,255,0.05)',
                                        boxShadow: i === 0 ? '0 0 0 1px rgba(114,92,247,0.12), 0 10px 40px rgba(114,92,247,0.14)' : '',
                                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                    }}
                                >
                                    <span className="text-[26px] font-bold TextGradient flex-shrink-0 w-[48px]">
                                        {step.num}
                                    </span>
                                    <div className="w-[1px] h-[44px] flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
                                    <div>
                                        <h2 className="text-[16px] font-semibold mb-[4px]">{step.title}</h2>
                                        <p className="text-[12.5px] font-light leading-relaxed" style={{ opacity: 0.45 }}>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile: simple list */}
                        <div className="lg:hidden flex flex-col gap-[12px] w-full">
                            {steps.map((step) => (
                                <div key={step.num} className="BlackGradient ContentCardShadow rounded-[16px] px-[22px] py-[18px] flex items-center gap-[16px] border border-white/[0.05]">
                                    <span className="text-[22px] font-bold TextGradient flex-shrink-0">{step.num}</span>
                                    <div className="w-[1px] h-[40px] flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
                                    <div>
                                        <h2 className="text-[15px] font-semibold mb-[2px]">{step.title}</h2>
                                        <p className="text-[12px] font-light" style={{ opacity: 0.4 }}>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
