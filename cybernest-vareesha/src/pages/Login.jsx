  // src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      localStorage.setItem('cybernest_auth_token', 'mock_token');
      localStorage.setItem('cybernest_user_data', JSON.stringify({ email, role: 'Super Admin' }));
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(51, 65, 85, 0.1) 25%, rgba(51, 65, 85, 0.1) 26%, transparent 27%, transparent 74%, rgba(51, 65, 85, 0.1) 75%, rgba(51, 65, 85, 0.1) 76%, transparent 77%, transparent),
                              linear-gradient(90deg, transparent 24%, rgba(51, 65, 85, 0.1) 25%, rgba(51, 65, 85, 0.1) 26%, transparent 27%, transparent 74%, rgba(51, 65, 85, 0.1) 75%, rgba(51, 65, 85, 0.1) 76%, transparent 77%, transparent)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-50 text-center mb-2">CyberNest MDM</h1>
          <p className="text-xs text-slate-500 text-center mb-6">Admin Authorization Portal</p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cybernest.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-50 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-50 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-slate-800/30 border border-slate-700 rounded-lg text-xs text-slate-400">
            <p className="font-medium text-slate-50 mb-1">Demo Credentials:</p>
            <p className="font-mono text-slate-500">Email: admin@cybernest.com</p>
            <p className="font-mono text-slate-500">Password: any password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
