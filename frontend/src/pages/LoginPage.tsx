import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      const role = useAuthStore.getState().user?.role;
      navigate(`/${role}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#12100c]">
      <div className="bg-espresso border border-mocha/30 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-2xl">☕</span>
          <h1 className="text-2xl font-extrabold text-cream tracking-tight">POS Coffee</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-4 py-3 text-milk placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-caramen transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-4 py-3 text-milk placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-caramen transition-all"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-caramen text-white py-3 rounded-xl hover:bg-caramen-hover transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed font-medium active:scale-[0.98]"
          >
            {isLoading ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
