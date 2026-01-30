'use client';
import { useState } from 'react';

export default function AddCustomerForm({ onCustomerAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'Lead',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Clear the form
        setFormData({ name: '', email: '', status: 'Lead' });
        // Refresh the list in the parent component
        if (onCustomerAdded) onCustomerAdded();
        alert("Customer added successfully!");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Failed to add customer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 m-9">
      <h2 className="text-lg  font-semibold mb-4 text-gray-700">Quick Add Customer</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded-md text-black outline-none focus:ring-2 focus:ring-green-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full p-2 border rounded-md text-black outline-none focus:ring-2 focus:ring-green-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
          <select
            className="w-full p-2 border rounded-md text-black bg-white outline-none focus:ring-2 focus:ring-green-500"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Lead">Lead</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Add Customer'}
        </button>
      </form>
    </div>
  );
}