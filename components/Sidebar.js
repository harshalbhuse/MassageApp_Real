import { FaHome, FaUser, FaEnvelope, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const navItems = [
  { icon: <FaHome />, label: 'Home', href: '/' },
  { icon: <FaUser />, label: 'Profile', href: '/profile' },
  { icon: <FaEnvelope />, label: 'Messages', href: '/messages' },
  { icon: <FaUsers />, label: 'Friends', href: '/friends' },
];

export default function Sidebar() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
    if (!userId) return;
    axios.get(`http://localhost:8000/api/profile?user_id=${userId}`)
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_id');
      router.push('/login');
    }
  };

  const handleAvatarClick = () => {
    router.push('/profile');
  };

  let avatarContent;
  if (profile && profile.profile_photo_url) {
    avatarContent = (
      <img
        src={profile.profile_photo_url}
        alt="Profile"
        style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
        onClick={handleAvatarClick}
      />
    );
  } else if (profile) {
    const initials = (profile.first_name?.[0] || '') + (profile.last_name?.[0] || profile.username?.[0] || 'U');
    avatarContent = (
      <div
        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
        style={{ width: 56, height: 56, fontWeight: 600, fontSize: 24, cursor: 'pointer' }}
        onClick={handleAvatarClick}
      >
        {initials.toUpperCase()}
      </div>
    );
  } else {
    avatarContent = (
      <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 56, height: 56, fontWeight: 600, fontSize: 24 }}>
        U
      </div>
    );
  }

  return (
    <aside className="d-flex flex-column bg-white shadow p-3" style={{ width: 220, minHeight: '100vh' }}>
      <div className="d-flex justify-content-center align-items-center mb-4">
        {avatarContent}
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
        <button onClick={handleLogout} className="d-flex align-items-center text-decoration-none text-dark sidebar-link p-2 rounded w-100 border-0 bg-transparent" style={{ cursor: 'pointer' }}>
          <span className="me-3 fs-5"><FaSignOutAlt /></span>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
} 