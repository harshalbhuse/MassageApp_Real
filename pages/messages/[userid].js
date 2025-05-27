import React, { useEffect, useState } from 'react';
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
  // Mock current user id (replace with real auth logic)
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

  useEffect(() => {
    if (!userid) return;
    const fetchMessages = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:8000/api/user/${userid}/message?logged_in=${currentUserId}`);
        setMessages(res.data);
      } catch (err) {
        setError('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [userid]);

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
      {!loading && !error && messages.length === 0 && (
        <Alert variant="info">No messages from this user yet.</Alert>
      )}
      {!loading && !error && messages.length > 0 && (
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          onImageClick={handleImageClick}
        />
      )}
      <FileUpload onSend={handleSendMessage} loading={sending} />
      <ImageModal show={showImage} imageUrl={imageUrl} onHide={() => setShowImage(false)} />
    </Container>
  );
};

export default MessagesPage; 