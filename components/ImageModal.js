import React from 'react';
import { Modal, Image } from 'react-bootstrap';

const ImageModal = ({ show, imageUrl, onHide }) => (
  <Modal show={show} onHide={onHide} centered size="lg">
    <Modal.Body className="text-center p-0">
      <Image src={imageUrl} alt="Preview" fluid style={{ maxHeight: '70vh', objectFit: 'contain' }} />
    </Modal.Body>
  </Modal>
);

export default ImageModal; 