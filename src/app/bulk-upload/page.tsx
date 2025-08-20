'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const companies = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const company: any = {};
        
        headers.forEach((header, index) => {
          let value = values[index] || '';
          
          // Handle arrays (alternatives, barcodes, urls)
          if (['alternatives', 'barcodes', 'urls'].includes(header)) {
            value = value ? value.split(';').map((item: string) => item.trim()).filter(Boolean) : [];
          }
          
          // Handle boolean (boycott)
          if (header === 'boycott') {
            value = value.toLowerCase() === 'true';
          }
          
          company[header] = value;
        });
        
        companies.push(company);
      }
    }
    
    return companies;
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const text = await file.text();
      const companies = parseCSV(text);

      if (companies.length === 0) {
        setError('No valid companies found in CSV');
        return;
      }

      const response = await fetch('http://localhost:3000/api/bulk-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ companies })
      });

      const data = await response.json();
      setResults(data);

      if (data.success) {
        alert(`Upload completed! ${data.summary.successful} companies imported successfully.`);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (error) {
      setError('Failed to process file');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 style={{ margin: 0, color: '#1f2937' }}>📤 Bulk Upload</h1>
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

      {/* Upload Form */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#1f2937', marginBottom: '20px' }}>Upload CSV File</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            backgroundColor: !file || loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: !file || loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </div>

      {/* CSV Format Instructions */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#1f2937', marginBottom: '15px' }}>CSV Format</h3>
        <p style={{ color: '#6b7280', marginBottom: '15px' }}>
          Your CSV file should have the following columns:
        </p>
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '15px',
          borderRadius: '5px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          name,boycott,reason,alternatives,barcodes,urls
        </div>
        <div style={{ marginTop: '15px', color: '#6b7280' }}>
          <p><strong>Example:</strong></p>
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '15px',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}>
            Company A,true,Environmental concerns,Alternative A;Alternative B,123456789;987654321,https://example.com
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#1f2937', marginBottom: '15px' }}>Upload Results</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Summary:</strong></p>
            <ul style={{ color: '#6b7280' }}>
              <li>Total: {results.summary.total}</li>
              <li>Successful: {results.summary.successful}</li>
              <li>Failed: {results.summary.failed}</li>
            </ul>
          </div>

          {results.errors && results.errors.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Errors:</strong></p>
              <div style={{
                backgroundColor: '#fee2e2',
                padding: '15px',
                borderRadius: '5px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {results.errors.map((error: any, index: number) => (
                  <div key={index} style={{ marginBottom: '5px', fontSize: '14px' }}>
                    Row {error.row}: {error.error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
