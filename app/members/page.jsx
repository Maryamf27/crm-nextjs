'use client';
import { useState, useEffect } from 'react';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Sales' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const auth = localStorage.getItem('isLoggedIn');
  if (!auth) {
    router.push('/'); // Kicks them out if not logged in
  }
}, []);

  // Fetch existing members on load
  const fetchMembers = async () => {
    const res = await fetch('/api/members');
    const data = await res.json();
    setMembers(data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ name: '', email: '', role: 'Sales' });
      fetchMembers(); // Refresh the list automatically
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Team Member Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Form Section */}
        <div className="bg-white p-6 text-black shadow-lg rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Add New Member</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text" placeholder="Full Name" required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email" placeholder="Email Address" required
              className="w-full p-2 border text-black rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded-md bg-white"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
            <button
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-700 transition"
            >
              {loading ? 'Adding...' : 'Register Member'}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="bg-gray-50 text-black p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Current Team</h2>
          <div className="space-y-3">
            {members.length === 0 && <p className="text-gray-400">No members found.</p>}
            {members.map((member) => (
              <div key={member._id} className="bg-white p-3 rounded shadow-sm border-l-4 border-green-500 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-700">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
                <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full uppercase font-bold text-gray-600">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}