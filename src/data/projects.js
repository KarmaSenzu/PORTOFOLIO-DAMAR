// Sample projects data
// This will be managed via admin panel and stored in localStorage

export const defaultProjects = [
    {
        id: 'ecommerce-dashboard',
        title: {
            en: 'E-commerce Dashboard',
            id: 'Dashboard E-commerce'
        },
        description: {
            en: 'A comprehensive dashboard for managing online store inventory, tracking real-time sales data, and generating automated reports.',
            id: 'Dashboard komprehensif untuk mengelola inventori toko online, melacak data penjualan real-time, dan membuat laporan otomatis.'
        },
        category: 'web-app',
        role: 'fullstack',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Redis', 'AWS S3'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop'
        ],
        liveUrl: 'https://demo.example.com',
        repoUrl: 'https://github.com/damar/ecommerce-dashboard',
        date: 'Oct 2023',
        duration: '6 Weeks',
        status: 'completed',
        featured: true,
        about: {
            en: 'This dashboard was conceived to solve a specific problem for small-to-medium e-commerce businesses: data fragmentation. Most shop owners were juggling between Shopify analytics, Google Sheets, and inventory software.\n\nI built this centralized platform to pull data from multiple sources via webhooks and present it in a unified, easy-to-digest interface. The goal was not just to show numbers, but to provide actionable insights like "Low Stock Alerts" and "Best Selling Categories" at a glance.',
            id: 'Dashboard ini dibuat untuk memecahkan masalah spesifik bisnis e-commerce kecil-menengah: fragmentasi data. Kebanyakan pemilik toko harus bolak-balik antara Shopify analytics, Google Sheets, dan software inventori.\n\nSaya membangun platform terpusat ini untuk menarik data dari berbagai sumber via webhooks dan menyajikannya dalam interface yang terpadu dan mudah dipahami. Tujuannya bukan hanya menampilkan angka, tapi memberikan insight yang actionable seperti "Peringatan Stok Rendah" dan "Kategori Terlaris" secara sekilas.'
        },
        caseStudy: {
            problem: {
                en: 'E-commerce owners were spending hours manually compiling data from different platforms, leading to delayed decisions and missed opportunities.',
                id: 'Pemilik e-commerce menghabiskan berjam-jam mengompilasi data secara manual dari berbagai platform, menyebabkan keputusan tertunda dan peluang terlewat.'
            },
            solution: {
                en: 'Built a real-time dashboard with webhook integrations, automated reporting, and intelligent alerts using React, Node.js, and PostgreSQL.',
                id: 'Membangun dashboard real-time dengan integrasi webhook, pelaporan otomatis, dan alert cerdas menggunakan React, Node.js, dan PostgreSQL.'
            },
            result: {
                en: 'Reduced reporting time by 80%, increased inventory accuracy to 99.5%, and helped clients identify trends 3x faster.',
                id: 'Mengurangi waktu pelaporan sebesar 80%, meningkatkan akurasi inventori ke 99.5%, dan membantu klien mengidentifikasi tren 3x lebih cepat.'
            }
        },
        challenges: [
            {
                title: {
                    en: 'Handling Real-Time Websockets',
                    id: 'Menangani Websockets Real-Time'
                },
                description: {
                    en: 'One of the biggest hurdles was ensuring that inventory updates happened in real-time across multiple active sessions without overloading the server. Initial polling methods were too resource-intensive.',
                    id: 'Salah satu tantangan terbesar adalah memastikan update inventori terjadi secara real-time di berbagai sesi aktif tanpa membebani server. Metode polling awal terlalu berat untuk resources.'
                },
                solution: {
                    en: 'I implemented a custom WebSocket hook using Socket.io on the backend and React Query on the frontend. This allowed for optimistic UI updates while the server confirmed the transaction in the background, resulting in a snappy, app-like feel even on slower connections.',
                    id: 'Saya mengimplementasikan custom WebSocket hook menggunakan Socket.io di backend dan React Query di frontend. Ini memungkinkan optimistic UI updates sementara server mengkonfirmasi transaksi di background, menghasilkan feel seperti aplikasi bahkan di koneksi lambat.'
                }
            }
        ],
        features: [
            {
                icon: '📊',
                title: { en: 'Live Sales Tracking', id: 'Pelacakan Penjualan Live' },
                description: { en: 'Updates instantly as orders are placed via webhook integration.', id: 'Update instan saat pesanan masuk via integrasi webhook.' }
            },
            {
                icon: '📦',
                title: { en: 'Inventory Management', id: 'Manajemen Inventori' },
                description: { en: 'Bulk edit tools and low-stock email notifications.', id: 'Alat edit massal dan notifikasi email stok rendah.' }
            },
            {
                icon: '📈',
                title: { en: 'Exportable Reports', id: 'Laporan Ekspor' },
                description: { en: 'One-click CSV and PDF exports for accounting purposes.', id: 'Ekspor CSV dan PDF sekali klik untuk keperluan akuntansi.' }
            },
            {
                icon: '🌙',
                title: { en: 'Dark/Light Mode', id: 'Mode Gelap/Terang' },
                description: { en: 'System preference detection and manual toggle.', id: 'Deteksi preferensi sistem dan toggle manual.' }
            }
        ]
    },
    {
        id: 'health-tracking-app',
        title: {
            en: 'Health Tracking App',
            id: 'Aplikasi Pelacak Kesehatan'
        },
        description: {
            en: 'Mobile application for iOS and Android allowing users to track daily fitness goals, monitor nutrition, and sync with wearable devices.',
            id: 'Aplikasi mobile untuk iOS dan Android yang memungkinkan pengguna melacak target kebugaran harian, memantau nutrisi, dan sinkron dengan perangkat wearable.'
        },
        category: 'mobile',
        role: 'fullstack',
        techStack: ['React Native', 'Firebase', 'HealthKit', 'Google Fit'],
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop'
        ],
        liveUrl: null,
        repoUrl: 'https://github.com/damar/health-tracker',
        date: 'Sep 2023',
        duration: '8 Weeks',
        status: 'completed',
        featured: true,
        about: {
            en: 'A cross-platform mobile app designed to help users maintain healthy habits through intuitive tracking and smart insights.',
            id: 'Aplikasi mobile cross-platform yang dirancang untuk membantu pengguna menjaga kebiasaan sehat melalui pelacakan intuitif dan insight cerdas.'
        },
        caseStudy: {
            problem: {
                en: 'Users struggled to maintain consistent health tracking across different devices and platforms.',
                id: 'Pengguna kesulitan mempertahankan pelacakan kesehatan yang konsisten di berbagai perangkat dan platform.'
            },
            solution: {
                en: 'Built a unified mobile app with seamless wearable integration and cross-platform sync.',
                id: 'Membangun aplikasi mobile terpadu dengan integrasi wearable seamless dan sinkronisasi cross-platform.'
            },
            result: {
                en: '10,000+ downloads in first month, 4.8 star rating on App Store.',
                id: '10.000+ unduhan di bulan pertama, rating 4.8 bintang di App Store.'
            }
        },
        challenges: [],
        features: [
            {
                icon: '💪',
                title: { en: 'Workout Tracking', id: 'Pelacakan Olahraga' },
                description: { en: 'Track exercises with rep counting and form tips.', id: 'Lacak latihan dengan penghitungan rep dan tips form.' }
            },
            {
                icon: '🍎',
                title: { en: 'Nutrition Log', id: 'Log Nutrisi' },
                description: { en: 'Barcode scanner and meal planning.', id: 'Pemindai barcode dan perencanaan makanan.' }
            }
        ]
    },
    {
        id: 'fast-cli-tool',
        title: {
            en: 'Fast CLI Tool',
            id: 'Tool CLI Cepat'
        },
        description: {
            en: 'A high-performance command line interface tool for developers to scaffold new projects with best practices built-in.',
            id: 'Tool command line interface berkinerja tinggi untuk developer scaffolding proyek baru dengan best practices built-in.'
        },
        category: 'open-source',
        role: 'backend',
        techStack: ['Rust', 'Shell'],
        image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop'
        ],
        liveUrl: null,
        repoUrl: 'https://github.com/damar/fast-cli',
        date: 'Aug 2023',
        duration: '3 Weeks',
        status: 'completed',
        featured: true,
        about: {
            en: 'An open-source CLI tool built in Rust for maximum performance, helping developers bootstrap projects in seconds.',
            id: 'Tool CLI open-source yang dibangun dengan Rust untuk performa maksimal, membantu developer bootstrap proyek dalam hitungan detik.'
        },
        caseStudy: {
            problem: {
                en: 'Existing scaffolding tools were slow and bloated with unnecessary dependencies.',
                id: 'Tool scaffolding yang ada lambat dan penuh dengan dependencies yang tidak perlu.'
            },
            solution: {
                en: 'Built a lightning-fast CLI in Rust with minimal dependencies and smart templates.',
                id: 'Membangun CLI super cepat di Rust dengan dependencies minimal dan template cerdas.'
            },
            result: {
                en: '500+ GitHub stars, adopted by several indie dev teams.',
                id: '500+ bintang GitHub, diadopsi oleh beberapa tim dev indie.'
            }
        },
        challenges: [],
        features: []
    },
    {
        id: 'nexus-design-system',
        title: {
            en: 'Nexus Design System',
            id: 'Sistem Desain Nexus'
        },
        description: {
            en: 'An atomic design system for enterprise applications, featuring over 50 accessible components with Storybook documentation.',
            id: 'Sistem desain atomik untuk aplikasi enterprise, menampilkan lebih dari 50 komponen aksesibel dengan dokumentasi Storybook.'
        },
        category: 'design',
        role: 'frontend',
        techStack: ['Figma', 'Storybook', 'React', 'TypeScript'],
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
        ],
        liveUrl: 'https://nexus-design.example.com',
        repoUrl: 'https://github.com/damar/nexus-design',
        date: 'Jul 2023',
        duration: '12 Weeks',
        status: 'completed',
        featured: false,
        about: {
            en: 'A comprehensive design system built from the ground up with accessibility and developer experience in mind.',
            id: 'Sistem desain komprehensif yang dibangun dari nol dengan aksesibilitas dan pengalaman developer dalam pikiran.'
        },
        caseStudy: {
            problem: {
                en: 'Enterprise teams lacked consistent, accessible UI components.',
                id: 'Tim enterprise kekurangan komponen UI yang konsisten dan aksesibel.'
            },
            solution: {
                en: 'Created a tokenized design system with Figma-to-code pipeline.',
                id: 'Membuat sistem desain ter-tokenisasi dengan pipeline Figma-to-code.'
            },
            result: {
                en: 'Reduced design-to-development handoff time by 60%.',
                id: 'Mengurangi waktu handoff desain-ke-development sebesar 60%.'
            }
        },
        challenges: [],
        features: []
    },
    {
        id: 'authshield-api',
        title: {
            en: 'AuthShield API',
            id: 'API AuthShield'
        },
        description: {
            en: 'A drop-in authentication microservice providing JWT handling, OAuth2 integration, and role-based access control.',
            id: 'Microservice autentikasi drop-in yang menyediakan penanganan JWT, integrasi OAuth2, dan kontrol akses berbasis peran.'
        },
        category: 'open-source',
        role: 'backend',
        techStack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'
        ],
        liveUrl: null,
        repoUrl: 'https://github.com/damar/authshield-api',
        date: 'Jun 2023',
        duration: '4 Weeks',
        status: 'completed',
        featured: false,
        about: {
            en: 'An open-source authentication API that can be deployed as a standalone service or integrated into existing applications.',
            id: 'API autentikasi open-source yang dapat di-deploy sebagai layanan standalone atau diintegrasikan ke aplikasi yang ada.'
        },
        caseStudy: {
            problem: {
                en: 'Implementing secure authentication from scratch is time-consuming and error-prone.',
                id: 'Mengimplementasikan autentikasi aman dari nol memakan waktu dan rawan kesalahan.'
            },
            solution: {
                en: 'Built a battle-tested auth microservice with comprehensive security features.',
                id: 'Membangun microservice auth teruji dengan fitur keamanan komprehensif.'
            },
            result: {
                en: 'Used by 20+ startups, 0 security incidents reported.',
                id: 'Digunakan oleh 20+ startup, 0 insiden keamanan dilaporkan.'
            }
        },
        challenges: [],
        features: []
    },
    {
        id: 'crypto-analytics',
        title: {
            en: 'Crypto Analytics',
            id: 'Analitik Kripto'
        },
        description: {
            en: 'Real-time cryptocurrency visualization tool using WebSockets to display market trends, price alerts, and portfolio tracking.',
            id: 'Tool visualisasi cryptocurrency real-time menggunakan WebSockets untuk menampilkan tren pasar, alert harga, dan pelacakan portofolio.'
        },
        category: 'web-app',
        role: 'frontend',
        techStack: ['Vue.js', 'D3.js', 'WebSocket', 'TradingView'],
        image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop'
        ],
        liveUrl: 'https://crypto-analytics.example.com',
        repoUrl: 'https://github.com/damar/crypto-analytics',
        date: 'May 2023',
        duration: '5 Weeks',
        status: 'completed',
        featured: false,
        about: {
            en: 'A sleek crypto dashboard for traders who want real-time data without the clutter of traditional trading platforms.',
            id: 'Dashboard kripto yang sleek untuk trader yang menginginkan data real-time tanpa kekacauan platform trading tradisional.'
        },
        caseStudy: {
            problem: {
                en: 'Crypto traders needed a simpler, faster way to monitor multiple assets.',
                id: 'Trader kripto membutuhkan cara lebih sederhana dan cepat untuk memantau berbagai aset.'
            },
            solution: {
                en: 'Built a minimalist dashboard with real-time WebSocket updates and customizable alerts.',
                id: 'Membangun dashboard minimalis dengan update WebSocket real-time dan alert yang dapat dikustomisasi.'
            },
            result: {
                en: '5,000+ active users, 99.9% uptime.',
                id: '5.000+ pengguna aktif, uptime 99.9%.'
            }
        },
        challenges: [],
        features: []
    }
];

// Helper function to get projects from localStorage or use defaults
export const getProjects = () => {
    const stored = localStorage.getItem('portfolio-projects');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return defaultProjects;
        }
    }
    return defaultProjects;
};

// Save projects to localStorage
export const saveProjects = (projects) => {
    localStorage.setItem('portfolio-projects', JSON.stringify(projects));
};

// Add a new project
export const addProject = (project) => {
    const projects = getProjects();
    const newProject = {
        ...project,
        id: project.id || `project-${Date.now()}`
    };
    projects.unshift(newProject);
    saveProjects(projects);
    return projects;
};

// Update a project
export const updateProject = (id, updates) => {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
        projects[index] = { ...projects[index], ...updates };
        saveProjects(projects);
    }
    return projects;
};

// Delete a project
export const deleteProject = (id) => {
    const projects = getProjects().filter(p => p.id !== id);
    saveProjects(projects);
    return projects;
};
