import DashboardLayout from '../components/DashboardLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Friends() {
  // TODO: Replace with real logged-in user ID
  const currentUserId = 1;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendRequests, setFriendRequests] = useState({ incoming: [], outgoing: [] });
  const [friends, setFriends] = useState([]);
  const [actionLoading, setActionLoading] = useState({});
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('http://localhost:8000/users'),
      axios.get(`http://localhost:8000/friend-request?user_id=${currentUserId}`),
      axios.get(`http://localhost:8000/friends?user_id=${currentUserId}`)
    ])
      .then(([usersRes, reqRes, friendsRes]) => {
        setUsers(usersRes.data);
        setFriendRequests(reqRes.data);
        setFriends(friendsRes.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load users or requests');
        setLoading(false);
      });
  }, []);

  const handleSendRequest = (userId) => {
    setActionLoading(l => ({ ...l, [userId]: true }));
    axios.post('http://localhost:8000/friend-request', {
      sender_id: currentUserId,
      receiver_id: userId
    }).then(() => window.location.reload())
      .catch(() => setActionLoading(l => ({ ...l, [userId]: false })));
  };

  const handleAccept = (requestId) => {
    setActionLoading(l => ({ ...l, [requestId]: true }));
    axios.post('http://localhost:8000/friend-request/action', {
      request_id: requestId,
      action: 'accept'
    }).then(() => window.location.reload())
      .catch(() => setActionLoading(l => ({ ...l, [requestId]: false })));
  };

  const handleReject = (requestId) => {
    setActionLoading(l => ({ ...l, [requestId]: true }));
    axios.post('http://localhost:8000/friend-request/action', {
      request_id: requestId,
      action: 'reject'
    }).then(() => window.location.reload())
      .catch(() => setActionLoading(l => ({ ...l, [requestId]: false })));
  };

  // Helper functions
  const isFriend = (userId) => friends.some(f => f.id === userId);
  const outgoingRequest = (userId) => friendRequests.outgoing.find(r => r.receiver === userId);
  const incomingRequest = (userId) => friendRequests.incoming.find(r => r.sender === userId);

  return (
    <DashboardLayout>
      <div className="card p-4">
        <h2 className="mb-3 text-center">Friends</h2>
        {loading && <div>Loading users...</div>}
        {error && <div className="text-danger">{error}</div>}
        <div className="list-group">
          {users.filter(u => u.id !== currentUserId).map(user => {
            // Determine relationship
            if (isFriend(user.id)) {
              return (
                <div key={user.id} className="list-group-item d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40, fontWeight: 600 }}>
                    {user.username.slice(0,2).toUpperCase()}
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">{user.username}</div>
                    <div className="text-muted small">{user.first_name} {user.last_name}</div>
                  </div>
                  <span className="badge bg-success">Friends</span>
                </div>
              );
            }
            const outReq = outgoingRequest(user.id);
            if (outReq) {
              return (
                <div key={user.id} className="list-group-item d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40, fontWeight: 600 }}>
                    {user.username.slice(0,2).toUpperCase()}
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">{user.username}</div>
                    <div className="text-muted small">{user.first_name} {user.last_name}</div>
                  </div>
                  <span className="badge bg-warning text-dark">Request Sent</span>
                </div>
              );
            }
            const inReq = incomingRequest(user.id);
            if (inReq) {
              return (
                <div key={user.id} className="list-group-item d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40, fontWeight: 600 }}>
                    {user.username.slice(0,2).toUpperCase()}
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">{user.username}</div>
                    <div className="text-muted small">{user.first_name} {user.last_name}</div>
                  </div>
                  <button className="btn btn-success btn-sm me-2" disabled={actionLoading[inReq.id]} onClick={() => handleAccept(inReq.id)}>Accept</button>
                  <button className="btn btn-outline-danger btn-sm" disabled={actionLoading[inReq.id]} onClick={() => handleReject(inReq.id)}>Reject</button>
                </div>
              );
            }
            // Default: show send request
            return (
              <div key={user.id} className="list-group-item d-flex align-items-center gap-3">
                <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40, fontWeight: 600 }}>
                  {user.username.slice(0,2).toUpperCase()}
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold">{user.username}</div>
                  <div className="text-muted small">{user.first_name} {user.last_name}</div>
                </div>
                <button className="btn btn-primary btn-sm" disabled={actionLoading[user.id]} onClick={() => handleSendRequest(user.id)}>Send Request</button>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
} 