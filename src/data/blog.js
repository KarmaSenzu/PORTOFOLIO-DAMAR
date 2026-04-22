// Sample blog posts data

export const defaultBlogPosts = [
    {
        id: 'building-scalable-react-apps',
        title: {
            en: 'Building Scalable React Applications',
            id: 'Membangun Aplikasi React yang Skalabel'
        },
        excerpt: {
            en: 'Learn the patterns and practices I use to build React applications that scale from MVP to enterprise.',
            id: 'Pelajari pola dan praktik yang saya gunakan untuk membangun aplikasi React yang skalabel dari MVP hingga enterprise.'
        },
        content: {
            en: `# Building Scalable React Applications

When building React applications that need to scale, there are several patterns and practices that I've found invaluable...

## Project Structure

The way you organize your code matters. Here's my preferred structure:

\`\`\`
src/
  components/
  pages/
  hooks/
  utils/
  services/
\`\`\`

## State Management

For most applications, React Query combined with Context is sufficient...`,
            id: `# Membangun Aplikasi React yang Skalabel

Saat membangun aplikasi React yang perlu skalabel, ada beberapa pola dan praktik yang saya temukan sangat berharga...

## Struktur Proyek

Cara Anda mengorganisir kode itu penting. Berikut struktur yang saya prefer:

\`\`\`
src/
  components/
  pages/
  hooks/
  utils/
  services/
\`\`\`

## State Management

Untuk sebagian besar aplikasi, React Query dikombinasikan dengan Context sudah cukup...`
        },
        category: 'tutorials',
        tags: ['React', 'Architecture', 'Best Practices'],
        date: '2024-01-15',
        readTime: 8,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop'
    },
    {
        id: 'typescript-tips-tricks',
        title: {
            en: 'TypeScript Tips & Tricks for 2024',
            id: 'Tips & Trik TypeScript untuk 2024'
        },
        excerpt: {
            en: 'A collection of TypeScript patterns that have saved me hours of debugging.',
            id: 'Kumpulan pola TypeScript yang telah menghemat berjam-jam waktu debugging saya.'
        },
        content: {
            en: `# TypeScript Tips & Tricks

Here are some TypeScript patterns I use daily...`,
            id: `# Tips & Trik TypeScript

Berikut beberapa pola TypeScript yang saya gunakan sehari-hari...`
        },
        category: 'tips',
        tags: ['TypeScript', 'JavaScript', 'Development'],
        date: '2024-01-10',
        readTime: 5,
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop'
    },
    {
        id: 'future-of-web-development',
        title: {
            en: 'My Thoughts on the Future of Web Development',
            id: 'Pemikiran Saya tentang Masa Depan Web Development'
        },
        excerpt: {
            en: 'Reflections on where I think web development is heading and how to prepare for it.',
            id: 'Refleksi tentang kemana menurut saya web development akan menuju dan bagaimana mempersiapkannya.'
        },
        content: {
            en: `# The Future of Web Development

The web platform continues to evolve at a rapid pace...`,
            id: `# Masa Depan Web Development

Platform web terus berkembang dengan pesat...`
        },
        category: 'thoughts',
        tags: ['Web Development', 'Future', 'Trends'],
        date: '2024-01-05',
        readTime: 6,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop'
    }
];

// Get blog posts from localStorage or defaults
export const getBlogPosts = () => {
    const stored = localStorage.getItem('portfolio-blog');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return defaultBlogPosts;
        }
    }
    return defaultBlogPosts;
};

// Save blog posts to localStorage
export const saveBlogPosts = (posts) => {
    localStorage.setItem('portfolio-blog', JSON.stringify(posts));
};

// Add a blog post
export const addBlogPost = (post) => {
    const posts = getBlogPosts();
    const newPost = {
        ...post,
        id: post.id || `post-${Date.now()}`,
        date: post.date || new Date().toISOString().split('T')[0]
    };
    posts.unshift(newPost);
    saveBlogPosts(posts);
    return posts;
};

// Update a blog post
export const updateBlogPost = (id, updates) => {
    const posts = getBlogPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        posts[index] = { ...posts[index], ...updates };
        saveBlogPosts(posts);
    }
    return posts;
};

// Delete a blog post
export const deleteBlogPost = (id) => {
    const posts = getBlogPosts().filter(p => p.id !== id);
    saveBlogPosts(posts);
    return posts;
};
