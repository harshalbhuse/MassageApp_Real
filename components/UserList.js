import React, { useState } from 'react';
import { ListGroup, InputGroup, FormControl, Badge, Image } from 'react-bootstrap';

const UserList = ({ users, onUserClick }) => {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </InputGroup>
      <ListGroup>
        {filteredUsers.map(user => (
          <ListGroup.Item
            key={user.id}
            action
            onClick={() => onUserClick(user.id)}
            className="d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} roundedCircle width={40} height={40} className="me-2" />
              ) : (
                <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 40, height: 40, fontWeight: 'bold' }}>
                  {user.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 500 }}>{user.username}</div>
                <div className="text-muted" style={{ fontSize: 13, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.lastMessage || <span className="text-muted">No messages yet</span>}
                </div>
              </div>
            </div>
            {user.unreadCount > 0 && (
              <Badge bg="primary" pill>{user.unreadCount}</Badge>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default UserList; 