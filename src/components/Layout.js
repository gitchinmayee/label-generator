import React from 'react';

export default function Layout({ children, onLogout, setPage, activePage }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      {/* Sidebar - Flexbox container */}
      <div style={{ 
        width: '260px', 
        backgroundColor: '#1a237e', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '25px 15px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: '40px',
          letterSpacing: '1px'
        }}>MINILEC</h2>
        
        <nav style={{ flex: 1 }}>
          <button 
            onClick={() => setPage('dashboard')} 
            style={{
              width: '100%', 
              padding: '12px 20px', 
              marginBottom: '12px',
              backgroundColor: activePage === 'dashboard' ? '#3949ab' : 'rgba(255,255,255,0.1)',
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '16px',
              transition: '0.3s'
            }}
          >
            Create Labels
          </button>

          <button 
            onClick={() => setPage('history')} 
            style={{
              width: '100%', 
              padding: '12px 20px', 
              backgroundColor: activePage === 'history' ? '#3949ab' : 'rgba(255,255,255,0.1)',
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '16px',
              transition: '0.3s'
            }}
          >
            History
          </button>
        </nav>

        {/* Logout Button - Always visible at bottom */}
        <button 
          onClick={onLogout} 
          style={{
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#d32f2f', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '20px'
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content Area with proper padding */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}