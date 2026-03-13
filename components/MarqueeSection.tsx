const items = [
    'WEB DESIGN',
    'DEVELOPMENT',
    'BRANDING',
    'E-COMMERCE',
    'SEO',
    'HOSTING',
    'RESPONSIVE',
    'MODERN',
    'FAST',
    'SECURE',
];

const MarqueeSection = () => {
    const repeated = [...items, ...items];

    return (
        <div className="overflow-hidden border-y border-white/[0.05] py-[14px]">
            <div className="MarqueeTrack">
                {repeated.map((item, i) => (
                    <span key={i} className="flex items-center">
                        <span className="text-[11px] font-medium tracking-[3px] opacity-20 whitespace-nowrap px-[20px]">
                            {item}
                        </span>
                        <span className="text-[#725CF7] opacity-40 text-[14px]">·</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default MarqueeSection;
