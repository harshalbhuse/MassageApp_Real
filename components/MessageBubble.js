import React from 'react';
import { Card, Image } from 'react-bootstrap';

const MessageBubble = ({ text, timestamp, imageUrl, isSender, senderName }) => {
  return (
    <div className={`d-flex mb-3 ${isSender ? 'justify-content-end' : 'justify-content-start'}`}>
      <div style={{ maxWidth: '70%' }}>
        <div className={`text-${isSender ? 'end' : 'start'} mb-1`} style={{ fontSize: '0.8rem', color: '#667781' }}>
          {isSender ? 'You' : senderName}
        </div>
        <Card
          bg={isSender ? 'success' : 'light'}
          text={isSender ? 'white' : 'dark'}
          style={{ 
            borderRadius: 8,
            borderTopLeftRadius: isSender ? 8 : 0,
            borderTopRightRadius: isSender ? 0 : 8,
            backgroundColor: isSender ? '#dcf8c6' : '#ffffff',
            color: isSender ? '#303030' : '#303030',
            boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
            padding: '8px 12px'
          }}
        >
          {imageUrl && (
            <div className="mb-2">
              <Image 
                src={imageUrl} 
                thumbnail 
                style={{ 
                  maxHeight: 120, 
                  maxWidth: '100%', 
                  objectFit: 'cover', 
                  cursor: 'pointer',
                  borderRadius: 4
                }} 
                alt="message attachment" 
              />
            </div>
          )}
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</div>
          <div className="text-end" style={{ fontSize: 11, color: '#667781', marginTop: 4 }}>{timestamp}</div>
        </Card>
      </div>
    </div>
  );
};

export default MessageBubble; 