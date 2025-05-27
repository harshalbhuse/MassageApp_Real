import { FaUser, FaEnvelope, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const navItems = [
  { icon: <FaUser />, label: 'Profile', href: '/profile' },
  { icon: <FaEnvelope />, label: 'Messages', href: '/messages' },
  { icon: <FaUsers />, label: 'Friends', href: '/friends' },
];

export default function Sidebar() {
  return (
    <aside className="d-flex flex-column bg-white shadow p-3" style={{ width: 220, minHeight: '100vh' }}>
      <div className="d-flex justify-content-center align-items-center mb-4">
        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 56, height: 56, fontWeight: 600, fontSize: 24 }}>
          AW
        </div>
      </div>
      <nav className="flex-grow-1">
        {navItems.map(item => (
          <a key={item.label} href={item.href} className="d-flex align-items-center mb-3 text-decoration-none text-dark sidebar-link p-2 rounded">
            <span className="me-3 fs-5">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="mt-auto">
        <a href="/logout" className="d-flex align-items-center text-decoration-none text-dark sidebar-link p-2 rounded">
          <span className="me-3 fs-5"><FaSignOutAlt /></span>
          <span>Log out</span>
        </a>
      </div>
    </aside>
  );
} 