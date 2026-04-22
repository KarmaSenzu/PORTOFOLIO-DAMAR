# 🚀 Panduan Deploy Portfolio

Domain: **projectdmr.devplay.online**

## 📋 Prasyarat

- Node.js v18 atau lebih baru
- npm atau yarn
- Server dengan nginx atau Docker
- Domain sudah terhubung ke Cloudflare

---

## 🔧 Build Project

```bash
# Install dependencies
npm install

# Build untuk production
npm run build
```

Hasil build akan ada di folder `dist/`

---

## 🌐 Deploy dengan Nginx

### 1. Upload folder `dist/` ke server

```bash
scp -r dist/* user@your-server:/var/www/projectdmr.devplay.online/
```

### 2. Konfigurasi Nginx

Buat file `/etc/nginx/sites-available/projectdmr.devplay.online`:

```nginx
server {
    listen 80;
    server_name projectdmr.devplay.online;
    root /var/www/projectdmr.devplay.online;
    index index.html;

    # SPA fallback - PENTING untuk React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 256;
}
```

### 3. Enable site dan restart nginx

```bash
sudo ln -s /etc/nginx/sites-available/projectdmr.devplay.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🐳 Deploy dengan Docker

### 1. Buat Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Buat nginx.conf

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Build dan run Docker

```bash
# Build image
docker build -t portfolio-damar .

# Run container
docker run -d -p 3000:80 --name portfolio portfolio-damar
```

---

## ☁️ Konfigurasi Cloudflare

### DNS Settings

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | projectdmr | YOUR_SERVER_IP | Proxied ✅ |

### SSL/TLS Settings

- Mode: **Full (strict)** (jika server punya SSL)
- Mode: **Flexible** (jika server tidak punya SSL)

### Page Rules (Optional)

```
URL: projectdmr.devplay.online/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
```

---

## 🔐 Admin Panel

- **URL**: https://projectdmr.devplay.online/login
- **Username**: anakilang
- **Password**: Gajah8868

⚠️ **Catatan Keamanan**: Credentials disimpan di frontend. Untuk keamanan lebih, pertimbangkan menggunakan backend authentication di masa depan.

---

## 📁 Struktur File Build

```
dist/
├── index.html          # Entry point
├── assets/
│   ├── *.js           # JavaScript bundles
│   ├── *.css          # CSS bundles
│   └── *.svg          # Images
├── _redirects         # SPA routing rules
├── _headers           # Security headers
└── vite.svg           # Favicon
```

---

## 🔄 Update Deployment

Setiap kali ada perubahan:

```bash
# Di local
npm run build

# Upload ke server
scp -r dist/* user@your-server:/var/www/projectdmr.devplay.online/

# Atau dengan rsync (lebih cepat)
rsync -avz --delete dist/ user@your-server:/var/www/projectdmr.devplay.online/
```

---

## 🐛 Troubleshooting

### Halaman tidak ditemukan setelah refresh

Pastikan nginx/server dikonfigurasi dengan `try_files $uri $uri/ /index.html;`

### CSS/JS tidak loading

Periksa path base di `vite.config.js`, pastikan `base: '/'`

### Cloudflare cache tidak update

```bash
# Purge cache di Cloudflare Dashboard
# Atau gunakan API:
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
```

---

## ✅ Checklist Deploy

- [ ] `npm run build` berhasil tanpa error
- [ ] Upload `dist/` ke server
- [ ] Konfigurasi nginx dengan SPA fallback
- [ ] DNS Cloudflare pointing ke server
- [ ] SSL/TLS mode configured
- [ ] Test semua route (/, /projects, /about, /blog, /login)
- [ ] Test 404 page
- [ ] Test admin login

---

Happy deploying! 🎉
