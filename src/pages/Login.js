import React, { useState } from 'react';
import BASE_URL from '../api';
import '../styles/login.css';

export default function Login({ onLogin }) {
  // Use 'email' to match your MongoDB User Model
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Sending email
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('auth', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Cannot connect to server. Is backend running?');
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h2>Minilec Legend Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email (e.g. abc@mini.com)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}