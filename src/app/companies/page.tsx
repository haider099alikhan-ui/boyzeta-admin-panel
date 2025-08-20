'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Company {
  _id: string;
  name: string;
  boycott: boolean;
  reason: string;
  alternatives: string[];
  barcodes: string[];
  proofUrls: string[];
  createdAt: string;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/companies?search=${search}`);
      const data = await response.json();
      
      if (data.success) {
        setCompanies(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/companies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchCompanies();
        alert('Company deleted successfully');
      } else {
        alert('Failed to delete company');
      }
    } catch (error) {
      alert('Error deleting company');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading companies...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, color: '#1f2937' }}>🏢 Companies</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => router.push('/companies/new')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ➕ Add Company
          </button>
          <button
            onClick={() => router.push('/')}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Companies List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {error && (
          <div style={{
            padding: '20px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {companies.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            No companies found
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Reason</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '15px' }}>
                    <strong>{company.name}</strong>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      backgroundColor: company.boycott ? '#fee2e2' : '#dcfce7',
                      color: company.boycott ? '#dc2626' : '#16a34a',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {company.boycott ? 'BOYCOTT' : 'SAFE'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', maxWidth: '300px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {company.reason}
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => router.push(`/companies/${company._id}/edit`)}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          padding: '4px 8px',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(company._id)}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          padding: '4px 8px',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
