'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // BASIC AUTH LOGIC: Hardcoded credentials for the demo
    if (email === 'admin@crm.com' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      router.push('/dashboard');
    } else {
      setError('Invalid email or password. Use admin@crm.com / admin123');
    }
  };

  return (
    <div className="flex p-3 items-center justify-center min-h-screen bg-slate-900">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">Global CRM</h1>
        <p className="text-slate-500 text-sm text-center mb-6">Enter your credentials to manage customers</p>
        
        {error && <p className="bg-red-100 text-red-600 p-2 rounded text-xs mb-4 text-center">{error}</p>}
        
        <div className="space-y-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full p-3 border rounded-lg outline-none text-black focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-3 border text-black rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}