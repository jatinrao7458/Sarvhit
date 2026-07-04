import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { fadeUp } from '../../hooks/useAnimations';
import SpotlightCard from './SpotlightCard';

export default function StatCard({ stat, index = 0, onClick }) {
    return (
        <SpotlightCard
            as={motion.div}
            className={`bg-bg-secondary border border-[var(--border-subtle)] rounded-xl p-6 flex flex-col gap-2 transition-all duration-150 hover:border-[var(--border-medium)] hover:-translate-y-0.5${onClick ? ' cursor-pointer' : ''}`}
            {...fadeUp(index)}
            onClick={onClick}
            whileHover={onClick ? { scale: 1.03, y: -3 } : undefined}
            whileTap={onClick ? { scale: 0.98 } : undefined}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-accent-soft text-accent flex items-center justify-center">
                    <stat.icon size={20} />
                </div>
                {stat.change && (
                    <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? 'text-success' : 'text-text-muted'}`}>
                        {stat.change}
                        <ArrowUpRight size={12} />
                    </span>
                )}
            </div>
            <span className="font-display text-2xl text-text-primary">{stat.value}</span>
            <span className="text-xs text-text-muted uppercase tracking-wide">{stat.label}</span>
        </SpotlightCard>
    );
}
