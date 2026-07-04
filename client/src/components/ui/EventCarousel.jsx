import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EVENTS = [
    { id: 1, title: 'Clean River Drive', location: 'Mumbai, Maharashtra', date: 'Jan 2026', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80' },
    { id: 2, title: 'Tree Plantation Rally', location: 'Pune, Maharashtra', date: 'Dec 2025', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80' },
    { id: 3, title: 'Food for All Campaign', location: 'Delhi, NCR', date: 'Nov 2025', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80' },
    { id: 4, title: 'Education Outreach', location: 'Jaipur, Rajasthan', date: 'Oct 2025', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80' },
    { id: 5, title: 'Health Check-up Camp', location: 'Bangalore, Karnataka', date: 'Sep 2025', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80' },
    { id: 6, title: 'Women Empowerment Workshop', location: 'Chennai, Tamil Nadu', date: 'Aug 2025', image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80' },
    { id: 7, title: 'Beach Cleanup Drive', location: 'Goa', date: 'Jul 2025', image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80' },
];

function getCardStyle(offset) {
    const absOffset = Math.abs(offset);
    const maxVisible = 2;

    if (absOffset > maxVisible) {
        return { opacity: 0, scale: 0.6, x: offset * 280, zIndex: 0, filter: 'grayscale(100%) brightness(0.5)' };
    }

    return {
        opacity: 1 - absOffset * 0.15,
        scale: 1 - absOffset * 0.15,
        x: offset * 300,
        zIndex: maxVisible - absOffset + 1,
        filter: absOffset === 0 ? 'grayscale(0%) brightness(1)' : `grayscale(100%) brightness(${0.7 - absOffset * 0.1})`,
    };
}

export default function EventCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const total = EVENTS.length;

    const goNext = useCallback(() => setActiveIndex((prev) => (prev + 1) % total), [total]);
    const goPrev = useCallback(() => setActiveIndex((prev) => (prev - 1 + total) % total), [total]);

    useEffect(() => {
        const timer = setInterval(goNext, 3500);
        return () => clearInterval(timer);
    }, [goNext]);

    const getOffset = (index) => {
        let diff = index - activeIndex;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        return diff;
    };

    return (
        <section className="py-16 px-6 pb-24 text-center overflow-hidden">
            <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                Our Journey So Far
            </motion.h2>
            <motion.p
                className="section-subtitle"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Relive the moments that made a difference. Here are some of our most impactful events.
            </motion.p>

            <div className="relative flex items-center justify-center h-[480px] mt-8 mx-auto max-w-[1400px] max-[900px]:h-[400px] max-[600px]:h-[350px]">
                <button
                    className="absolute top-1/2 -translate-y-1/2 left-[max(2vw,20px)] z-20 w-[52px] h-[52px] rounded-full border border-[color-mix(in_srgb,var(--border-medium)_50%,transparent)] bg-[color-mix(in_srgb,var(--color-bg-secondary)_70%,transparent)] backdrop-blur-[12px] text-text-primary flex items-center justify-center cursor-pointer transition-all duration-250 hover:bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] hover:border-accent hover:text-accent hover:scale-108 hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_20%,transparent)] max-[600px]:w-10 max-[600px]:h-10"
                    onClick={goPrev}
                    aria-label="Previous event"
                >
                    <ChevronLeft size={28} />
                </button>

                <div className="relative w-[340px] h-full max-[900px]:w-[280px] max-[600px]:w-[240px]">
                    {EVENTS.map((event, index) => {
                        const offset = getOffset(index);
                        const style = getCardStyle(offset);
                        const isActive = offset === 0;

                        return (
                            <motion.div
                                key={event.id}
                                className={`absolute w-[340px] h-[460px] rounded-xl overflow-hidden cursor-pointer origin-center will-change-[transform,opacity,filter] transition-shadow duration-300 max-[900px]:w-[280px] max-[900px]:h-[380px] max-[600px]:w-[240px] max-[600px]:h-[330px] ${isActive ? 'shadow-[0_16px_60px_rgba(0,0,0,0.45),0_0_0_2px_color-mix(in_srgb,var(--accent)_30%,transparent)]' : 'shadow-[0_8px_30px_rgba(0,0,0,0.3)]'}`}
                                animate={{ x: style.x, scale: style.scale, opacity: style.opacity, zIndex: style.zIndex, filter: style.filter }}
                                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                                onClick={() => setActiveIndex(index)}
                            >
                                <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 px-5 z-2 text-left">
                                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-2">{event.date}</span>
                                    <h3 className="text-xl font-bold text-white mb-1 leading-tight">{event.title}</h3>
                                    <span className="text-sm text-white/70">{event.location}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <button
                    className="absolute top-1/2 -translate-y-1/2 right-[max(2vw,20px)] z-20 w-[52px] h-[52px] rounded-full border border-[color-mix(in_srgb,var(--border-medium)_50%,transparent)] bg-[color-mix(in_srgb,var(--color-bg-secondary)_70%,transparent)] backdrop-blur-[12px] text-text-primary flex items-center justify-center cursor-pointer transition-all duration-250 hover:bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] hover:border-accent hover:text-accent hover:scale-108 hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_20%,transparent)] max-[600px]:w-10 max-[600px]:h-10"
                    onClick={goNext}
                    aria-label="Next event"
                >
                    <ChevronRight size={28} />
                </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
                {EVENTS.map((_, i) => (
                    <button
                        key={i}
                        className={`h-2 border-none p-0 cursor-pointer transition-all duration-300 ${i === activeIndex ? 'w-6 rounded bg-accent shadow-[0_0_10px_color-mix(in_srgb,var(--accent)_40%,transparent)]' : 'w-2 rounded-full bg-[color-mix(in_srgb,var(--color-text-muted)_40%,transparent)]'}`}
                        onClick={() => setActiveIndex(i)}
                        aria-label={`Go to event ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
