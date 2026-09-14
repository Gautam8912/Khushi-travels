import React, { useState } from 'react';
import { X, Lock, Mail, KeyRound, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ownerLogin } from '../services/api.js';

export default function OwnerLoginModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAutoFill = () => {
    setEmail('admin@khushitravels.com');
    setPassword('Khushi@2026');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await ownerLogin(email.trim(), password);
      if (data.token) {
        localStorage.setItem('khushi_owner_token', data.token);
        localStorage.setItem('khushi_owner_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl text-slate-900 my-8">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Owner Login
              </h3>
              <p className="text-[11px] text-slate-500">
                Khushi Travels Dashboard
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Quick Helper */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between text-[11px]">
            <div>
              <p className="font-bold text-amber-900">Default Credentials:</p>
              <p className="text-amber-800 font-mono">admin@khushitravels.com</p>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="bg-slate-900 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] hover:bg-slate-800"
            >
              Auto Fill
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@khushitravels.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition-colors disabled:opacity-50 mt-1"
            >
              {loading ? 'Logging In...' : 'Login to Dashboard'}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
