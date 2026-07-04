const IMPACTS = [
    '🐕 1,000+ Stray Dogs Fed',
    '📚 100+ Children Educated',
    '🌳 5,000+ Trees Planted',
    '🍲 10,000+ Meals Served',
    '🏥 200+ Health Camps Organized',
    '👩‍🏫 50+ Skill Workshops Held',
    '🏠 300+ Families Sheltered',
    '💧 80+ Clean Water Projects',
    '♻️ 2 Tons Waste Recycled',
    '🎓 150+ Scholarships Given',
];

export default function ImpactMarquee() {
    // Duplicate items for seamless loop
    const items = [...IMPACTS, ...IMPACTS];

    return (
        <div className="w-full overflow-hidden py-4 relative [mask-image:linear-gradient(90deg,transparent_0%,#000_8%,#000_92%,transparent_100%)]">
            <div className="flex gap-3 w-max animate-marquee-scroll">
                {items.map((text, i) => (
                    <span
                        key={i}
                        className="shrink-0 py-2 px-5 bg-white/6 border border-white/10 rounded-full text-sm text-text-secondary whitespace-nowrap tracking-tight backdrop-blur-[8px] transition-all duration-150 ease-[var(--ease-out-custom)] hover:bg-white/12 hover:text-text-primary"
                    >
                        {text}
                    </span>
                ))}
            </div>
        </div>
    );
}
