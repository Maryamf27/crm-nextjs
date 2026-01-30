'use client';
import { useState } from 'react'; // Added useState
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true); // State to control visibility

  if (pathname === '/') return null;

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Customers', href: '/customers', icon: '👥' },
    { name: 'Team Members', href: '/members', icon: '🆔' },
  ];

  // Add this inside your Sidebar's return statement
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  return (
    <>
      {/* 1. THE TOGGLE BUTTON (Floating) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 z-60 transition-all duration-300 p-2 rounded-full shadow-lg ${isOpen ? 'left-64 bg-gray-600' : 'left-4 bg-gray-600'
          }`}
      >
        {isOpen ? (
          <img src="/left.png" alt="Close" className="w-6 h-6 object-contain" />
        ) : (
          <img src="/right.png" alt="Open" className="w-6 h-6 object-contain" />
        )}
      </button>

      {/* 2. THE SIDEBAR */}
      <div className={`bg-slate-900 h-screen text-white p-6 fixed left-0 top-0 z-50 transition-all duration-300 ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'}`}>
        <div className="mb-10 border-b border-slate-800 pb-6 whitespace-nowrap">
          <h1 className="text-xl font-bold text-green-400 tracking-tight">Global CRM</h1>
        </div>

        <nav className="space-y-2 whitespace-nowrap">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${pathname === item.href ? 'bg-green-600' : 'hover:bg-slate-800'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-10 left-6 right-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-slate-400 hover:text-red-400 p-3 mt-auto transition"
          >Logout
          </button>
        </div>
      </div>
    </>
  );
}