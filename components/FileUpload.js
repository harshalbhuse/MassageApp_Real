import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FaPaperclip, FaImage } from 'react-icons/fa';

const FileUpload = ({ onFileSelect, onSend, loading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      onSend(message, selectedFile);
      setMessage('');
      setSelectedFile(null);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3">
      <div className="d-flex align-items-center gap-2">
        <Form.Control
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow-1"
        />
        <Form.Group className="mb-0">
          <Form.Label className="mb-0">
            <Button variant="outline-primary" as="span" className="d-flex align-items-center">
              <FaPaperclip />
            </Button>
          </Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : <FaImage />}
        </Button>
      </div>
      {selectedFile && (
        <div className="mt-2 text-muted small">
          Selected file: {selectedFile.name}
        </div>
      )}
    </Form>
  );
};

export default FileUpload; 