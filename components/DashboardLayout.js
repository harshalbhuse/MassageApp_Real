import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
} 