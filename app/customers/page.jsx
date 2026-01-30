'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Added this import
import AddCustomerForm from '@/components/AddCustomerForm';

export default function CustomersPage() {
  const router = useRouter(); // Initialize router
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // States for Edit Logic
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', status: '' });

  // 1. Auth Guard
  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn');
    if (!auth) {
      router.push('/');
    }
  }, [router]);

  // 2. Fetch Data
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to load customers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 3. Delete Logic
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        // 1. Tell the DATABASE to delete it
        const res = await fetch(`/api/customers/${id}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          // 2. Only if the DB says OK, remove it from the SCREEN
          setCustomers(prev => prev.filter(c => c._id !== id));
          alert("Customer deleted from database!");
        } else {
          alert("Failed to delete from database. Check your API.");
        }
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  };

  // 4. Edit Logic
  const startEdit = (customer) => {
    setEditingId(customer._id);
    setEditForm({ name: customer.name, email: customer.email, status: customer.status });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Updating Customer ID:", editingId);
    const res = await fetch(`/api/customers/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });

    if (res.ok) {
      setEditingId(null);
      fetchCustomers();
    }
  };

  // 5. Search Logic
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <AddCustomerForm onCustomerAdded={fetchCustomers} />

      <div className="flex justify-between items-center m-8">
        <h1 className="text-2xl font-bold text-white">Customer Directory</h1>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg w-80 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-10">Loading customers...</td></tr>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50 transition">
                  {editingId === customer._id ? (
                    <>
                      {/* EDIT MODE INPUTS */}
                      <td className="px-6 py-4"><input className="border p-1 rounded" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></td>
                      <td className="px-6 py-4"><input className="border p-1 rounded" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /></td>
                      <td className="px-6 py-4">
                        <select className="border p-1 rounded" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                          <option value="Lead">Lead</option>
                          <option value="Active">Active</option>
                          <option value="Active">InActive</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">Editing...</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={handleUpdate} className="text-green-600 cursor-pointer font-bold">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* VIEW MODE */}
                      <td className="px-6 py-4 font-medium">{customer.name}</td>
                      <td className="px-6 py-4">{customer.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          } `}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 flex gap-4">
                        <button onClick={() => startEdit(customer)} className="text-blue-500 hover:text-blue-700 font-bold">Edit</button>
                        <button onClick={() => handleDelete(customer._id)} className="text-red-500 hover:text-red-700 font-bold">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center py-10 text-gray-400">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}