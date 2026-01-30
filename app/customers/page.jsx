'use client';
import { useState, useEffect } from 'react';
import AddCustomerForm from '@/components/AddCustomerForm';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn');
    if (!auth) {
      router.push('/'); // Kicks them out if not logged in
    }
  }, []);

  // Fetch data from our API route
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

  // Filter logic for the search bar
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <AddCustomerForm onCustomerAdded={fetchCustomers} />
      <div className="flex justify-between items-center m-8">
        <h1 className="text-2xl font-bold text-white">Customer Directory</h1>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2 text-white border rounded-lg w-80 focus:ring-2 focus:ring-green-500 outline-none"
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10">Loading customers...</td></tr>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">{customer.name}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${customer.status === 'Active' ? 'bg-green-100 text-green-700' :
                        customer.status === 'Lead' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-10 text-gray-400">No customers found matching your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}