require('dotenv').config();

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Seed data
const adminUser = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

const projects = [
  {
    slug: 'ecommerce-dashboard',
    title_en: 'E-commerce Dashboard',
    title_id: 'Dashboard E-commerce',
    description_en: 'A comprehensive dashboard for managing online store inventory, tracking real-time sales data, and generating automated reports.',
    description_id: 'Dashboard komprehensif untuk mengelola inventori toko online, melacak data penjualan real-time, dan membuat laporan otomatis.',
    about_en: 'This dashboard was conceived to solve a specific problem for small-to-medium e-commerce businesses: data fragmentation. Most shop owners were juggling between Shopify analytics, Google Sheets, and inventory software.\n\nI built this centralized platform to pull data from multiple sources via webhooks and present it in a unified, easy-to-digest interface. The goal was not just to show numbers, but to provide actionable insights like "Low Stock Alerts" and "Best Selling Categories" at a glance.',
    about_id: 'Dashboard ini dibuat untuk memecahkan masalah spesifik bisnis e-commerce kecil-menengah: fragmentasi data. Kebanyakan pemilik toko harus bolak-balik antara Shopify analytics, Google Sheets, dan software inventori.\n\nSaya membangun platform terpusat ini untuk menarik data dari berbagai sumber via webhooks dan menyajikannya dalam interface yang terpadu dan mudah dipahami. Tujuannya bukan hanya menampilkan angka, tapi memberikan insight yang actionable seperti "Peringatan Stok Rendah" dan "Kategori Terlaris" secara sekilas.',
    category: 'web-app',
    role: 'fullstack',
    tech_stack: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Redis', 'AWS S3']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop'
    ]),
    live_url: 'https://demo.example.com',
    repo_url: 'https://github.com/damar/ecommerce-dashboard',
    date: 'Oct 2023',
    duration: '6 Weeks',
    status: 'completed',
    featured: true,
    sort_order: 0,
    case_study_problem_en: 'E-commerce owners were spending hours manually compiling data from different platforms, leading to delayed decisions and missed opportunities.',
    case_study_problem_id: 'Pemilik e-commerce menghabiskan berjam-jam mengompilasi data secara manual dari berbagai platform, menyebabkan keputusan tertunda dan peluang terlewat.',
    case_study_solution_en: 'Built a real-time dashboard with webhook integrations, automated reporting, and intelligent alerts using React, Node.js, and PostgreSQL.',
    case_study_solution_id: 'Membangun dashboard real-time dengan integrasi webhook, pelaporan otomatis, dan alert cerdas menggunakan React, Node.js, dan PostgreSQL.',
    case_study_result_en: 'Reduced reporting time by 80%, increased inventory accuracy to 99.5%, and helped clients identify trends 3x faster.',
    case_study_result_id: 'Mengurangi waktu pelaporan sebesar 80%, meningkatkan akurasi inventori ke 99.5%, dan membantu klien mengidentifikasi tren 3x lebih cepat.',
    challenges: JSON.stringify([
      {
        title: { en: 'Handling Real-Time Websockets', id: 'Menangani Websockets Real-Time' },
        description: {
          en: 'One of the biggest hurdles was ensuring that inventory updates happened in real-time across multiple active sessions without overloading the server. Initial polling methods were too resource-intensive.',
          id: 'Salah satu tantangan terbesar adalah memastikan update inventori terjadi secara real-time di berbagai sesi aktif tanpa membebani server. Metode polling awal terlalu berat untuk resources.'
        },
        solution: {
          en: 'I implemented a custom WebSocket hook using Socket.io on the backend and React Query on the frontend. This allowed for optimistic UI updates while the server confirmed the transaction in the background, resulting in a snappy, app-like feel even on slower connections.',
          id: 'Saya mengimplementasikan custom WebSocket hook menggunakan Socket.io di backend dan React Query di frontend. Ini memungkinkan optimistic UI updates sementara server mengkonfirmasi transaksi di background, menghasilkan feel seperti aplikasi bahkan di koneksi lambat.'
        }
      }
    ]),
    features: JSON.stringify([
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
    ])
  },
  {
    slug: 'health-tracking-app',
    title_en: 'Health Tracking App',
    title_id: 'Aplikasi Pelacak Kesehatan',
    description_en: 'Mobile application for iOS and Android allowing users to track daily fitness goals, monitor nutrition, and sync with wearable devices.',
    description_id: 'Aplikasi mobile untuk iOS dan Android yang memungkinkan pengguna melacak target kebugaran harian, memantau nutrisi, dan sinkron dengan perangkat wearable.',
    about_en: 'A cross-platform mobile app designed to help users maintain healthy habits through intuitive tracking and smart insights.',
    about_id: 'Aplikasi mobile cross-platform yang dirancang untuk membantu pengguna menjaga kebiasaan sehat melalui pelacakan intuitif dan insight cerdas.',
    category: 'mobile',
    role: 'fullstack',
    tech_stack: JSON.stringify(['React Native', 'Firebase', 'HealthKit', 'Google Fit']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop'
    ]),
    live_url: null,
    repo_url: 'https://github.com/damar/health-tracker',
    date: 'Sep 2023',
    duration: '8 Weeks',
    status: 'completed',
    featured: true,
    sort_order: 1,
    case_study_problem_en: 'Users struggled to maintain consistent health tracking across different devices and platforms.',
    case_study_problem_id: 'Pengguna kesulitan mempertahankan pelacakan kesehatan yang konsisten di berbagai perangkat dan platform.',
    case_study_solution_en: 'Built a unified mobile app with seamless wearable integration and cross-platform sync.',
    case_study_solution_id: 'Membangun aplikasi mobile terpadu dengan integrasi wearable seamless dan sinkronisasi cross-platform.',
    case_study_result_en: '10,000+ downloads in first month, 4.8 star rating on App Store.',
    case_study_result_id: '10.000+ unduhan di bulan pertama, rating 4.8 bintang di App Store.',
    challenges: JSON.stringify([]),
    features: JSON.stringify([
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
    ])
  },
  {
    slug: 'fast-cli-tool',
    title_en: 'Fast CLI Tool',
    title_id: 'Tool CLI Cepat',
    description_en: 'A high-performance command line interface tool for developers to scaffold new projects with best practices built-in.',
    description_id: 'Tool command line interface berkinerja tinggi untuk developer scaffolding proyek baru dengan best practices built-in.',
    about_en: 'An open-source CLI tool built in Rust for maximum performance, helping developers bootstrap projects in seconds.',
    about_id: 'Tool CLI open-source yang dibangun dengan Rust untuk performa maksimal, membantu developer bootstrap proyek dalam hitungan detik.',
    category: 'open-source',
    role: 'backend',
    tech_stack: JSON.stringify(['Rust', 'Shell']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop'
    ]),
    live_url: null,
    repo_url: 'https://github.com/damar/fast-cli',
    date: 'Aug 2023',
    duration: '3 Weeks',
    status: 'completed',
    featured: true,
    sort_order: 2,
    case_study_problem_en: 'Existing scaffolding tools were slow and bloated with unnecessary dependencies.',
    case_study_problem_id: 'Tool scaffolding yang ada lambat dan penuh dengan dependencies yang tidak perlu.',
    case_study_solution_en: 'Built a lightning-fast CLI in Rust with minimal dependencies and smart templates.',
    case_study_solution_id: 'Membangun CLI super cepat di Rust dengan dependencies minimal dan template cerdas.',
    case_study_result_en: '500+ GitHub stars, adopted by several indie dev teams.',
    case_study_result_id: '500+ bintang GitHub, diadopsi oleh beberapa tim dev indie.',
    challenges: JSON.stringify([]),
    features: JSON.stringify([])
  },
  {
    slug: 'nexus-design-system',
    title_en: 'Nexus Design System',
    title_id: 'Sistem Desain Nexus',
    description_en: 'An atomic design system for enterprise applications, featuring over 50 accessible components with Storybook documentation.',
    description_id: 'Sistem desain atomik untuk aplikasi enterprise, menampilkan lebih dari 50 komponen aksesibel dengan dokumentasi Storybook.',
    about_en: 'A comprehensive design system built from the ground up with accessibility and developer experience in mind.',
    about_id: 'Sistem desain komprehensif yang dibangun dari nol dengan aksesibilitas dan pengalaman developer dalam pikiran.',
    category: 'design',
    role: 'frontend',
    tech_stack: JSON.stringify(['Figma', 'Storybook', 'React', 'TypeScript']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
    ]),
    live_url: 'https://nexus-design.example.com',
    repo_url: 'https://github.com/damar/nexus-design',
    date: 'Jul 2023',
    duration: '12 Weeks',
    status: 'completed',
    featured: false,
    sort_order: 3,
    case_study_problem_en: 'Enterprise teams lacked consistent, accessible UI components.',
    case_study_problem_id: 'Tim enterprise kekurangan komponen UI yang konsisten dan aksesibel.',
    case_study_solution_en: 'Created a tokenized design system with Figma-to-code pipeline.',
    case_study_solution_id: 'Membuat sistem desain ter-tokenisasi dengan pipeline Figma-to-code.',
    case_study_result_en: 'Reduced design-to-development handoff time by 60%.',
    case_study_result_id: 'Mengurangi waktu handoff desain-ke-development sebesar 60%.',
    challenges: JSON.stringify([]),
    features: JSON.stringify([])
  },
  {
    slug: 'authshield-api',
    title_en: 'AuthShield API',
    title_id: 'API AuthShield',
    description_en: 'A drop-in authentication microservice providing JWT handling, OAuth2 integration, and role-based access control.',
    description_id: 'Microservice autentikasi drop-in yang menyediakan penanganan JWT, integrasi OAuth2, dan kontrol akses berbasis peran.',
    about_en: 'An open-source authentication API that can be deployed as a standalone service or integrated into existing applications.',
    about_id: 'API autentikasi open-source yang dapat di-deploy sebagai layanan standalone atau diintegrasikan ke aplikasi yang ada.',
    category: 'open-source',
    role: 'backend',
    tech_stack: JSON.stringify(['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'
    ]),
    live_url: null,
    repo_url: 'https://github.com/damar/authshield-api',
    date: 'Jun 2023',
    duration: '4 Weeks',
    status: 'completed',
    featured: false,
    sort_order: 4,
    case_study_problem_en: 'Implementing secure authentication from scratch is time-consuming and error-prone.',
    case_study_problem_id: 'Mengimplementasikan autentikasi aman dari nol memakan waktu dan rawan kesalahan.',
    case_study_solution_en: 'Built a battle-tested auth microservice with comprehensive security features.',
    case_study_solution_id: 'Membangun microservice auth teruji dengan fitur keamanan komprehensif.',
    case_study_result_en: 'Used by 20+ startups, 0 security incidents reported.',
    case_study_result_id: 'Digunakan oleh 20+ startup, 0 insiden keamanan dilaporkan.',
    challenges: JSON.stringify([]),
    features: JSON.stringify([])
  },
  {
    slug: 'crypto-analytics',
    title_en: 'Crypto Analytics',
    title_id: 'Analitik Kripto',
    description_en: 'Real-time cryptocurrency visualization tool using WebSockets to display market trends, price alerts, and portfolio tracking.',
    description_id: 'Tool visualisasi cryptocurrency real-time menggunakan WebSockets untuk menampilkan tren pasar, alert harga, dan pelacakan portofolio.',
    about_en: 'A sleek crypto dashboard for traders who want real-time data without the clutter of traditional trading platforms.',
    about_id: 'Dashboard kripto yang sleek untuk trader yang menginginkan data real-time tanpa kekacauan platform trading tradisional.',
    category: 'web-app',
    role: 'frontend',
    tech_stack: JSON.stringify(['Vue.js', 'D3.js', 'WebSocket', 'TradingView']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop'
    ]),
    live_url: 'https://crypto-analytics.example.com',
    repo_url: 'https://github.com/damar/crypto-analytics',
    date: 'May 2023',
    duration: '5 Weeks',
    status: 'completed',
    featured: false,
    sort_order: 5,
    case_study_problem_en: 'Crypto traders needed a simpler, faster way to monitor multiple assets.',
    case_study_problem_id: 'Trader kripto membutuhkan cara lebih sederhana dan cepat untuk memantau berbagai aset.',
    case_study_solution_en: 'Built a minimalist dashboard with real-time WebSocket updates and customizable alerts.',
    case_study_solution_id: 'Membangun dashboard minimalis dengan update WebSocket real-time dan alert yang dapat dikustomisasi.',
    case_study_result_en: '5,000+ active users, 99.9% uptime.',
    case_study_result_id: '5.000+ pengguna aktif, uptime 99.9%.',
    challenges: JSON.stringify([]),
    features: JSON.stringify([])
  }
];

const blogPosts = [
  {
    slug: 'building-scalable-react-apps',
    title_en: 'Building Scalable React Applications',
    title_id: 'Membangun Aplikasi React yang Skalabel',
    excerpt_en: 'Learn the patterns and practices I use to build React applications that scale from MVP to enterprise.',
    excerpt_id: 'Pelajari pola dan praktik yang saya gunakan untuk membangun aplikasi React yang skalabel dari MVP hingga enterprise.',
    content_en: '# Building Scalable React Applications\n\nWhen building React applications that need to scale, there are several patterns and practices that I\'ve found invaluable...\n\n## Project Structure\n\nThe way you organize your code matters. Here\'s my preferred structure:\n\n```\nsrc/\n  components/\n  pages/\n  hooks/\n  utils/\n  services/\n```\n\n## State Management\n\nFor most applications, React Query combined with Context is sufficient...',
    content_id: '# Membangun Aplikasi React yang Skalabel\n\nSaat membangun aplikasi React yang perlu skalabel, ada beberapa pola dan praktik yang saya temukan sangat berharga...\n\n## Struktur Proyek\n\nCara Anda mengorganisir kode itu penting. Berikut struktur yang saya prefer:\n\n```\nsrc/\n  components/\n  pages/\n  hooks/\n  utils/\n  services/\n```\n\n## State Management\n\nUntuk sebagian besar aplikasi, React Query dikombinasikan dengan Context sudah cukup...',
    category: 'tutorials',
    tags: JSON.stringify(['React', 'Architecture', 'Best Practices']),
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    read_time: 8,
    published: true
  },
  {
    slug: 'typescript-tips-tricks',
    title_en: 'TypeScript Tips & Tricks for 2024',
    title_id: 'Tips & Trik TypeScript untuk 2024',
    excerpt_en: 'A collection of TypeScript patterns that have saved me hours of debugging.',
    excerpt_id: 'Kumpulan pola TypeScript yang telah menghemat berjam-jam waktu debugging saya.',
    content_en: '# TypeScript Tips & Tricks\n\nHere are some TypeScript patterns I use daily...',
    content_id: '# Tips & Trik TypeScript\n\nBerikut beberapa pola TypeScript yang saya gunakan sehari-hari...',
    category: 'tips',
    tags: JSON.stringify(['TypeScript', 'JavaScript', 'Development']),
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    read_time: 5,
    published: true
  },
  {
    slug: 'future-of-web-development',
    title_en: 'My Thoughts on the Future of Web Development',
    title_id: 'Pemikiran Saya tentang Masa Depan Web Development',
    excerpt_en: 'Reflections on where I think web development is heading and how to prepare for it.',
    excerpt_id: 'Refleksi tentang kemana menurut saya web development akan menuju dan bagaimana mempersiapkannya.',
    content_en: '# The Future of Web Development\n\nThe web platform continues to evolve at a rapid pace...',
    content_id: '# Masa Depan Web Development\n\nPlatform web terus berkembang dengan pesat...',
    category: 'thoughts',
    tags: JSON.stringify(['Web Development', 'Future', 'Trends']),
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
    read_time: 6,
    published: true
  }
];

const skills = [
  { name: 'React', icon: '⚛️', category: 'frontend', color: '#61DAFB', sort_order: 0 },
  { name: 'Python', icon: '🐍', category: 'backend', color: '#3776AB', sort_order: 1 },
  { name: 'Node.js', icon: '🟢', category: 'backend', color: '#339933', sort_order: 2 },
  { name: 'AWS', icon: '☁️', category: 'devops', color: '#FF9900', sort_order: 3 },
  { name: 'Docker', icon: '🐳', category: 'devops', color: '#2496ED', sort_order: 4 },
  { name: 'TypeScript', icon: '📘', category: 'frontend', color: '#3178C6', sort_order: 5 },
  { name: 'Figma', icon: '🎨', category: 'design', color: '#F24E1E', sort_order: 6 },
  { name: 'Tailwind', icon: '🎐', category: 'frontend', color: '#06B6D4', sort_order: 7 },
  { name: 'PostgreSQL', icon: '🐘', category: 'backend', color: '#4169E1', sort_order: 8 },
  { name: 'MongoDB', icon: '🍃', category: 'backend', color: '#47A248', sort_order: 9 },
  { name: 'GraphQL', icon: '◈', category: 'backend', color: '#E10098', sort_order: 10 },
  { name: 'Git', icon: '📁', category: 'tools', color: '#F05032', sort_order: 11 }
];

const experiences = [
  {
    title_en: 'Senior Frontend Developer',
    title_id: 'Senior Frontend Developer',
    company: 'TechFlow Solutions',
    period_en: '2023 - Present',
    period_id: '2023 - Sekarang',
    description_en: 'Leading the frontend migration to Next.js, improving site performance by 40%, and mentoring junior developers.',
    description_id: 'Memimpin migrasi frontend ke Next.js, meningkatkan performa situs sebesar 40%, dan membimbing developer junior.',
    is_current: true,
    is_education: false,
    sort_order: 0
  },
  {
    title_en: 'Full Stack Developer',
    title_id: 'Full Stack Developer',
    company: 'Creative Agency XYZ',
    period_en: '2020 - 2023',
    period_id: '2020 - 2023',
    description_en: 'Developed custom e-commerce solutions for 20+ clients using React and Node.js. Integrated Stripe and custom CMS solutions.',
    description_id: 'Mengembangkan solusi e-commerce kustom untuk 20+ klien menggunakan React dan Node.js. Mengintegrasikan Stripe dan solusi CMS kustom.',
    is_current: false,
    is_education: false,
    sort_order: 1
  },
  {
    title_en: 'Junior Web Developer',
    title_id: 'Junior Web Developer',
    company: 'StartUp Inc.',
    period_en: '2018 - 2020',
    period_id: '2018 - 2020',
    description_en: 'Collaborated with design teams to implement responsive landing pages. Learned modern CSS workflows and Git version control.',
    description_id: 'Berkolaborasi dengan tim desain untuk mengimplementasikan landing page responsif. Mempelajari workflow CSS modern dan Git version control.',
    is_current: false,
    is_education: false,
    sort_order: 2
  },
  {
    title_en: 'B.S. Computer Science',
    title_id: 'S1 Ilmu Komputer',
    company: 'State University',
    period_en: '2018',
    period_id: '2018',
    description_en: 'Specialized in Human-Computer Interaction and Software Engineering.',
    description_id: 'Spesialisasi dalam Human-Computer Interaction dan Software Engineering.',
    is_current: false,
    is_education: true,
    sort_order: 3
  }
];

const certificates = [
  {
    title_en: 'AWS Certified Developer',
    title_id: 'AWS Certified Developer',
    issuer: 'Amazon Web Services',
    date: 'Jan 2024',
    credential_id: 'AWS-DEV-123456',
    image: 'https://images.unsplash.com/photo-1496469888073-80de12fb9674?w=800&h=600&fit=crop',
    credential_url: 'https://aws.amazon.com/verification/123456',
    sort_order: 0
  },
  {
    title_en: 'Google Cloud Professional',
    title_id: 'Google Cloud Professional',
    issuer: 'Google',
    date: 'Mar 2024',
    credential_id: 'GCP-PRO-789012',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop',
    credential_url: null,
    sort_order: 1
  },
  {
    title_en: 'Meta Frontend Developer',
    title_id: 'Meta Frontend Developer',
    issuer: 'Meta (Coursera)',
    date: 'Jun 2023',
    credential_id: 'META-FE-345678',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    credential_url: 'https://coursera.org/verify/345678',
    sort_order: 2
  },
  {
    title_en: 'Oracle Java Certified',
    title_id: 'Oracle Java Certified',
    issuer: 'Oracle',
    date: 'Sep 2023',
    credential_id: 'ORA-JAVA-901234',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop',
    credential_url: null,
    sort_order: 3
  }
];

const settings = [
  {
    setting_key: 'hero_images',
    setting_value: JSON.stringify([
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=600&fit=crop'
    ])
  },
  {
    setting_key: 'slideshow_config',
    setting_value: JSON.stringify({
      interval: 2000,
      pauseOnHover: true,
      showDots: true
    })
  },
  {
    setting_key: 'hobbies',
    setting_value: JSON.stringify([
      {
        icon: '☕',
        title: { en: 'Coffee Enthusiast', id: 'Pecinta Kopi' },
        description: { en: 'Brewing the perfect V60', id: 'Menyeduh V60 sempurna' },
        color: '#D97706'
      },
      {
        icon: '🏔️',
        title: { en: 'Hiking & Nature', id: 'Hiking & Alam' },
        description: { en: 'Weekend trail explorer', id: 'Penjelajah trail akhir pekan' },
        color: '#059669'
      },
      {
        icon: '🎮',
        title: { en: 'Gaming', id: 'Gaming' },
        description: { en: 'RPG and strategy games', id: 'Game RPG dan strategi' },
        color: '#7C3AED'
      }
    ])
  }
];

async function seed() {
  let connection;

  try {
    // Connect without database to create it if needed
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    const dbName = process.env.DB_NAME || 'portfolio_damar';

    // Create database if not exists
    console.log(`Creating database "${dbName}" if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.changeUser({ database: dbName });

    // Run migrations
    console.log('Running migrations...');
    const sqlPath = path.join(__dirname, 'migrations', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      await connection.query(statement);
    }
    console.log('Tables created successfully.');

    // Seed admin user
    console.log('Seeding admin user...');
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    await connection.query(
      'INSERT INTO users (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = ?',
      [adminUser.username, hashedPassword, hashedPassword]
    );
    console.log(`Admin user "${adminUser.username}" seeded.`);

    // Seed projects
    console.log('Seeding projects...');
    for (const project of projects) {
      const columns = Object.keys(project);
      const placeholders = columns.map(() => '?').join(', ');
      const values = columns.map(col => project[col]);

      await connection.query(
        `INSERT INTO projects (${columns.join(', ')}) VALUES (${placeholders})
         ON DUPLICATE KEY UPDATE title_en = VALUES(title_en)`,
        values
      );
    }
    console.log(`${projects.length} projects seeded.`);

    // Seed blog posts
    console.log('Seeding blog posts...');
    for (const post of blogPosts) {
      const columns = Object.keys(post);
      const placeholders = columns.map(() => '?').join(', ');
      const values = columns.map(col => post[col]);

      await connection.query(
        `INSERT INTO blog_posts (${columns.join(', ')}) VALUES (${placeholders})
         ON DUPLICATE KEY UPDATE title_en = VALUES(title_en)`,
        values
      );
    }
    console.log(`${blogPosts.length} blog posts seeded.`);

    // Seed skills
    console.log('Seeding skills...');
    await connection.query('DELETE FROM skills');
    for (const skill of skills) {
      await connection.query(
        'INSERT INTO skills (name, icon, category, color, sort_order) VALUES (?, ?, ?, ?, ?)',
        [skill.name, skill.icon, skill.category, skill.color, skill.sort_order]
      );
    }
    console.log(`${skills.length} skills seeded.`);

    // Seed experiences
    console.log('Seeding experiences...');
    await connection.query('DELETE FROM experiences');
    for (const exp of experiences) {
      await connection.query(
        `INSERT INTO experiences (title_en, title_id, company, period_en, period_id, description_en, description_id, is_current, is_education, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [exp.title_en, exp.title_id, exp.company, exp.period_en, exp.period_id, exp.description_en, exp.description_id, exp.is_current, exp.is_education, exp.sort_order]
      );
    }
    console.log(`${experiences.length} experiences seeded.`);

    // Seed certificates
    console.log('Seeding certificates...');
    await connection.query('DELETE FROM certificates');
    for (const cert of certificates) {
      await connection.query(
        `INSERT INTO certificates (title_en, title_id, issuer, date, credential_id, image, credential_url, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [cert.title_en, cert.title_id, cert.issuer, cert.date, cert.credential_id, cert.image, cert.credential_url, cert.sort_order]
      );
    }
    console.log(`${certificates.length} certificates seeded.`);

    // Seed settings
    console.log('Seeding settings...');
    for (const setting of settings) {
      await connection.query(
        `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [setting.setting_key, setting.setting_value, setting.setting_value]
      );
    }
    console.log(`${settings.length} settings seeded.`);

    // Create uploads directory
    const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    console.log('Uploads directory ensured.');

    console.log('\nSeed completed successfully!');
    console.log('---');
    console.log(`Admin login: ${adminUser.username} / ${adminUser.password}`);
    console.log('---');

  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

seed();
