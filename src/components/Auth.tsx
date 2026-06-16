import { useState } from 'react';
import { API } from '../api';
import { setToken } from '../auth';

export function Auth({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const body = mode === 'login' ? { email, password } : { email, password, role };
      const res = await API.post(path, body);
      setToken(res.data.accessToken);
      onAuthed();
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.response?.data?.error ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth-card">
      <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
      <p className="muted">
        {mode === 'login' ? 'Log in to manage your bookings.' : 'Join as a customer or a provider.'}
      </p>
      <form onSubmit={submit}>
        <label>Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" placeholder="min 6 characters" value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
        </label>

        {mode === 'register' && (
          <div className="role-toggle">
            <button type="button" className={role === 'CUSTOMER' ? 'role active' : 'role'}
                    onClick={() => setRole('CUSTOMER')}>I'm a Customer</button>
            <button type="button" className={role === 'PROVIDER' ? 'role active' : 'role'}
                    onClick={() => setRole('PROVIDER')}>I'm a Provider</button>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? '...' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="muted switch">
        {mode === 'login' ? "No account?" : 'Already have one?'}{' '}
        <button className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  );
}
