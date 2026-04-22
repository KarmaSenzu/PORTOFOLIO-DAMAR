// Certificates Data
// Ganti dengan sertifikat Anda sendiri
// Letakkan gambar sertifikat di folder public/images/certificates/

export const certificates = [
    {
        id: 'cert-1',
        title: {
            en: 'AWS Certified Developer',
            id: 'AWS Certified Developer'
        },
        issuer: 'Amazon Web Services',
        date: 'Jan 2024',
        credentialId: 'AWS-DEV-123456',
        // Ganti dengan gambar sertifikat Anda:
        image: 'https://images.unsplash.com/photo-1496469888073-80de12fb9674?w=800&h=600&fit=crop',
        // URL verifikasi credential (opsional):
        credentialUrl: 'https://aws.amazon.com/verification/123456'
    },
    {
        id: 'cert-2',
        title: {
            en: 'Google Cloud Professional',
            id: 'Google Cloud Professional'
        },
        issuer: 'Google',
        date: 'Mar 2024',
        credentialId: 'GCP-PRO-789012',
        image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop',
        credentialUrl: null
    },
    {
        id: 'cert-3',
        title: {
            en: 'Meta Frontend Developer',
            id: 'Meta Frontend Developer'
        },
        issuer: 'Meta (Coursera)',
        date: 'Jun 2023',
        credentialId: 'META-FE-345678',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
        credentialUrl: 'https://coursera.org/verify/345678'
    },
    {
        id: 'cert-4',
        title: {
            en: 'Oracle Java Certified',
            id: 'Oracle Java Certified'
        },
        issuer: 'Oracle',
        date: 'Sep 2023',
        credentialId: 'ORA-JAVA-901234',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop',
        credentialUrl: null
    }
];
