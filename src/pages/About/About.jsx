import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { skills, experiences, hobbies } from '../../data/skills';
import { certificates } from '../../data/certificates';
import { getLocalizedText } from '../../utils/helpers';
import { useAnalytics } from '../../hooks/useAnalytics';
import Timeline from '../../components/Timeline/Timeline';
import SkillCard from '../../components/SkillCard/SkillCard';
import Button from '../../components/Button/Button';
import './About.css';

const About = () => {
    const { t, i18n } = useTranslation();
    const { onPageView } = useAnalytics();
    const language = i18n.language;

    // Certificate modal state
    const [selectedCert, setSelectedCert] = useState(null);

    useEffect(() => {
        onPageView('about');
    }, [onPageView]);

    const openCertModal = (cert) => {
        setSelectedCert(cert);
    };

    const closeCertModal = () => {
        setSelectedCert(null);
    };

    return (
        <main className="about-page">
            {/* Hero Section */}
            <section className="about-hero section">
                <div className="container">
                    <div className="about-hero__content">
                        <motion.div
                            className="about-hero__text"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="about-hero__title">
                                {t('about.title')}{' '}
                                <span className="about-hero__name">{t('about.name')}</span>.
                                <br />
                                {t('about.tagline')}
                            </h1>
                            <p className="about-hero__description">
                                {t('about.description')}
                            </p>
                            <div className="about-hero__actions">
                                <Button to="#contact" size="lg">
                                    {t('about.contactMe')}
                                </Button>
                                <Button to="/projects" variant="outline" size="lg">
                                    {t('about.viewProjects')}
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            className="about-hero__image"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="about-hero__photo">
                                <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face"
                                    alt="Profile"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Technical Toolkit */}
            <section className="about-toolkit section">
                <div className="container">
                    <motion.div
                        className="about-section__header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="about-section__icon">|</div>
                        <h2>{t('about.toolkit')}</h2>
                    </motion.div>

                    <div className="about-toolkit__grid">
                        {skills.map((skill, index) => (
                            <SkillCard key={skill.name} skill={skill} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Certificates Section */}
            <section className="about-certificates section">
                <div className="container">
                    <motion.div
                        className="about-section__header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="about-section__icon">|</div>
                        <h2>📜 Sertifikat & Kredensial</h2>
                    </motion.div>

                    <div className="about-certificates__grid">
                        {certificates.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                className="cert-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                            >
                                <div className="cert-card__image">
                                    <img src={cert.image} alt={getLocalizedText(cert.title, language)} />
                                </div>
                                <div className="cert-card__content">
                                    <h4 className="cert-card__title">
                                        {getLocalizedText(cert.title, language)}
                                    </h4>
                                    <p className="cert-card__issuer">{cert.issuer}</p>
                                    <p className="cert-card__date">{cert.date}</p>
                                    <button
                                        className="cert-card__btn"
                                        onClick={() => openCertModal(cert)}
                                    >
                                        Lihat Detail
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certificate Modal */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        className="cert-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCertModal}
                    >
                        <motion.div
                            className="cert-modal"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="cert-modal__close" onClick={closeCertModal}>
                                ×
                            </button>
                            <div className="cert-modal__image">
                                <img
                                    src={selectedCert.image}
                                    alt={getLocalizedText(selectedCert.title, language)}
                                />
                            </div>
                            <div className="cert-modal__info">
                                <h3>{getLocalizedText(selectedCert.title, language)}</h3>
                                <div className="cert-modal__details">
                                    <p><strong>Penerbit:</strong> {selectedCert.issuer}</p>
                                    <p><strong>Tanggal:</strong> {selectedCert.date}</p>
                                    {selectedCert.credentialId && (
                                        <p><strong>Credential ID:</strong> {selectedCert.credentialId}</p>
                                    )}
                                </div>
                                {selectedCert.credentialUrl && (
                                    <a
                                        href={selectedCert.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cert-modal__verify-btn"
                                    >
                                        🔗 Verifikasi Credential
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Journey / Experience */}
            <section className="about-journey section">
                <div className="container">
                    <motion.div
                        className="about-section__header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="about-section__icon">|</div>
                        <h2>{t('about.journey')}</h2>
                    </motion.div>

                    <div className="about-journey__timeline">
                        <Timeline items={experiences} />
                    </div>
                </div>
            </section>

            {/* When I'm AFK */}
            <section className="about-hobbies section">
                <div className="container">
                    <motion.div
                        className="about-section__header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="about-section__icon">|</div>
                        <h2>{t('about.hobbies')}</h2>
                    </motion.div>

                    <div className="about-hobbies__grid">
                        {hobbies.map((hobby, index) => (
                            <motion.div
                                key={hobby.title.en}
                                className="about-hobby-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                            >
                                <span
                                    className="about-hobby-card__icon"
                                    style={{ backgroundColor: `${hobby.color}15`, color: hobby.color }}
                                >
                                    {hobby.icon}
                                </span>
                                <div className="about-hobby-card__content">
                                    <h4>{getLocalizedText(hobby.title, language)}</h4>
                                    <p>{getLocalizedText(hobby.description, language)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="about-contact section" id="contact">
                <div className="container container-sm">
                    <motion.div
                        className="about-contact__content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2>Let's Work Together</h2>
                        <p>Have a project in mind? Let's discuss how we can collaborate.</p>
                        <div className="about-contact__email">
                            <a href="mailto:damar@example.com">damar@example.com</a>
                        </div>
                        <div className="about-contact__social">
                            <a href="https://github.com/damar" target="_blank" rel="noopener noreferrer">
                                GitHub
                            </a>
                            <a href="https://linkedin.com/in/damar" target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                            <a href="https://twitter.com/damar" target="_blank" rel="noopener noreferrer">
                                Twitter
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default About;
