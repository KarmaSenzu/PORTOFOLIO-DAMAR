import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { projectService } from '../../services/projects';
import { uploadService } from '../../services/upload';
import { getLocalizedText } from '../../utils/helpers';
import { useAnalytics } from '../../hooks/useAnalytics';
import { CaseStudyTimeline } from '../../components/Timeline/Timeline';
import Lightbox from '../../components/Lightbox/Lightbox';
import Button from '../../components/Button/Button';
import './ProjectDetail.css';

const ProjectDetail = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const { onPageView, onDemoClick, onRepoClick } = useAnalytics();
    const language = i18n.language;

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState(0);
    const [project, setProject] = useState(null);
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [projectRes, allRes] = await Promise.all([
                    projectService.getBySlug(id),
                    projectService.getAll(),
                ]);
                const proj = projectRes.data || projectRes;
                setProject(proj);
                setAllProjects(allRes.data || allRes);
            } catch (error) {
                console.error('Failed to fetch project:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const currentIndex = useMemo(() => allProjects.findIndex(p => p.id === id || p.slug === id), [allProjects, id]);
    const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
    const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

    useEffect(() => {
        if (project) {
            onPageView(`project-${id}`);
        }
    }, [id, project, onPageView]);

    useEffect(() => {
        window.scrollTo(0, 0);
        setCurrentImageIndex(0);
    }, [id]);

    if (loading) {
        return (
            <div className="project-detail" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-detail__not-found">
                <h1>Project not found</h1>
                <Button to="/projects">Back to Projects</Button>
            </div>
        );
    }

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const rawImages = project.images || [project.image];
    const projectImages = rawImages.map(img => uploadService.getImageUrl(img));

    const handleNextImage = () => {
        if (currentImageIndex < projectImages.length - 1) {
            setSlideDirection(1);
            setCurrentImageIndex(prev => prev + 1);
        }
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setSlideDirection(-1);
            setCurrentImageIndex(prev => prev - 1);
        }
    };

    const handleThumbnailClick = (index) => {
        setSlideDirection(index > currentImageIndex ? 1 : -1);
        setCurrentImageIndex(index);
    };

    const handleDragEnd = (event, info) => {
        const threshold = 50;
        if (info.offset.x > threshold && currentImageIndex > 0) {
            handlePrevImage();
        } else if (info.offset.x < -threshold && currentImageIndex < projectImages.length - 1) {
            handleNextImage();
        }
    };

    const imageVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95
        })
    };

    // Build case study steps
    const caseStudySteps = project.caseStudy ? [
        {
            type: 'problem',
            title: t('projectDetail.problem'),
            content: project.caseStudy.problem
        },
        {
            type: 'solution',
            title: t('projectDetail.solution'),
            content: project.caseStudy.solution
        },
        {
            type: 'result',
            title: t('projectDetail.result'),
            content: project.caseStudy.result
        }
    ] : [];

    return (
        <main className="project-detail">
            <div className="container">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link to="/projects" className="project-detail__back">
                        ← {t('projectDetail.backToProjects')}
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.header
                    className="project-detail__header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="project-detail__title">
                        {getLocalizedText(project.title, language)}
                    </h1>
                    <p className="project-detail__tagline">
                        {getLocalizedText(project.description, language)}
                    </p>
                </motion.header>

                {/* Main Image Gallery */}
                <motion.div
                    className="project-detail__gallery"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="project-detail__carousel">
                        <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                            <motion.div
                                key={currentImageIndex}
                                className="project-detail__main-image"
                                onClick={() => openLightbox(currentImageIndex)}
                                custom={slideDirection}
                                variants={imageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={handleDragEnd}
                            >
                                <img
                                    src={projectImages[currentImageIndex]}
                                    alt={`${getLocalizedText(project.title, language)} - Image ${currentImageIndex + 1}`}
                                    draggable="false"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {projectImages.length > 1 && (
                            <>
                                <button
                                    className="project-detail__carousel-nav project-detail__carousel-nav--prev"
                                    onClick={handlePrevImage}
                                    disabled={currentImageIndex === 0}
                                    aria-label="Previous image"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    className="project-detail__carousel-nav project-detail__carousel-nav--next"
                                    onClick={handleNextImage}
                                    disabled={currentImageIndex === projectImages.length - 1}
                                    aria-label="Next image"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Dot Indicators */}
                    {projectImages.length > 1 && (
                        <div className="project-detail__indicators">
                            {projectImages.map((_, index) => (
                                <button
                                    key={index}
                                    className={`project-detail__indicator ${index === currentImageIndex ? 'project-detail__indicator--active' : ''}`}
                                    onClick={() => handleThumbnailClick(index)}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Thumbnails */}
                    {projectImages.length > 1 && (
                        <div className="project-detail__thumbnails">
                            {projectImages.map((img, index) => (
                                <motion.button
                                    key={index}
                                    className={`project-detail__thumb ${index === currentImageIndex ? 'project-detail__thumb--active' : ''}`}
                                    onClick={() => handleThumbnailClick(index)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                                </motion.button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Content Layout */}
                <div className="project-detail__layout">
                    {/* Main Content */}
                    <motion.div
                        className="project-detail__content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* About */}
                        <section className="project-detail__section">
                            <h2>
                                <span className="project-detail__section-icon">ℹ️</span>
                                {t('projectDetail.about')}
                            </h2>
                            <div className="project-detail__text">
                                {getLocalizedText(project.about, language)?.split('\n\n').map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* Case Study Timeline */}
                        {caseStudySteps.length > 0 && (
                            <section className="project-detail__section">
                                <h2>
                                    <span className="project-detail__section-icon">📊</span>
                                    {t('projectDetail.caseStudy')}
                                </h2>
                                <CaseStudyTimeline steps={caseStudySteps} />
                            </section>
                        )}

                        {/* Challenges */}
                        {project.challenges?.length > 0 && (
                            <section className="project-detail__section">
                                <h2>
                                    <span className="project-detail__section-icon">⚡</span>
                                    {t('projectDetail.challenges')}
                                </h2>
                                {project.challenges.map((challenge, index) => (
                                    <div key={index} className="project-detail__challenge">
                                        <h4>{getLocalizedText(challenge.title, language)}</h4>
                                        <p>{getLocalizedText(challenge.description, language)}</p>
                                        <div className="project-detail__challenge-solution">
                                            <strong>{t('projectDetail.theSolution')}</strong>
                                            <p>{getLocalizedText(challenge.solution, language)}</p>
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Key Features */}
                        {project.features?.length > 0 && (
                            <section className="project-detail__section">
                                <h2>
                                    <span className="project-detail__section-icon">⭐</span>
                                    {t('projectDetail.keyFeatures')}
                                </h2>
                                <div className="project-detail__features">
                                    {project.features.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            className="project-detail__feature"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <span className="project-detail__feature-icon">{feature.icon}</span>
                                            <div>
                                                <h4>{getLocalizedText(feature.title, language)}</h4>
                                                <p>{getLocalizedText(feature.description, language)}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </motion.div>

                    {/* Sidebar */}
                    <motion.aside
                        className="project-detail__sidebar"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {/* Actions */}
                        <div className="project-detail__actions">
                            {project.liveUrl && (
                                <Button
                                    size="lg"
                                    fullWidth
                                    onClick={() => onDemoClick(project.id, project.liveUrl)}
                                >
                                    🚀 {t('projectDetail.viewLiveDemo')}
                                </Button>
                            )}
                            {project.repoUrl && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    fullWidth
                                    onClick={() => onRepoClick(project.id, project.repoUrl)}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    {t('projectDetail.githubRepo')}
                                </Button>
                            )}
                        </div>

                        {/* Tech Stack */}
                        <div className="project-detail__meta-section">
                            <h4>{t('projectDetail.techStack')}</h4>
                            <div className="project-detail__tech-tags">
                                {project.techStack?.map((tech) => (
                                    <span key={tech} className="project-detail__tech-tag">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="project-detail__info">
                            <div className="project-detail__info-row">
                                <span className="project-detail__info-label">{t('projectDetail.date')}</span>
                                <span className="project-detail__info-value">{project.date}</span>
                            </div>
                            <div className="project-detail__info-row">
                                <span className="project-detail__info-label">{t('projectDetail.duration')}</span>
                                <span className="project-detail__info-value">{project.duration}</span>
                            </div>
                            <div className="project-detail__info-row">
                                <span className="project-detail__info-label">{t('projectDetail.role')}</span>
                                <span className="project-detail__info-value" style={{ textTransform: 'capitalize' }}>
                                    {project.role}
                                </span>
                            </div>
                            <div className="project-detail__info-row">
                                <span className="project-detail__info-label">{t('projectDetail.status')}</span>
                                <span className={`project-detail__status project-detail__status--${project.status}`}>
                                    {project.status === 'completed' ? t('projectDetail.completed') : t('projectDetail.inProgress')}
                                </span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="project-detail__cta-box">
                            <p>{t('projectDetail.likeProject')}</p>
                            <Link to="/about#contact" className="project-detail__cta-link">
                                {t('projectDetail.letsWork')} →
                            </Link>
                        </div>
                    </motion.aside>
                </div>

                {/* Navigation */}
                <div className="project-detail__nav">
                    {prevProject ? (
                        <Link to={`/projects/${prevProject.slug || prevProject.id}`} className="project-detail__nav-link project-detail__nav-link--prev">
                            <span className="project-detail__nav-label">{t('projectDetail.previousProject')}</span>
                            <span className="project-detail__nav-title">
                                {getLocalizedText(prevProject.title, language)}
                            </span>
                        </Link>
                    ) : <div />}
                    {nextProject && (
                        <Link to={`/projects/${nextProject.slug || nextProject.id}`} className="project-detail__nav-link project-detail__nav-link--next">
                            <span className="project-detail__nav-label">{t('projectDetail.nextProject')}</span>
                            <span className="project-detail__nav-title">
                                {getLocalizedText(nextProject.title, language)}
                            </span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            <Lightbox
                images={projectImages}
                currentIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNavigate={(index) => {
                    if (index >= 0 && index < (project.images?.length || 1)) {
                        setLightboxIndex(index);
                    }
                }}
            />
        </main>
    );
};

export default ProjectDetail;
