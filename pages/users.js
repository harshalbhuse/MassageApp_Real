import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import UserList from '../components/UserList';
import { useRouter } from 'next/router';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
        const res = await axios.get(`http://localhost:8000/api/users?user_id=${userId}`);
        setUsers(res.data);
      } catch (err) {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    router.push(`/messages/${userId}`);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Users Who Messaged You</h2>
      {loading && <div className="text-center my-5"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <UserList users={users} onUserClick={handleUserClick} />
      )}
    </Container>
  );
};

export default UsersPage; 