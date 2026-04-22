import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { getLocalizedText, getCategoryColor, getCategoryLabel } from '../../utils/helpers';
import { useAnalytics } from '../../hooks/useAnalytics';
import './ProjectCard.css';

const ProjectCard = ({ project, index = 0, featured = false }) => {
    const { t, i18n } = useTranslation();
    const { onDemoClick, onRepoClick } = useAnalytics();
    const language = i18n.language;

    const categoryColor = getCategoryColor(project.category);
    const categoryLabel = getCategoryLabel(project.category, language);

    return (
        <motion.article
            className={`project-card ${featured ? 'project-card--featured' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            {/* Image */}
            <Link to={`/projects/${project.id}`} className="project-card__image-wrapper">
                <motion.div
                    className="project-card__image"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                >
                    <img
                        src={project.image}
                        alt={getLocalizedText(project.title, language)}
                        loading="lazy"
                    />
                </motion.div>
                <div className="project-card__overlay">
                    <span className="project-card__view-text">
                        {t('featured.viewCaseStudy')} →
                    </span>
                </div>
            </Link>

            {/* Content */}
            <div className="project-card__content">
                {/* Category Badge */}
                <div className="project-card__meta">
                    <span
                        className="project-card__category"
                        style={{
                            backgroundColor: categoryColor.bg,
                            color: categoryColor.text
                        }}
                    >
                        {categoryLabel}
                    </span>
                    {project.date && (
                        <span className="project-card__date">{project.date}</span>
                    )}
                </div>

                {/* Title */}
                <Link to={`/projects/${project.id}`}>
                    <h3 className="project-card__title">
                        {getLocalizedText(project.title, language)}
                    </h3>
                </Link>

                {/* Description */}
                <p className="project-card__description">
                    {getLocalizedText(project.description, language)}
                </p>

                {/* Tech Stack */}
                <div className="project-card__tags">
                    {project.techStack?.slice(0, 3).map((tech) => (
                        <span key={tech} className="project-card__tag">
                            {tech}
                        </span>
                    ))}
                    {project.techStack?.length > 3 && (
                        <span className="project-card__tag project-card__tag--more">
                            +{project.techStack.length - 3}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="project-card__actions">
                    {project.repoUrl && (
                        <button
                            className="project-card__link"
                            onClick={() => onRepoClick(project.id, project.repoUrl)}
                        >
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                            {t('projects.source')}
                        </button>
                    )}
                    {project.liveUrl && (
                        <button
                            className="project-card__link project-card__link--primary"
                            onClick={() => onDemoClick(project.id, project.liveUrl)}
                        >
                            {t('projects.liveDemo')}
                            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </motion.article>
    );
};

export default ProjectCard;
