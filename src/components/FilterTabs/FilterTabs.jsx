import { motion } from 'framer-motion';
import './FilterTabs.css';

const FilterTabs = ({ filters, activeFilter, onFilterChange, variant = 'default' }) => {
    return (
        <div className={`filter-tabs filter-tabs--${variant}`}>
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    className={`filter-tabs__btn ${activeFilter === filter.value ? 'filter-tabs__btn--active' : ''}`}
                    onClick={() => onFilterChange(filter.value)}
                >
                    {filter.icon && <span className="filter-tabs__icon">{filter.icon}</span>}
                    {filter.label}
                    {activeFilter === filter.value && (
                        <motion.div
                            className="filter-tabs__indicator"
                            layoutId="activeFilter"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
};

export default FilterTabs;
