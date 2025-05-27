import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import UserList from '../components/UserList';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/DashboardLayout';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      setError('');
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
        const res = await axios.get(`http://localhost:8000/friends?user_id=${userId}`);
        setUsers(res.data);
      } catch (err) {
        setError('Failed to load friends.');
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  const handleUserClick = (userId) => {
    router.push(`/messages/${userId}`);
  };

  const handleAddFriend = () => {
    router.push('/friends');
  };

  return (
    <DashboardLayout>
      <Container className="py-4 d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
        <Card style={{ width: '100%', maxWidth: 500, borderRadius: 18, boxShadow: '0 4px 32px rgba(0,0,0,0.10)' }}>
          <Card.Body>
            <h2 className="mb-4 text-center">Your Friends</h2>
            {loading && <div className="text-center my-5"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && users.length === 0 && (
              <div className="text-center my-5">
                <div className="mb-3" style={{ fontSize: 18, color: '#667781' }}>You have no friends yet.</div>
                <Button variant="primary" onClick={handleAddFriend}>Add Friend</Button>
              </div>
            )}
            {!loading && !error && users.length > 0 && (
              <UserList users={users} onUserClick={handleUserClick} />
            )}
          </Card.Body>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default UsersPage; 