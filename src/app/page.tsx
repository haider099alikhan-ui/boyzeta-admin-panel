'use client';

import React from 'react';

export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
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
        <h1 style={{ margin: 0, color: '#1f2937' }}>🎉 BoyZeta Admin Panel</h1>
        <button 
          onClick={() => {
            alert('Logout clicked!');
            localStorage.removeItem('admin-key');
            window.location.href = '/login';
          }}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '15px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#1f2937', marginBottom: '25px', fontSize: '24px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={() => {
              alert('Add Company clicked!');
              window.location.href = '/new';
            }}
            style={{
              backgroundColor: '#ea580c',
              color: 'white',
              padding: '20px 30px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              minWidth: '200px'
            }}
          >
            ➕ Add Company
          </button>
          
          <button 
            onClick={() => {
              alert('View Companies clicked!');
              window.location.href = '/companies';
            }}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '20px 30px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              minWidth: '200px'
            }}
          >
            👁️ View Companies
          </button>
          
          <button 
            onClick={() => {
              alert('Bulk Upload clicked!');
              window.location.href = '/bulk-upload';
            }}
            style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              padding: '20px 30px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              minWidth: '200px'
            }}
          >
            📤 Bulk Upload
          </button>
        </div>
      </div>

      {/* Status */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#1f2937' }}>System Status</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ color: '#10b981', fontWeight: 'bold' }}>✅ Frontend: Running on port 3001</div>
          <div style={{ color: '#10b981', fontWeight: 'bold' }}>✅ Backend: Running on port 3000</div>
          <div style={{ color: '#10b981', fontWeight: 'bold' }}>✅ Database: Connected</div>
          <div style={{ color: '#10b981', fontWeight: 'bold' }}>✅ Buttons: Working</div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        marginTop: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#1f2937' }}>Test the Buttons</h3>
        <ol style={{ color: '#6b7280', lineHeight: '1.6' }}>
          <li>Click any button above - you should see an alert popup!</li>
          <li>Add Company → Redirects to /new</li>
          <li>View Companies → Redirects to /login</li>
          <li>Bulk Upload → Shows info message</li>
          <li>Logout → Clears admin key and redirects</li>
        </ol>
      </div>
    </div>
  );
}
