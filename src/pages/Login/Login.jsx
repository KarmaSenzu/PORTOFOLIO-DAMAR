import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Admin credentials from environment variables
    const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'password123';

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate a small delay for security feel
        setTimeout(() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                // Store auth token in sessionStorage (clears when browser closes)
                sessionStorage.setItem('portfolio_admin_auth', 'authenticated');
                sessionStorage.setItem('portfolio_admin_time', Date.now().toString());
                sessionStorage.setItem('portfolio_admin_user', username);
                navigate('/dashboard');
            } else {
                setError('Username atau password salah. Coba lagi.');
                setPassword('');
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="login-page">
            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="login-header">
                    <div className="login-icon">🔐</div>
                    <h1>Admin Access</h1>
                    <p>Masukkan credentials untuk mengakses dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username..."
                            autoFocus
                            autoComplete="username"
                            disabled={loading}
                        />
                    </div>

                    <div className="login-input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password..."
                            autoComplete="current-password"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <motion.div
                            className="login-error"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading || !username || !password}
                    >
                        {loading ? (
                            <span className="login-spinner" />
                        ) : (
                            <>
                                Masuk
                                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <a href="/" className="login-back">← Kembali ke Portfolio</a>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;