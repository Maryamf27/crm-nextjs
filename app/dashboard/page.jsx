'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]); // Store the full list
  const [filterStatus, setFilterStatus] = useState('All'); // For filtering
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const auth = localStorage.getItem('isLoggedIn');
  if (!auth) {
    router.push('/'); // Kicks them out if not logged in
  }

    // Improved fetch with error handling to avoid "Unexpected end of JSON"
    fetch('/api/customers')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading stats:", err);
        setLoading(false);
      });
  }, [router]);

  // CALCULATIONS
  const totalCount = customers.length;
  const leadCount = customers.filter(c => c.status === 'Lead').length;
  const activeCount = customers.filter(c => c.status === 'Active').length;

  // RECENT 5 CUSTOMERS
  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // FILTERED LIST (By Status)
  const filteredList = filterStatus === 'All'
    ? customers
    : customers.filter(c => c.status === filterStatus);

  if (loading) return <div className="text-white p-10 font-bold">Connecting to Atlas...</div>;

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl font-bold text-white">CRM Dashboard</h1>

      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-500">
          <p className="text-xs text-gray-400 uppercase font-black">Total Records</p>
          <h2 className="text-4xl font-black text-slate-900">{totalCount}</h2>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-yellow-500">
          <p className="text-xs text-gray-400 uppercase font-black">Leads</p>
          <h2 className="text-4xl font-black text-slate-900">{leadCount}</h2>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-green-500">
          <p className="text-xs text-gray-400 uppercase font-black">Active Clients</p>
          <h2 className="text-4xl font-black text-slate-900">{activeCount}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. RECENTLY ADDED (Last 5) */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span>🕒</span> Recently Added
          </h3>
          <div className="space-y-3">
            {recentCustomers.map(c => (
              <div key={c._id} className="flex justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-200 font-medium">{c.name}</span>
                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${c.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. STATUS FILTER SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-slate-800 font-black uppercase text-sm">Customer Filter</h3>
            <select
              className="bg-slate-100 p-2 text-black rounded-lg text-sm font-bold outline-none border-2 border-transparent focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Lead">Leads Only</option>
              <option value="Active">Active Only</option>
            </select>
          </div>

          <div className="max-h-50 overflow-y-auto pr-2 custom-scrollbar">
            {filteredList.map(c => (
              <div key={c._id} className="py-2 border-b border-slate-100 flex justify-between text-sm">
                <span className="text-slate-600">{c.name}</span>
                <span className="text-slate-400 italic">{c.email}</span>
              </div>
            ))}
            {filteredList.length === 0 && <p className="text-slate-400 text-center py-4">No records found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}