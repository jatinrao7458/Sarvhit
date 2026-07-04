export default function FilterTag({ label, active = false, onClick }) {
    return (
        <button
            className={`py-2 px-4 rounded-full border text-xs font-medium cursor-pointer transition-all duration-150
                ${active
                    ? 'bg-accent-soft border-accent text-accent'
                    : 'bg-transparent border-[var(--border-subtle)] text-text-secondary hover:bg-bg-tertiary hover:border-[var(--border-medium)]'
                }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}
