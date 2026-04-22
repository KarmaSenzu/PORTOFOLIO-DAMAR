import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Toggle language
    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'id' : 'en';
        i18n.changeLanguage(newLang);
    };

    const navLinks = [
        { to: '/', label: t('nav.home') },
        { to: '/projects', label: t('nav.projects') },
        { to: '/about', label: t('nav.about') },
        { to: '/blog', label: t('nav.blog') },
    ];

    return (
        <motion.header
            className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="container">
                <nav className="navbar__inner">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo">
                        <span className="navbar__logo-icon">{'</>'}</span>
                        <span className="navbar__logo-text">DamarDev</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="navbar__links hide-mobile">
                        {navLinks.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                                    }
                                    end={link.to === '/'}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Right side actions */}
                    <div className="navbar__actions">
                        {/* Language Toggle */}
                        <button
                            className="navbar__lang-toggle"
                            onClick={toggleLanguage}
                            aria-label="Toggle language"
                        >
                            <span className={i18n.language === 'en' ? 'active' : ''}>EN</span>
                            <span className="navbar__lang-divider">/</span>
                            <span className={i18n.language === 'id' ? 'active' : ''}>ID</span>
                        </button>

                        {/* CTA Button */}
                        <Link to="/about#contact" className="navbar__cta hide-mobile">
                            {t('nav.hireMe')}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="navbar__mobile-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className={`hamburger ${isMobileMenuOpen ? 'hamburger--active' : ''}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="navbar__mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ul className="navbar__mobile-links">
                            {navLinks.map((link, index) => (
                                <motion.li
                                    key={link.to}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) =>
                                            `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                                        }
                                        end={link.to === '/'}
                                    >
                                        {link.label}
                                    </NavLink>
                                </motion.li>
                            ))}
                            <motion.li
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: navLinks.length * 0.1 }}
                            >
                                <Link to="/about#contact" className="navbar__mobile-cta">
                                    {t('nav.hireMe')}
                                </Link>
                            </motion.li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Navbar;
