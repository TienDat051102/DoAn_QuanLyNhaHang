import React from "react";
import { Button, Modal } from "react-bootstrap";

const NotificationModal = ({ show, message, onClose }) => {
  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>Thông báo đặt bàn</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationModal;
