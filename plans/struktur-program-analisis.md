# 📋 Analisis Struktur Program - Portfolio Damar

## Ringkasan Proyek

| Item | Detail |
|------|--------|
| **Nama** | Portfolio Damar |
| **Tech Stack** | React 19 + Vite 7 |
| **Tipe** | Single Page Application - Website Portfolio Personal |
| **Multi-bahasa** | Indonesia & English |

---

## 🏗️ Arsitektur Folder

```
PORTOFOLIO DAMAR/
├── 📄 Configuration Files
│   ├── package.json          # Dependencies & scripts
│   ├── vite.config.js        # Vite build configuration
│   ├── eslint.config.js      # Linting rules
│   ├── .env / .env.example   # Environment variables
│   └── index.html            # Entry HTML
│
├── 📁 public/                # Static assets
│   ├── logo.png
│   ├── _headers & _redirects # Deployment config - Netlify/Cloudflare
│   └── images/
│
└── 📁 src/                   # Source code
    ├── main.jsx              # React entry point
    ├── App.jsx               # Main router & layout
    │
    ├── 📁 components/        # Reusable UI Components
    │   ├── Button/
    │   ├── FilterTabs/
    │   ├── Footer/
    │   ├── ImageUpload/
    │   ├── Lightbox/
    │   ├── Modal/
    │   ├── Navbar/
    │   ├── ProjectCard/
    │   ├── SkillCard/
    │   └── Timeline/
    │
    ├── 📁 pages/             # Route Pages
    │   ├── Home/             # Landing page
    │   ├── Projects/         # Project list
    │   ├── ProjectDetail/    # Individual project
    │   ├── About/            # About me
    │   ├── Blog/             # Blog list
    │   ├── BlogPost/         # Individual blog post
    │   ├── Admin/            # Admin panel - hidden
    │   ├── Login/            # Login page - hidden
    │   ├── Dashboard/        # Dashboard - hidden
    │   └── NotFound/         # 404 page
    │
    ├── 📁 data/              # Static data & content
    │   ├── blog.js
    │   ├── certificates.js
    │   ├── heroImages.js
    │   ├── projects.js
    │   ├── skills.js
    │   └── locales/          # i18n translations
    │       ├── en.json
    │       └── id.json
    │
    ├── 📁 hooks/             # Custom React Hooks
    │   ├── useAnalytics.js
    │   ├── useLocalStorage.js
    │   └── useScrollAnimation.js
    │
    ├── 📁 styles/            # Global CSS
    │   ├── variables.css
    │   ├── animations.css
    │   └── index.css
    │
    ├── 📁 utils/             # Utility functions
    │   ├── analytics.js
    │   ├── helpers.js
    │   └── i18n.js
    │
    └── 📁 context/           # React Context - state management
```

---

## 🔧 Fitur Utama

| Fitur | Library/Teknologi |
|-------|-------------------|
| **Routing** | React Router DOM v7 |
| **Animasi** | Framer Motion v12 |
| **Multi-bahasa** | i18next + react-i18next |
| **Lazy Loading** | React.lazy + Suspense |
| **Build Tool** | Vite dengan code splitting |

---

## 🛣️ Struktur Routing

```mermaid
graph TD
    A[App.jsx] --> B[PublicLayout]
    A --> C[Hidden Admin Pages]
    
    B --> D[/ - Home]
    B --> E[/projects - Projects List]
    B --> F[/projects/:id - Project Detail]
    B --> G[/about - About Page]
    B --> H[/blog - Blog List]
    B --> I[/blog/:id - Blog Post]
    
    C --> J[/login - Login]
    C --> K[/dashboard - Dashboard]
    
    A --> L[/* - 404 Not Found]
```

### Daftar Routes:

| Route | Component | Layout | Status |
|-------|-----------|--------|--------|
| `/` | Home | PublicLayout | Public |
| `/projects` | Projects | PublicLayout | Public |
| `/projects/:id` | ProjectDetail | PublicLayout | Public |
| `/about` | About | PublicLayout | Public |
| `/blog` | Blog | PublicLayout | Public |
| `/blog/:id` | BlogPost | PublicLayout | Public |
| `/login` | Login | None | Hidden |
| `/dashboard` | Dashboard | None | Hidden |
| `*` | NotFound | None | Public |

---

## 📦 Dependencies

### Production Dependencies
```json
{
  "framer-motion": "^12.29.2",
  "i18next": "^25.8.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-i18next": "^16.5.3",
  "react-router-dom": "^7.13.0"
}
```

### Dev Dependencies
```json
{
  "@eslint/js": "^9.39.1",
  "@types/react": "^19.2.5",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^5.1.1",
  "eslint": "^9.39.1",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "globals": "^16.5.0",
  "vite": "^7.2.4"
}
```

---

## ⚡ Optimisasi Build

Vite dikonfigurasi dengan **manual chunks** untuk code splitting:

```javascript
manualChunks: {
  vendor: ['react', 'react-dom', 'react-router-dom'],
  animations: ['framer-motion'],
  i18n: ['i18next', 'react-i18next']
}
```

---

## 🎨 Komponen UI

### Reusable Components
1. **Button** - Komponen tombol reusable
2. **FilterTabs** - Tab filter untuk project/blog
3. **Footer** - Footer website
4. **ImageUpload** - Upload gambar untuk admin
5. **Lightbox** - Image viewer modal
6. **Modal** - Generic modal component
7. **Navbar** - Navigation bar
8. **ProjectCard** - Card untuk menampilkan project
9. **SkillCard** - Card untuk menampilkan skill
10. **Timeline** - Timeline component untuk experience

---

## 🪝 Custom Hooks

1. **useAnalytics** - Tracking analytics
2. **useLocalStorage** - Persist data ke localStorage
3. **useScrollAnimation** - Scroll-based animations

---

## 📊 Data Files

| File | Fungsi |
|------|--------|
| `blog.js` | Data artikel blog |
| `certificates.js` | Data sertifikat |
| `heroImages.js` | Gambar untuk hero section |
| `projects.js` | Data project portfolio |
| `skills.js` | Data skills/keahlian |
| `locales/en.json` | Terjemahan bahasa Inggris |
| `locales/id.json` | Terjemahan bahasa Indonesia |

---

## 🚀 Scripts

```bash
npm run dev      # Start development server - port 3000
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## 📝 Kesimpulan

Portfolio ini adalah **Website Portfolio Personal Modern** dengan arsitektur yang terorganisir dengan baik menggunakan:
- ✅ Component-based architecture
- ✅ Lazy loading untuk performa
- ✅ Multi-bahasa support
- ✅ Hidden admin area untuk manajemen konten
- ✅ Code splitting untuk optimisasi bundle size
- ✅ CSS Modules per component
