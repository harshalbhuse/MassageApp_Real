import { FaImage, FaVideo } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CreatePost() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
    if (!userId) return;
    axios.get(`http://localhost:8000/api/profile?user_id=${userId}`)
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  let avatarContent;
  if (profile && profile.profile_photo_url) {
    avatarContent = (
      <img
        src={profile.profile_photo_url}
        alt="Profile"
        style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
      />
    );
  } else if (profile) {
    const initials = (profile.first_name?.[0] || '') + (profile.last_name?.[0] || profile.username?.[0] || 'U');
    avatarContent = (
      <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 48, height: 48, fontWeight: 600, fontSize: 22 }}>
        {initials.toUpperCase()}
      </div>
    );
  } else {
    avatarContent = (
      <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 48, height: 48, fontWeight: 600, fontSize: 22 }}>
        U
      </div>
    );
  }

  return (
    <div className="card mb-4 p-3" style={{ background: '#f7fafd', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      <div className="d-flex align-items-start mb-2">
        {avatarContent}
        <textarea className="form-control flex-grow-1 ms-3" rows={2} placeholder={profile ? `What's on your mind, ${profile.first_name || profile.username || ''}?` : "What's on your mind?"} style={{ resize: 'none', borderRadius: 12, background: '#f0f4fa', border: '1px solid #e0e7ef', minHeight: 48 }} />
      </div>
      <div className="d-flex align-items-center gap-3 mt-2">
        <button className="btn btn-light btn-sm d-flex align-items-center gap-2"><FaImage className="text-success" /> Photo</button>
        <button className="btn btn-light btn-sm d-flex align-items-center gap-2"><FaVideo className="text-danger" /> Video</button>
        <button className="btn btn-primary ms-auto">Post</button>
      </div>
    </div>
  );
} 