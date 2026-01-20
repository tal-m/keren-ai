import React, { useState } from 'react';
import { apiPost } from '../api';
import { useAuth } from '../auth';
import { useNavigate } from 'react-router-dom';

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setconfirmedPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === 'register' && password !== confirmedPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/auth/register';
      const body =
        mode === 'login'
          ? { email, password }
          : { email, password, confirmedPassword: confirmedPassword };

      const result = await apiPost(endpoint, body);

      if (result.accessToken && result.refreshToken) {
        login(result.accessToken, result.refreshToken);

        // After login or register, check if the user has a profile
        const profileRes = await fetch('http://localhost:4003/api/connectors/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${result.accessToken}`,
          },
        });

        if (profileRes.ok) {
          // Profile exists → Go to Discovery
          navigate('/discovery');
        } else if (profileRes.status === 404) {
          // No profile → Go to Create Profile
          navigate('/create-profile');
        } else {
          throw new Error('Unexpected error while checking user profile');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l-lg font-semibold border-r border-indigo-200 ${
            mode === 'login' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
          }`}
          onClick={() => setMode('login')}
        >
          Sign In
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg font-semibold ${
            mode === 'register' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
          }`}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {mode === 'register' && (
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={confirmedPassword}
            onChange={(e) => setconfirmedPassword(e.target.value)}
            required
          />
        )}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading
            ? mode === 'login'
              ? 'Signing In...'
              : 'Registering...'
            : mode === 'login'
            ? 'Sign In'
            : 'Register'}
        </button>
      </form>
      {message && <div className="mt-4 text-green-600">{message}</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
};

export default AuthForm;