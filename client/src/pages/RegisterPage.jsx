import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#00A884] flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.5 3.53 1.36 5L2 22l5.09-1.33C8.5 21.5 10.2 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
            </svg>
          </div>
          <h1 className="text-xl font-medium text-[#111B21]">Create an account</h1>
          <p className="text-sm text-[#667781] mt-1">Join and start chatting</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-[#667781] mb-1 block">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884] transition-colors"
                placeholder="yourname"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#667781] mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#667781] mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884] transition-colors"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#00A884] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#008f6f] transition-colors disabled:opacity-60 mt-1"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#667781] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00A884] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;