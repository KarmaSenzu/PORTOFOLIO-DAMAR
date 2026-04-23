import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { projectService } from '../../services/projects';
import { settingsService } from '../../services/settings';
import { uploadService } from '../../services/upload';
import { useAnalytics } from '../../hooks/useAnalytics';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import Button from '../../components/Button/Button';
import './Home.css';

const Home = () => {
    const { t } = useTranslation();
    const { onPageView } = useAnalytics();

    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [heroImages, setHeroImages] = useState([]);
    const [slideshowConfig, setSlideshowConfig] = useState({ interval: 5000, pauseOnHover: true, showDots: true });
    const [loading, setLoading] = useState(true);

    // Slideshow state
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        onPageView('home');
    }, [onPageView]);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [projectsRes, heroRes, configRes] = await Promise.all([
                    projectService.getAll({ featured: 'true' }),
                    settingsService.get('hero_images'),
                    settingsService.get('slideshow_config'),
                ]);
                setFeaturedProjects((projectsRes.data || projectsRes).slice(0, 3));

                const images = heroRes.value || heroRes.data || heroRes || [];
                setHeroImages(Array.isArray(images) ? images.map(img => uploadService.getImageUrl(img)) : []);

                const config = configRes.value || configRes.data || configRes || {};
                setSlideshowConfig(prev => ({ ...prev, ...config }));
            } catch (error) {
                console.error('Failed to fetch home data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Auto slideshow
    useEffect(() => {
        if (isPaused || heroImages.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, slideshowConfig.interval);

        return () => clearInterval(timer);
    }, [isPaused, heroImages.length, slideshowConfig.interval]);

    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
    }, []);

    if (loading) {
        return (
            <main className="home">
                <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div className="loading-spinner" />
                </div>
            </main>
        );
    }

    return (
        <main className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero__content">
                        <motion.div
                            className="hero__text"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="hero__badge">
                                <span className="hero__badge-dot" />
                                {t('hero.greeting')}
                            </span>

                            <h1 className="hero__title">
                                {t('hero.title')}{' '}
                                <span className="hero__name">{t('hero.name')}</span>.
                                <br />
                                {t('hero.tagline')}{' '}
                                <span className="hero__highlight">{t('hero.highlight')}</span>{' '}
                                {t('hero.ending')}
                            </h1>

                            <p className="hero__description">
                                {t('hero.description')}
                            </p>

                            <div className="hero__actions">
                                <Button href="#featured" size="lg">
                                    {t('hero.viewProjects')}
                                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                        <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
                                    </svg>
                                </Button>

                                <div className="hero__social">
                                    <a href="https://github.com/damar" target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="GitHub">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                    </a>
                                    <a href="https://linkedin.com/in/damar" target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="LinkedIn">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="hero__visual"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div
                                className="hero__slideshow"
                                onMouseEnter={() => slideshowConfig.pauseOnHover && setIsPaused(true)}
                                onMouseLeave={() => slideshowConfig.pauseOnHover && setIsPaused(false)}
                            >
                                <div className="hero__slideshow-container">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={currentSlide}
                                            src={heroImages[currentSlide]}
                                            alt={`Hero slide ${currentSlide + 1}`}
                                            className="hero__slideshow-image"
                                            initial={{ opacity: 0, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </AnimatePresence>
                                </div>

                                {/* Dot indicators */}
                                {slideshowConfig.showDots && heroImages.length > 1 && (
                                    <div className="hero__slideshow-dots">
                                        {heroImages.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`hero__slideshow-dot ${index === currentSlide ? 'hero__slideshow-dot--active' : ''}`}
                                                onClick={() => goToSlide(index)}
                                                aria-label={`Go to slide ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Work Section */}
            <section className="featured section" id="featured">
                <div className="container">
                    <motion.div
                        className="featured__header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
                            <h2 className="featured__title">{t('featured.title')}</h2>
                            <p className="featured__subtitle">{t('featured.subtitle')}</p>
                        </div>
                        <Link to="/projects" className="featured__view-all">
                            {t('featured.viewAll')} →
                        </Link>
                    </motion.div>

                    <div className="featured__grid">
                        {featuredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                                featured={index === 0}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta section">
                <div className="container container-sm">
                    <motion.div
                        className="cta__content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="cta__title">{t('cta.title')}</h2>
                        <p className="cta__description">{t('cta.description')}</p>
                        <div className="cta__actions">
                            <Button to="/about#contact" size="lg">
                                {t('cta.letsTalk')}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => {
                                    navigator.clipboard.writeText('damar@example.com');
                                    alert('Email copied!');
                                }}
                            >
                                {t('cta.copyEmail')}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default Home;
