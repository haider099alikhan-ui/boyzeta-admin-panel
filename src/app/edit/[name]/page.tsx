'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Company {
  _id: string;
  name: string;
  boycott: boolean;
  reason: string;
  alternatives: string[];
  barcodes: string[];
  proofUrls: string[];
}

export default function EditCompany() {
  const [formData, setFormData] = useState({
    name: '',
    boycott: false,
    reason: '',
    alternatives: '',
    barcodes: '',
    urls: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const companyName = decodeURIComponent(params.name as string);

  // Fetch company data on mount
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const adminKey = localStorage.getItem('admin-key');
        if (!adminKey) {
          router.push('/login');
          return;
        }

        const response = await fetch(`http://localhost:3000/api/products?search=${encodeURIComponent(companyName)}`, {
          headers: {
            'x-admin-key': adminKey
          }
        });

        if (response.ok) {
          const data = await response.json();
          const company = data.data?.find((c: Company) => c.name === companyName);
          
          if (company) {
            setFormData({
              name: company.name,
              boycott: company.boycott,
              reason: company.reason,
              alternatives: company.alternatives?.join('; ') || '',
              barcodes: company.barcodes?.join('; ') || '',
              urls: company.proofUrls?.join('; ') || ''
            });
          } else {
            setError('Company not found');
          }
        } else {
          setError('Failed to fetch company data');
        }
      } catch (error) {
        console.error('Error fetching company:', error);
        setError('Error fetching company data');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyName, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const adminKey = localStorage.getItem('admin-key');
      if (!adminKey) {
        alert('Please login first');
        router.push('/login');
        return;
      }

      // Prepare data for API
      const apiData = {
        name: formData.name.trim(),
        boycott: formData.boycott,
        reason: formData.reason.trim(),
        alternatives: formData.alternatives ? formData.alternatives.split(';').map(s => s.trim()).filter(s => s) : [],
        barcodes: formData.barcodes ? formData.barcodes.split(';').map(s => s.trim()).filter(s => s) : [],
        urls: formData.urls ? formData.urls.split(';').map(s => s.trim()).filter(s => s) : []
      };

      const response = await fetch(`http://localhost:3000/api/products/${encodeURIComponent(companyName)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify(apiData)
      });

      if (response.ok) {
        alert('Company updated successfully!');
        router.push('/');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to update company'}`);
      }
    } catch (error) {
      alert('Error: Failed to update company');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading company data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Edit Company: {companyName}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
              />
            </div>

            {/* Boycott Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="boycott"
                name="boycott"
                checked={formData.boycott}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="boycott" className="ml-2 block text-sm text-gray-700">
                Boycott this company
              </label>
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason *
              </label>
              <textarea
                id="reason"
                name="reason"
                required
                rows={4}
                value={formData.reason}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain why this company should be boycotted or is safe"
              />
            </div>

            {/* Alternatives */}
            <div>
              <label htmlFor="alternatives" className="block text-sm font-medium text-gray-700">
                Alternative Companies
              </label>
              <input
                type="text"
                id="alternatives"
                name="alternatives"
                value={formData.alternatives}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Separate multiple alternatives with semicolons (;)"
              />
            </div>

            {/* Barcodes */}
            <div>
              <label htmlFor="barcodes" className="block text-sm font-medium text-gray-700">
                Product Barcodes
              </label>
              <input
                type="text"
                id="barcodes"
                name="barcodes"
                value={formData.barcodes}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Separate multiple barcodes with semicolons (;)"
              />
            </div>

            {/* URLs */}
            <div>
              <label htmlFor="urls" className="block text-sm font-medium text-gray-700">
                Reference URLs
              </label>
              <input
                type="text"
                id="urls"
                name="urls"
                value={formData.urls}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Separate multiple URLs with semicolons (;)"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Company'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
