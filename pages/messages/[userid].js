import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Container, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import MessageList from '../../components/MessageList';
import ImageModal from '../../components/ImageModal';
import FileUpload from '../../components/FileUpload';

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
  const pollingRef = useRef(null);
  // Mock current user id (replace with real auth logic)
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

  // Check if the user is a friend
  useEffect(() => {
    if (!userid || !currentUserId) return;
    axios.get(`http://localhost:8000/friends?user_id=${currentUserId}`)
      .then(res => {
        setIsFriend(res.data.some(u => u.id == userid));
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
    <Container className="py-4">
      <h2 className="mb-4">Messages</h2>
      {loading && <div className="text-center my-5"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && !isFriend && (
        <Alert variant="warning">You must be friends to chat with this user.</Alert>
      )}
      {!loading && !error && messages.length === 0 && isFriend && (
        <Alert variant="info">No messages from this user yet.</Alert>
      )}
      {!loading && !error && messages.length > 0 && isFriend && (
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          onImageClick={handleImageClick}
        />
      )}
      {isFriend && <FileUpload onSend={handleSendMessage} loading={sending} />}
      <ImageModal show={showImage} imageUrl={imageUrl} onHide={() => setShowImage(false)} />
    </Container>
  );
};

export default MessagesPage; 