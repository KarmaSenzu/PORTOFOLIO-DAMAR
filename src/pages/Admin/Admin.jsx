import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getProjects, addProject, deleteProject } from '../../data/projects';
import { getBlogPosts, addBlogPost, deleteBlogPost } from '../../data/blog';
import { getAnalyticsSummary, clearAnalytics } from '../../utils/analytics';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import './Admin.css';

const Admin = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState(() => getProjects());
    const [blogPosts, setBlogPosts] = useState(() => getBlogPosts());
    const [analytics, setAnalytics] = useState(() => getAnalyticsSummary());

    // Project form state
    const [projectForm, setProjectForm] = useState({
        title: '',
        description: '',
        category: 'web-app',
        role: 'fullstack',
        techStack: '',
        liveUrl: '',
        repoUrl: '',
        images: ['']
    });

    // Helper functions for multi-image management
    const addImageField = () => {
        setProjectForm(prev => ({
            ...prev,
            images: [...prev.images, '']
        }));
    };

    const removeImageField = (index) => {
        setProjectForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const updateImageField = (index, value) => {
        setProjectForm(prev => ({
            ...prev,
            images: prev.images.map((img, i) => i === index ? value : img)
        }));
    };

    // Blog form state
    const [blogForm, setBlogForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'tutorials',
        tags: '',
        image: ''
    });

    // Listen for keyboard shortcut
    const handleKeyDown = useCallback((e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            setIsOpen(true);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Handle project submit
    const handleProjectSubmit = (e) => {
        e.preventDefault();
        const validImages = projectForm.images.filter(img => img.trim() !== '');
        const finalImages = validImages.length > 0 ? validImages : ['https://via.placeholder.com/800x600'];

        const newProject = {
            title: { en: projectForm.title, id: projectForm.title },
            description: { en: projectForm.description, id: projectForm.description },
            category: projectForm.category,
            role: projectForm.role,
            techStack: projectForm.techStack.split(',').map(t => t.trim()).filter(Boolean),
            liveUrl: projectForm.liveUrl || null,
            repoUrl: projectForm.repoUrl || null,
            image: finalImages[0],
            images: finalImages,
            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            duration: '4 Weeks',
            status: 'completed',
            featured: false,
            about: { en: projectForm.description, id: projectForm.description },
            caseStudy: null,
            challenges: [],
            features: []
        };

        const updated = addProject(newProject);
        setProjects(updated);
        setProjectForm({
            title: '',
            description: '',
            category: 'web-app',
            role: 'fullstack',
            techStack: '',
            liveUrl: '',
            repoUrl: '',
            images: ['']
        });
        alert('Project added successfully!');
    };

    // Handle blog submit
    const handleBlogSubmit = (e) => {
        e.preventDefault();
        const newPost = {
            title: { en: blogForm.title, id: blogForm.title },
            excerpt: { en: blogForm.excerpt, id: blogForm.excerpt },
            content: { en: blogForm.content, id: blogForm.content },
            category: blogForm.category,
            tags: blogForm.tags.split(',').map(t => t.trim()).filter(Boolean),
            image: blogForm.image || 'https://via.placeholder.com/800x400',
            readTime: Math.ceil(blogForm.content.split(' ').length / 200) || 5
        };

        const updated = addBlogPost(newPost);
        setBlogPosts(updated);
        setBlogForm({
            title: '',
            excerpt: '',
            content: '',
            category: 'tutorials',
            tags: '',
            image: ''
        });
        alert('Blog post added successfully!');
    };

    // Handle delete
    const handleDeleteProject = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            const updated = deleteProject(id);
            setProjects(updated);
        }
    };

    const handleDeleteBlog = (id) => {
        if (confirm('Are you sure you want to delete this post?')) {
            const updated = deleteBlogPost(id);
            setBlogPosts(updated);
        }
    };

    const handleClearAnalytics = () => {
        if (confirm('Are you sure you want to clear all analytics data?')) {
            clearAnalytics();
            setAnalytics(getAnalyticsSummary());
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={t('admin.title')}
            size="lg"
        >
            <div className="admin">
                {/* Tabs */}
                <div className="admin__tabs">
                    <button
                        className={`admin__tab ${activeTab === 'projects' ? 'admin__tab--active' : ''}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        Projects ({projects.length})
                    </button>
                    <button
                        className={`admin__tab ${activeTab === 'blog' ? 'admin__tab--active' : ''}`}
                        onClick={() => setActiveTab('blog')}
                    >
                        Blog ({blogPosts.length})
                    </button>
                    <button
                        className={`admin__tab ${activeTab === 'analytics' ? 'admin__tab--active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        Analytics
                    </button>
                </div>

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <div className="admin__content">
                        <h3>{t('admin.addProject')}</h3>
                        <form onSubmit={handleProjectSubmit} className="admin__form">
                            <div className="admin__form-row">
                                <input
                                    type="text"
                                    placeholder={t('admin.projectTitle')}
                                    value={projectForm.title}
                                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin__form-row">
                                <textarea
                                    placeholder={t('admin.projectDescription')}
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                    required
                                    rows={3}
                                />
                            </div>
                            <div className="admin__form-row admin__form-row--half">
                                <select
                                    value={projectForm.category}
                                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                                >
                                    <option value="web-app">Web App</option>
                                    <option value="mobile">Mobile</option>
                                    <option value="open-source">Open Source</option>
                                    <option value="design">Design</option>
                                </select>
                                <select
                                    value={projectForm.role}
                                    onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
                                >
                                    <option value="frontend">Frontend</option>
                                    <option value="backend">Backend</option>
                                    <option value="fullstack">Fullstack</option>
                                </select>
                            </div>
                            <div className="admin__form-row">
                                <input
                                    type="text"
                                    placeholder={t('admin.projectTechStack')}
                                    value={projectForm.techStack}
                                    onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                                />
                            </div>
                            <div className="admin__form-row admin__form-row--half">
                                <input
                                    type="url"
                                    placeholder={t('admin.projectLiveUrl')}
                                    value={projectForm.liveUrl}
                                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                                />
                                <input
                                    type="url"
                                    placeholder={t('admin.projectRepoUrl')}
                                    value={projectForm.repoUrl}
                                    onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                                />
                            </div>
                            {/* Dynamic Image URLs */}
                            <div className="admin__images-section">
                                <label className="admin__images-label">
                                    {t('admin.projectImage')} ({projectForm.images.length})
                                </label>
                                {projectForm.images.map((image, index) => (
                                    <div key={index} className="admin__image-row">
                                        <input
                                            type="url"
                                            placeholder={`Image URL ${index + 1}`}
                                            value={image}
                                            onChange={(e) => updateImageField(index, e.target.value)}
                                        />
                                        {projectForm.images.length > 1 && (
                                            <button
                                                type="button"
                                                className="admin__image-remove"
                                                onClick={() => removeImageField(index)}
                                                aria-label="Remove image"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="admin__image-add"
                                    onClick={addImageField}
                                >
                                    + Add Another Image
                                </button>
                            </div>
                            <Button type="submit" fullWidth>
                                Add Project
                            </Button>
                        </form>

                        <div className="admin__list">
                            <h4>Existing Projects</h4>
                            {projects.slice(0, 5).map(project => (
                                <div key={project.id} className="admin__list-item">
                                    <span>{project.title?.en || project.title}</span>
                                    <button onClick={() => handleDeleteProject(project.id)} className="admin__delete">
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Blog Tab */}
                {activeTab === 'blog' && (
                    <div className="admin__content">
                        <h3>{t('admin.addBlog')}</h3>
                        <form onSubmit={handleBlogSubmit} className="admin__form">
                            <div className="admin__form-row">
                                <input
                                    type="text"
                                    placeholder="Blog Title"
                                    value={blogForm.title}
                                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin__form-row">
                                <textarea
                                    placeholder="Excerpt (short description)"
                                    value={blogForm.excerpt}
                                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                                    required
                                    rows={2}
                                />
                            </div>
                            <div className="admin__form-row">
                                <textarea
                                    placeholder="Content (markdown supported)"
                                    value={blogForm.content}
                                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                                    required
                                    rows={6}
                                />
                            </div>
                            <div className="admin__form-row admin__form-row--half">
                                <select
                                    value={blogForm.category}
                                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                                >
                                    <option value="tutorials">Tutorials</option>
                                    <option value="thoughts">Thoughts</option>
                                    <option value="tips">Tips & Tricks</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Tags (comma separated)"
                                    value={blogForm.tags}
                                    onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                                />
                            </div>
                            <div className="admin__form-row">
                                <input
                                    type="url"
                                    placeholder="Featured Image URL"
                                    value={blogForm.image}
                                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                                />
                            </div>
                            <Button type="submit" fullWidth>
                                Add Blog Post
                            </Button>
                        </form>

                        <div className="admin__list">
                            <h4>Existing Posts</h4>
                            {blogPosts.slice(0, 5).map(post => (
                                <div key={post.id} className="admin__list-item">
                                    <span>{post.title?.en || post.title}</span>
                                    <button onClick={() => handleDeleteBlog(post.id)} className="admin__delete">
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && analytics && (
                    <div className="admin__content">
                        <h3>{t('admin.analytics')}</h3>
                        <div className="admin__stats">
                            <div className="admin__stat">
                                <span className="admin__stat-value">{analytics.totalPageViews}</span>
                                <span className="admin__stat-label">Page Views</span>
                            </div>
                            <div className="admin__stat">
                                <span className="admin__stat-value">{analytics.totalDemoClicks}</span>
                                <span className="admin__stat-label">{t('admin.demoClicks')}</span>
                            </div>
                            <div className="admin__stat">
                                <span className="admin__stat-value">{analytics.totalRepoClicks}</span>
                                <span className="admin__stat-label">{t('admin.repoClicks')}</span>
                            </div>
                        </div>

                        {analytics.topProjects?.length > 0 && (
                            <div className="admin__top-projects">
                                <h4>Top Projects by Clicks</h4>
                                {analytics.topProjects.map((project, index) => (
                                    <div key={project.id} className="admin__list-item">
                                        <span>{index + 1}. {project.id}</span>
                                        <span>{project.clicks} clicks</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button variant="outline" onClick={handleClearAnalytics} style={{ marginTop: 'var(--space-4)' }}>
                            Clear Analytics Data
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default Admin;
