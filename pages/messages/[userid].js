import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Container, Spinner, Alert, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import MessageList from '../../components/MessageList';
import ImageModal from '../../components/ImageModal';
import FileUpload from '../../components/FileUpload';
import DashboardLayout from '../../components/DashboardLayout';

const MessagesPage = () => {
  const router = useRouter();
  const { userid } = router.query;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isFriend, setIsFriend] = useState(false);
  const [friendName, setFriendName] = useState('');
  const pollingRef = useRef(null);
  // Mock current user id (replace with real auth logic)
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

  // Check if the user is a friend and get their name
  useEffect(() => {
    if (!userid || !currentUserId) return;
    axios.get(`http://localhost:8000/friends?user_id=${currentUserId}`)
      .then(res => {
        const friend = res.data.find(u => u.id == userid);
        setIsFriend(!!friend);
        setFriendName(friend ? `${friend.first_name} ${friend.last_name}` : '');
      });
  }, [userid, currentUserId]);

  // Fetch messages and poll every 5 seconds
  useEffect(() => {
    if (!userid) return;
    let cancelled = false;
    const fetchMessages = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:8000/api/user/${userid}/message?logged_in=${currentUserId}`);
        if (!cancelled) setMessages(res.data);
      } catch (err) {
        if (!cancelled) setError('Failed to load messages.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchMessages();
    pollingRef.current = setInterval(fetchMessages, 5000);
    return () => {
      cancelled = true;
      clearInterval(pollingRef.current);
    };
  }, [userid, currentUserId]);

  const handleImageClick = (url) => {
    setImageUrl(url);
    setShowImage(true);
  };

  const handleSendMessage = async (text, file) => {
    setSending(true);
    setError('');
    try {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (file) formData.append('file', file);
      formData.append('sender', currentUserId);
      formData.append('receiver', userid);

      const res = await axios.post(`http://localhost:8000/api/message`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      setError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <Container className="py-4 d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
        <Card style={{ width: '100%', maxWidth: 600, minHeight: 500, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', borderRadius: 18, background: '#f7fafd' }}>
          <Card.Header className="d-flex align-items-center justify-content-between bg-white" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottom: '1px solid #e0e7ef' }}>
            <div className="fw-bold fs-5 text-primary">{friendName || 'Messages'}</div>
            <Button variant="outline-secondary" size="sm" onClick={() => router.back()}>&larr; Back</Button>
          </Card.Header>
          <Card.Body style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 400 }}>
            {loading && <div className="text-center my-5"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && !isFriend && (
              <Alert variant="warning" className="m-4">You must be friends to chat with this user.</Alert>
            )}
            {!loading && !error && messages.length === 0 && isFriend && (
              <Alert variant="info" className="m-4">No messages from this user yet.</Alert>
            )}
            {!loading && !error && messages.length > 0 && isFriend && (
              <div style={{ flex: 1, overflowY: 'auto', background: '#ece5dd', borderRadius: 12, margin: 12, marginBottom: 0 }}>
                <MessageList
                  messages={messages}
                  currentUserId={currentUserId}
                  onImageClick={handleImageClick}
                />
              </div>
            )}
          </Card.Body>
          <Card.Footer className="bg-white" style={{ borderBottomLeftRadius: 18, borderBottomRightRadius: 18, borderTop: '1px solid #e0e7ef' }}>
            {isFriend && <FileUpload onSend={handleSendMessage} loading={sending} />}
          </Card.Footer>
        </Card>
        <ImageModal show={showImage} imageUrl={imageUrl} onHide={() => setShowImage(false)} />
      </Container>
    </DashboardLayout>
  );
};

export default MessagesPage; 