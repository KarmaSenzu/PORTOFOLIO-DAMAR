// Hero Slideshow Images
// Ganti URL ini dengan gambar Anda sendiri
// Letakkan gambar di folder public/images/hero/

export const heroImages = [
    // Contoh menggunakan gambar dari public folder:
    // '/images/hero/hero-1.jpg',
    // '/images/hero/hero-2.jpg',
    // '/images/hero/hero-3.jpg',

    // Contoh menggunakan URL external (placeholder):
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=600&fit=crop',
];

// Konfigurasi slideshow
export const slideshowConfig = {
    interval: 2000, // Ganti gambar setiap 2 detik (dalam milliseconds)
    pauseOnHover: true, // Pause saat mouse hover
    showDots: true, // Tampilkan dot indicators
};
