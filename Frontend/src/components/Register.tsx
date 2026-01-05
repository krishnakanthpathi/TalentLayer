import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setError('');
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to create account.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 flex flex-col">
                <div className="flex justify-center mb-6">
                    <Logo className="h-12 w-12 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
                <p className="text-gray-400 text-center mb-8">Join the network today</p>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
