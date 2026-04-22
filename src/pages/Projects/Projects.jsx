import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { getProjects } from '../../data/projects';
import { useAnalytics } from '../../hooks/useAnalytics';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import FilterTabs from '../../components/FilterTabs/FilterTabs';
import './Projects.css';

const Projects = () => {
    const { t } = useTranslation();
    const { onPageView } = useAnalytics();

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(6);

    const projects = getProjects();

    useEffect(() => {
        onPageView('projects');
    }, [onPageView]);

    // Category filters
    const categoryFilters = [
        { value: 'all', label: t('projects.filters.all'), icon: '📦' },
        { value: 'web-app', label: t('projects.filters.webApps'), icon: '🌐' },
        { value: 'mobile', label: t('projects.filters.mobile'), icon: '📱' },
        { value: 'open-source', label: t('projects.filters.openSource'), icon: '💻' },
        { value: 'design', label: t('projects.filters.design'), icon: '🎨' },
    ];

    // Role filters
    const roleFilters = [
        { value: 'all', label: t('projects.roles.all') },
        { value: 'frontend', label: t('projects.roles.frontend') },
        { value: 'backend', label: t('projects.roles.backend') },
        { value: 'fullstack', label: t('projects.roles.fullstack') },
    ];

    // Filtered projects
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            // Search filter
            const searchLower = searchQuery.toLowerCase();
            const titleMatch = (project.title.en?.toLowerCase() || '').includes(searchLower) ||
                (project.title.id?.toLowerCase() || '').includes(searchLower);
            const descMatch = (project.description.en?.toLowerCase() || '').includes(searchLower) ||
                (project.description.id?.toLowerCase() || '').includes(searchLower);
            const techMatch = project.techStack?.some(tech =>
                tech.toLowerCase().includes(searchLower)
            );

            if (searchQuery && !titleMatch && !descMatch && !techMatch) {
                return false;
            }

            // Category filter
            if (categoryFilter !== 'all' && project.category !== categoryFilter) {
                return false;
            }

            // Role filter
            if (roleFilter !== 'all' && project.role !== roleFilter) {
                return false;
            }

            return true;
        });
    }, [projects, searchQuery, categoryFilter, roleFilter]);

    const visibleProjects = filteredProjects.slice(0, visibleCount);
    const hasMore = visibleCount < filteredProjects.length;

    const loadMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(6);
    }, [searchQuery, categoryFilter, roleFilter]);

    return (
        <main className="projects-page">
            <section className="section">
                <div className="container">
                    {/* Header */}
                    <motion.div
                        className="projects-page__header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="projects-page__title">{t('projects.pageTitle')}</h1>
                        <p className="projects-page__description">{t('projects.pageDescription')}</p>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        className="projects-page__filters"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {/* Search */}
                        <div className="projects-page__search">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                            <input
                                type="text"
                                placeholder={t('projects.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <FilterTabs
                            filters={categoryFilters}
                            activeFilter={categoryFilter}
                            onFilterChange={setCategoryFilter}
                        />
                    </motion.div>

                    {/* Role Filter */}
                    <motion.div
                        className="projects-page__role-filter"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
                        <span className="projects-page__role-label">Filter by role:</span>
                        <FilterTabs
                            filters={roleFilters}
                            activeFilter={roleFilter}
                            onFilterChange={setRoleFilter}
                            variant="role"
                        />
                    </motion.div>

                    {/* Projects Grid */}
                    <div className="projects-page__grid">
                        {visibleProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredProjects.length === 0 && (
                        <motion.div
                            className="projects-page__empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="projects-page__empty-icon">🔍</div>
                            <h3>No projects found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </motion.div>
                    )}

                    {/* Load More */}
                    {hasMore && (
                        <motion.div
                            className="projects-page__load-more"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <button className="btn btn--outline btn--lg" onClick={loadMore}>
                                {t('projects.loadMore')}
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Projects;
