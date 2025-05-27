import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, currentUserId, onImageClick }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '1rem 0', background: '#ece5dd', minHeight: '70vh' }}>
      {messages.map((msg, idx) => (
        <MessageBubble
          key={msg.id || idx}
          text={msg.text}
          timestamp={msg.timestamp}
          imageUrl={msg.imageUrl}
          isSender={msg.senderId === currentUserId}
          senderName={msg.senderName}
          onImageClick={onImageClick ? () => onImageClick(msg.imageUrl) : undefined}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList; 