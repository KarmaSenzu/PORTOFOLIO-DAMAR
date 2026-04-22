import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjects, addProject, updateProject, deleteProject } from '../../data/projects';
import { getBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost } from '../../data/blog';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState(() => getProjects());
    const [blogPosts, setBlogPosts] = useState(() => getBlogPosts());
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        const auth = sessionStorage.getItem('portfolio_admin_auth');
        if (!auth) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('portfolio_admin_auth');
        sessionStorage.removeItem('portfolio_admin_time');
        navigate('/login');
    };

    const handleAddProject = () => { setModalType('add'); setEditingItem(null); setShowModal(true); };
    const handleEditProject = (project) => { setModalType('edit'); setEditingItem(project); setShowModal(true); };
    const handleDeleteProject = (id) => { if (confirm('Yakin ingin menghapus project ini?')) { setProjects(deleteProject(id)); } };
    const handleSaveProject = (data) => {
        if (modalType === 'add') { setProjects(addProject(data)); } else { setProjects(updateProject(editingItem.id, data)); }
        setShowModal(false);
    };

    const handleAddBlog = () => { setModalType('add'); setEditingItem(null); setShowModal(true); };
    const handleEditBlog = (post) => { setModalType('edit'); setEditingItem(post); setShowModal(true); };
    const handleDeleteBlog = (id) => { if (confirm('Yakin ingin menghapus blog post ini?')) { setBlogPosts(deleteBlogPost(id)); } };
    const handleSaveBlog = (data) => {
        if (modalType === 'add') { setBlogPosts(addBlogPost(data)); } else { setBlogPosts(updateBlogPost(editingItem.id, data)); }
        setShowModal(false);
    };

    return (
        <div className="dashboard">
            <header className="dashboard__header">
                <div className="dashboard__header-left">
                    <h1>📊 Admin Dashboard</h1>
                    <p>Kelola project dan blog portfolio Anda</p>
                </div>
                <div className="dashboard__header-right">
                    <a href="/" target="_blank" className="dashboard__btn dashboard__btn--outline">Lihat Portfolio</a>
                    <button onClick={handleLogout} className="dashboard__btn dashboard__btn--danger">Logout</button>
                </div>
            </header>

            <div className="dashboard__tabs">
                <button className={`dashboard__tab ${activeTab === 'projects' ? 'dashboard__tab--active' : ''}`} onClick={() => setActiveTab('projects')}>
                    📁 Projects ({projects.length})
                </button>
                <button className={`dashboard__tab ${activeTab === 'blog' ? 'dashboard__tab--active' : ''}`} onClick={() => setActiveTab('blog')}>
                    📝 Blog Posts ({blogPosts.length})
                </button>
            </div>

            <div className="dashboard__content">
                {activeTab === 'projects' && <ProjectsTable projects={projects} onAdd={handleAddProject} onEdit={handleEditProject} onDelete={handleDeleteProject} />}
                {activeTab === 'blog' && <BlogTable posts={blogPosts} onAdd={handleAddBlog} onEdit={handleEditBlog} onDelete={handleDeleteBlog} />}
            </div>

            <AnimatePresence>
                {showModal && (
                    <DashboardModal
                        type={activeTab}
                        mode={modalType}
                        item={editingItem}
                        onClose={() => setShowModal(false)}
                        onSave={activeTab === 'projects' ? handleSaveProject : handleSaveBlog}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const ProjectsTable = ({ projects, onAdd, onEdit, onDelete }) => (
    <div className="dashboard__table-wrapper">
        <div className="dashboard__table-header">
            <h2>Daftar Projects</h2>
            <button onClick={onAdd} className="dashboard__btn dashboard__btn--primary">+ Tambah Project</button>
        </div>
        <div className="dashboard__table-container">
            <table className="dashboard__table">
                <thead>
                    <tr>
                        <th style={{ width: '50px' }}>No</th>
                        <th style={{ width: '80px' }}>Gambar</th>
                        <th>Judul</th>
                        <th>Kategori</th>
                        <th>Role</th>
                        <th>Tech Stack</th>
                        <th>Status</th>
                        <th style={{ width: '140px' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.length === 0 ? (
                        <tr><td colSpan="8" className="dashboard__empty">Belum ada project.</td></tr>
                    ) : projects.map((project, index) => (
                        <tr key={project.id}>
                            <td>{index + 1}</td>
                            <td><img src={project.image} alt={project.title?.en || project.title} className="dashboard__thumbnail" /></td>
                            <td className="dashboard__title-cell">
                                <strong>{project.title?.en || project.title}</strong>
                                {project.title?.id && <small>{project.title.id}</small>}
                            </td>
                            <td><span className={`dashboard__badge dashboard__badge--${project.category}`}>{project.category}</span></td>
                            <td>{project.role}</td>
                            <td>
                                <div className="dashboard__tech-list">
                                    {project.techStack?.slice(0, 3).map(tech => (<span key={tech} className="dashboard__tech-tag">{tech}</span>))}
                                    {project.techStack?.length > 3 && <span className="dashboard__tech-more">+{project.techStack.length - 3}</span>}
                                </div>
                            </td>
                            <td><span className={`dashboard__status dashboard__status--${project.status}`}>{project.status === 'completed' ? '✅' : '🔄'}</span></td>
                            <td>
                                <div className="dashboard__actions">
                                    <button onClick={() => onEdit(project)} className="dashboard__action-btn dashboard__action-btn--edit" title="Edit">✏️</button>
                                    <button onClick={() => onDelete(project.id)} className="dashboard__action-btn dashboard__action-btn--delete" title="Hapus">🗑️</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const BlogTable = ({ posts, onAdd, onEdit, onDelete }) => (
    <div className="dashboard__table-wrapper">
        <div className="dashboard__table-header">
            <h2>Daftar Blog Posts</h2>
            <button onClick={onAdd} className="dashboard__btn dashboard__btn--primary">+ Tambah Blog Post</button>
        </div>
        <div className="dashboard__table-container">
            <table className="dashboard__table">
                <thead>
                    <tr>
                        <th style={{ width: '50px' }}>No</th>
                        <th style={{ width: '80px' }}>Gambar</th>
                        <th>Judul</th>
                        <th>Kategori</th>
                        <th>Tags</th>
                        <th>Waktu Baca</th>
                        <th>Tanggal</th>
                        <th style={{ width: '140px' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.length === 0 ? (
                        <tr><td colSpan="8" className="dashboard__empty">Belum ada blog post.</td></tr>
                    ) : posts.map((post, index) => (
                        <tr key={post.id}>
                            <td>{index + 1}</td>
                            <td><img src={post.image} alt={post.title?.en || post.title} className="dashboard__thumbnail" /></td>
                            <td className="dashboard__title-cell"><strong>{post.title?.en || post.title}</strong></td>
                            <td><span className="dashboard__badge">{post.category}</span></td>
                            <td>
                                <div className="dashboard__tech-list">
                                    {post.tags?.slice(0, 2).map(tag => (<span key={tag} className="dashboard__tech-tag">{tag}</span>))}
                                    {post.tags?.length > 2 && <span className="dashboard__tech-more">+{post.tags.length - 2}</span>}
                                </div>
                            </td>
                            <td>{post.readTime} min</td>
                            <td>{post.date}</td>
                            <td>
                                <div className="dashboard__actions">
                                    <button onClick={() => onEdit(post)} className="dashboard__action-btn dashboard__action-btn--edit" title="Edit">✏️</button>
                                    <button onClick={() => onDelete(post.id)} className="dashboard__action-btn dashboard__action-btn--delete" title="Hapus">🗑️</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const DashboardModal = ({ type, mode, item, onClose, onSave }) => {
    const isProject = type === 'projects';
    const isEdit = mode === 'edit';

    const [projectForm, setProjectForm] = useState({
        titleEn: item?.title?.en || '', titleId: item?.title?.id || '',
        descriptionEn: item?.description?.en || '', descriptionId: item?.description?.id || '',
        aboutEn: item?.about?.en || '', aboutId: item?.about?.id || '',
        category: item?.category || 'web-app', role: item?.role || 'fullstack',
        techStack: item?.techStack?.join(', ') || '',
        liveUrl: item?.liveUrl || '', repoUrl: item?.repoUrl || '',
        image: item?.image || '', images: item?.images || [],
        date: item?.date || '', duration: item?.duration || '',
        status: item?.status || 'completed', featured: item?.featured || false,
        problemEn: item?.caseStudy?.problem?.en || '', problemId: item?.caseStudy?.problem?.id || '',
        solutionEn: item?.caseStudy?.solution?.en || '', solutionId: item?.caseStudy?.solution?.id || '',
        resultEn: item?.caseStudy?.result?.en || '', resultId: item?.caseStudy?.result?.id || '',
        features: item?.features || []
    });

    const [blogForm, setBlogForm] = useState({
        titleEn: item?.title?.en || '', titleId: item?.title?.id || '',
        excerptEn: item?.excerpt?.en || '', excerptId: item?.excerpt?.id || '',
        contentEn: item?.content?.en || '', contentId: item?.content?.id || '',
        category: item?.category || 'tutorials',
        tags: item?.tags?.join(', ') || '',
        image: item?.image || '', readTime: item?.readTime || 5
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isProject) {
            const projectImages = projectForm.images.length > 0 ? projectForm.images : [projectForm.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'];
            onSave({
                title: { en: projectForm.titleEn, id: projectForm.titleId || projectForm.titleEn },
                description: { en: projectForm.descriptionEn, id: projectForm.descriptionId || projectForm.descriptionEn },
                about: { en: projectForm.aboutEn, id: projectForm.aboutId || projectForm.aboutEn },
                category: projectForm.category, role: projectForm.role,
                techStack: projectForm.techStack.split(',').map(t => t.trim()).filter(Boolean),
                liveUrl: projectForm.liveUrl || null, repoUrl: projectForm.repoUrl || null,
                image: projectImages[0], images: projectImages,
                date: projectForm.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                duration: projectForm.duration || '4 Weeks', status: projectForm.status, featured: projectForm.featured,
                caseStudy: {
                    problem: { en: projectForm.problemEn, id: projectForm.problemId || projectForm.problemEn },
                    solution: { en: projectForm.solutionEn, id: projectForm.solutionId || projectForm.solutionEn },
                    result: { en: projectForm.resultEn, id: projectForm.resultId || projectForm.resultEn }
                },
                features: projectForm.features, challenges: []
            });
        } else {
            onSave({
                title: { en: blogForm.titleEn, id: blogForm.titleId || blogForm.titleEn },
                excerpt: { en: blogForm.excerptEn, id: blogForm.excerptId || blogForm.excerptEn },
                content: { en: blogForm.contentEn, id: blogForm.contentId || blogForm.contentEn },
                category: blogForm.category,
                tags: blogForm.tags.split(',').map(t => t.trim()).filter(Boolean),
                image: blogForm.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
                readTime: parseInt(blogForm.readTime) || 5
            });
        }
    };

    return (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
            <motion.div className="modal-content" initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEdit ? '✏️ Edit' : '➕ Tambah'} {isProject ? 'Project' : 'Blog Post'}</h2>
                    <button onClick={onClose} className="modal-close">×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {isProject ? (
                        <>
                            <div className="form-section">
                                <h3>📝 Informasi Dasar</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Judul (English) *</label>
                                        <input type="text" value={projectForm.titleEn} onChange={(e) => setProjectForm({ ...projectForm, titleEn: e.target.value })} required placeholder="E-commerce Dashboard" />
                                    </div>
                                    <div className="form-group">
                                        <label>Judul (Indonesia)</label>
                                        <input type="text" value={projectForm.titleId} onChange={(e) => setProjectForm({ ...projectForm, titleId: e.target.value })} placeholder="Dashboard E-commerce" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Deskripsi Singkat (EN) *</label>
                                        <textarea value={projectForm.descriptionEn} onChange={(e) => setProjectForm({ ...projectForm, descriptionEn: e.target.value })} required rows="2" placeholder="A comprehensive dashboard..." />
                                    </div>
                                    <div className="form-group">
                                        <label>Deskripsi Singkat (ID)</label>
                                        <textarea value={projectForm.descriptionId} onChange={(e) => setProjectForm({ ...projectForm, descriptionId: e.target.value })} rows="2" placeholder="Dashboard komprehensif..." />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>📋 Detail Project</h3>
                                <div className="form-row form-row--3">
                                    <div className="form-group">
                                        <label>Kategori</label>
                                        <select value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}>
                                            <option value="web-app">Web App</option>
                                            <option value="mobile">Mobile</option>
                                            <option value="open-source">Open Source</option>
                                            <option value="design">Design</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Role</label>
                                        <select value={projectForm.role} onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}>
                                            <option value="frontend">Frontend</option>
                                            <option value="backend">Backend</option>
                                            <option value="fullstack">Fullstack</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}>
                                            <option value="completed">Completed</option>
                                            <option value="in-progress">In Progress</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Tech Stack (pisahkan dengan koma)</label>
                                    <input type="text" value={projectForm.techStack} onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Tanggal</label>
                                        <input type="text" value={projectForm.date} onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })} placeholder="Jan 2024" />
                                    </div>
                                    <div className="form-group">
                                        <label>Durasi</label>
                                        <input type="text" value={projectForm.duration} onChange={(e) => setProjectForm({ ...projectForm, duration: e.target.value })} placeholder="4 Weeks" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>🔗 Links & Media</h3>
                                <ImageUpload label="Gambar Project (Bisa pilih beberapa) *" value={projectForm.images} onChange={(images) => setProjectForm({ ...projectForm, images, image: images[0] || '' })} maxSize={5} multiple={true} />
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Live Demo URL</label>
                                        <input type="url" value={projectForm.liveUrl} onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })} placeholder="https://your-project.com" />
                                    </div>
                                    <div className="form-group">
                                        <label>GitHub Repo URL</label>
                                        <input type="url" value={projectForm.repoUrl} onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })} placeholder="https://github.com/username/repo" />
                                    </div>
                                </div>
                                <div className="form-group form-group--checkbox">
                                    <label>
                                        <input type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} />
                                        Tampilkan di Featured Projects (Home)
                                    </label>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>📄 About / Deskripsi Lengkap</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>About (EN)</label>
                                        <textarea value={projectForm.aboutEn} onChange={(e) => setProjectForm({ ...projectForm, aboutEn: e.target.value })} rows="4" placeholder="Full description..." />
                                    </div>
                                    <div className="form-group">
                                        <label>About (ID)</label>
                                        <textarea value={projectForm.aboutId} onChange={(e) => setProjectForm({ ...projectForm, aboutId: e.target.value })} rows="4" placeholder="Deskripsi lengkap..." />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>📊 Case Study</h3>
                                <p className="form-hint">Jelaskan masalah, solusi, dan hasil dari project ini.</p>
                                <div className="form-group"><label>🔴 Problem (EN)</label><textarea value={projectForm.problemEn} onChange={(e) => setProjectForm({ ...projectForm, problemEn: e.target.value })} rows="2" placeholder="What problem does this project solve?" /></div>
                                <div className="form-group"><label>🔴 Problem (ID)</label><textarea value={projectForm.problemId} onChange={(e) => setProjectForm({ ...projectForm, problemId: e.target.value })} rows="2" placeholder="Masalah apa yang dipecahkan?" /></div>
                                <div className="form-group"><label>🟢 Solution (EN)</label><textarea value={projectForm.solutionEn} onChange={(e) => setProjectForm({ ...projectForm, solutionEn: e.target.value })} rows="2" placeholder="How did you solve it?" /></div>
                                <div className="form-group"><label>🟢 Solution (ID)</label><textarea value={projectForm.solutionId} onChange={(e) => setProjectForm({ ...projectForm, solutionId: e.target.value })} rows="2" placeholder="Bagaimana menyelesaikannya?" /></div>
                                <div className="form-group"><label>🔵 Result (EN)</label><textarea value={projectForm.resultEn} onChange={(e) => setProjectForm({ ...projectForm, resultEn: e.target.value })} rows="2" placeholder="What was the outcome?" /></div>
                                <div className="form-group"><label>🔵 Result (ID)</label><textarea value={projectForm.resultId} onChange={(e) => setProjectForm({ ...projectForm, resultId: e.target.value })} rows="2" placeholder="Apa hasilnya?" /></div>
                            </div>

                            <div className="form-section">
                                <h3>✨ Features</h3>
                                <p className="form-hint">Tambahkan fitur-fitur utama project ini.</p>
                                {projectForm.features.map((feature, index) => (
                                    <div key={index} className="feature-card">
                                        <div className="feature-card__header">
                                            <span className="feature-card__number">Feature {index + 1}</span>
                                            <button type="button" onClick={() => { const nf = projectForm.features.filter((_, i) => i !== index); setProjectForm({ ...projectForm, features: nf }); }} className="feature-card__remove">🗑️ Hapus</button>
                                        </div>
                                        <div className="form-row form-row--3">
                                            <div className="form-group"><label>Icon</label><input type="text" value={feature.icon} onChange={(e) => { const nf = [...projectForm.features]; nf[index] = { ...nf[index], icon: e.target.value }; setProjectForm({ ...projectForm, features: nf }); }} placeholder="📊" maxLength="3" /></div>
                                            <div className="form-group"><label>Title (EN)</label><input type="text" value={feature.title?.en || ''} onChange={(e) => { const nf = [...projectForm.features]; nf[index] = { ...nf[index], title: { ...nf[index].title, en: e.target.value } }; setProjectForm({ ...projectForm, features: nf }); }} placeholder="Feature Title" /></div>
                                            <div className="form-group"><label>Title (ID)</label><input type="text" value={feature.title?.id || ''} onChange={(e) => { const nf = [...projectForm.features]; nf[index] = { ...nf[index], title: { ...nf[index].title, id: e.target.value } }; setProjectForm({ ...projectForm, features: nf }); }} placeholder="Judul Fitur" /></div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group"><label>Description (EN)</label><input type="text" value={feature.description?.en || ''} onChange={(e) => { const nf = [...projectForm.features]; nf[index] = { ...nf[index], description: { ...nf[index].description, en: e.target.value } }; setProjectForm({ ...projectForm, features: nf }); }} placeholder="Brief description" /></div>
                                            <div className="form-group"><label>Description (ID)</label><input type="text" value={feature.description?.id || ''} onChange={(e) => { const nf = [...projectForm.features]; nf[index] = { ...nf[index], description: { ...nf[index].description, id: e.target.value } }; setProjectForm({ ...projectForm, features: nf }); }} placeholder="Deskripsi singkat" /></div>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => { setProjectForm({ ...projectForm, features: [...projectForm.features, { icon: '', title: { en: '', id: '' }, description: { en: '', id: '' } }] }); }} className="dashboard__btn dashboard__btn--outline add-feature-btn">➕ Tambah Feature</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-section">
                                <h3>📝 Informasi Blog Post</h3>
                                <div className="form-row">
                                    <div className="form-group"><label>Judul (English) *</label><input type="text" value={blogForm.titleEn} onChange={(e) => setBlogForm({ ...blogForm, titleEn: e.target.value })} required placeholder="Building Scalable React Apps" /></div>
                                    <div className="form-group"><label>Judul (Indonesia)</label><input type="text" value={blogForm.titleId} onChange={(e) => setBlogForm({ ...blogForm, titleId: e.target.value })} placeholder="Membangun Aplikasi React" /></div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>📋 Detail</h3>
                                <div className="form-row form-row--3">
                                    <div className="form-group">
                                        <label>Kategori</label>
                                        <select value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}>
                                            <option value="tutorials">Tutorials</option>
                                            <option value="thoughts">Thoughts</option>
                                            <option value="tips">Tips & Tricks</option>
                                        </select>
                                    </div>
                                    <div className="form-group"><label>Waktu Baca (menit)</label><input type="number" value={blogForm.readTime} onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })} min="1" /></div>
                                    <div className="form-group"><label>Tags (koma)</label><input type="text" value={blogForm.tags} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })} placeholder="React, TypeScript" /></div>
                                </div>
                                <ImageUpload label="Gambar Blog Post" value={blogForm.image} onChange={(base64) => setBlogForm({ ...blogForm, image: base64 })} maxSize={3} />
                            </div>

                            <div className="form-section">
                                <h3>📝 Excerpt (Ringkasan)</h3>
                                <div className="form-row">
                                    <div className="form-group"><label>Excerpt (EN) *</label><textarea value={blogForm.excerptEn} onChange={(e) => setBlogForm({ ...blogForm, excerptEn: e.target.value })} required rows="2" placeholder="Short summary..." /></div>
                                    <div className="form-group"><label>Excerpt (ID)</label><textarea value={blogForm.excerptId} onChange={(e) => setBlogForm({ ...blogForm, excerptId: e.target.value })} rows="2" placeholder="Ringkasan singkat..." /></div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>📄 Konten</h3>
                                <div className="form-row">
                                    <div className="form-group"><label>Content (EN) *</label><textarea value={blogForm.contentEn} onChange={(e) => setBlogForm({ ...blogForm, contentEn: e.target.value })} required rows="8" placeholder="Full blog post content..." /></div>
                                    <div className="form-group"><label>Content (ID)</label><textarea value={blogForm.contentId} onChange={(e) => setBlogForm({ ...blogForm, contentId: e.target.value })} rows="8" placeholder="Konten blog post..." /></div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="dashboard__btn">Batal</button>
                        <button type="submit" className="dashboard__btn dashboard__btn--primary">{isEdit ? 'Simpan Perubahan' : 'Tambah'}</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
