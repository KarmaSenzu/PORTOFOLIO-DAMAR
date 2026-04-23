import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { blogService } from '../../services/blog';
import { uploadService } from '../../services/upload';
import { getLocalizedText, formatDate } from '../../utils/helpers';
import { useAnalytics } from '../../hooks/useAnalytics';
import FilterTabs from '../../components/FilterTabs/FilterTabs';
import './Blog.css';

const Blog = () => {
    const { t, i18n } = useTranslation();
    const { onPageView } = useAnalytics();
    const language = i18n.language;

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onPageView('blog');
    }, [onPageView]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await blogService.getAll();
                setPosts(res.data || res);
            } catch (error) {
                console.error('Failed to fetch blog posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const categoryFilters = [
        { value: 'all', label: t('blog.categories.all') },
        { value: 'tutorials', label: t('blog.categories.tutorials') },
        { value: 'thoughts', label: t('blog.categories.thoughts') },
        { value: 'tips', label: t('blog.categories.tips') },
    ];

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            // Search filter
            const searchLower = searchQuery.toLowerCase();
            const titleMatch = (post.title.en?.toLowerCase() || '').includes(searchLower) ||
                (post.title.id?.toLowerCase() || '').includes(searchLower);

            if (searchQuery && !titleMatch) {
                return false;
            }

            // Category filter
            if (categoryFilter !== 'all' && post.category !== categoryFilter) {
                return false;
            }

            return true;
        });
    }, [posts, searchQuery, categoryFilter]);

    if (loading) {
        return (
            <main className="blog-page">
                <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div className="loading-spinner" />
                </div>
            </main>
        );
    }

    return (
        <main className="blog-page">
            <section className="section">
                <div className="container">
                    {/* Header */}
                    <motion.div
                        className="blog-page__header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="blog-page__title">{t('blog.pageTitle')}</h1>
                        <p className="blog-page__description">{t('blog.pageDescription')}</p>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        className="blog-page__filters"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {/* Search */}
                        <div className="blog-page__search">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                            <input
                                type="text"
                                placeholder={t('blog.searchPlaceholder')}
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

                    {/* Posts Grid */}
                    <div className="blog-page__grid">
                        {filteredPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                className="blog-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link to={`/blog/${post.slug || post.id}`} className="blog-card__image">
                                    <img
                                        src={uploadService.getImageUrl(post.image)}
                                        alt={getLocalizedText(post.title, language)}
                                        loading="lazy"
                                    />
                                </Link>
                                <div className="blog-card__content">
                                    <div className="blog-card__meta">
                                        <span className="blog-card__category">{post.category}</span>
                                        <span className="blog-card__date">{formatDate(post.date, language)}</span>
                                        <span className="blog-card__read-time">{post.readTime} {t('blog.minRead')}</span>
                                    </div>
                                    <Link to={`/blog/${post.slug || post.id}`}>
                                        <h2 className="blog-card__title">
                                            {getLocalizedText(post.title, language)}
                                        </h2>
                                    </Link>
                                    <p className="blog-card__excerpt">
                                        {getLocalizedText(post.excerpt, language)}
                                    </p>
                                    <Link to={`/blog/${post.slug || post.id}`} className="blog-card__link">
                                        {t('blog.readMore')} →
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredPosts.length === 0 && (
                        <motion.div
                            className="blog-page__empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="blog-page__empty-icon">📝</div>
                            <h3>No posts found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Blog;