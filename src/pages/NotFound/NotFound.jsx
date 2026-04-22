import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found">
            <motion.div
                className="not-found__content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="not-found__icon">🔍</div>
                <h1 className="not-found__code">404</h1>
                <h2 className="not-found__title">Halaman Tidak Ditemukan</h2>
                <p className="not-found__description">
                    Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                </p>
                <div className="not-found__actions">
                    <Link to="/" className="not-found__btn not-found__btn--primary">
                        🏠 Kembali ke Home
                    </Link>
                    <Link to="/projects" className="not-found__btn">
                        📁 Lihat Projects
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
