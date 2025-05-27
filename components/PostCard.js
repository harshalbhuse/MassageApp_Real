export default function PostCard({ post }) {
  return (
    <div className="card p-3" style={{ borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', background: '#fff' }}>
      <div className="d-flex align-items-center mb-2">
        {post.avatarUrl ? (
          <img
            src={post.avatarUrl}
            alt="Profile"
            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', marginRight: 12 }}
          />
        ) : (
          <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white me-3" style={{ width: 40, height: 40, fontWeight: 600 }}>
            {post.avatar}
          </div>
        )}
        <div>
          <div className="fw-bold">{post.user}</div>
          <div className="text-muted small">{post.time}</div>
        </div>
      </div>
      <div>{post.content}</div>
    </div>
  );
} 