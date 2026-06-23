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
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4 shadow-lg border border-cream-dark">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-bronze rounded-xl flex items-center justify-center">
            <i className="fas fa-leaf text-white text-sm" />
          </div>
          <div>
            <h1 className="font-bold text-espresso text-lg leading-tight tracking-tight">Flo Coffee Roastery</h1>
            <p className="text-[10px] text-gray-500 -mt-0.5">Coffee · Roastery</p>
          </div>
        </div>

        {error && (
          <div className="bg-coral-light border border-coral/20 text-coral px-4 py-3 rounded-2xl mb-4 text-sm flex items-center gap-2">
            <i className="fas fa-exclamation-circle" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@flocoffee.com"
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bronze/20 focus:border-bronze/30 transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bronze/20 focus:border-bronze/30 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-bronze hover:bg-bronze-dark text-white py-3.5 rounded-2xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-sm active:scale-[0.98] shadow-lg shadow-bronze/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <><i className="fas fa-spinner fa-spin" /> Memproses...</>
            ) : (
              <><i className="fas fa-arrow-right-to-bracket" /> Masuk</>
            )}
          </button>
        </form>

        {import.meta.env.DEV && (
          <p className="text-xs text-gray-400 text-center mt-6">
            Demo: admin@flocoffee.com / password
          </p>
        )}
      </div>
    </div>
  );
}
