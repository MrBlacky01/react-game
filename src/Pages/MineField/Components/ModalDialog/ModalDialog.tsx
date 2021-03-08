import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface MineFieldProps {
    title: string;
    body: string;
    onClick: () => void;
}

export const ModalDialog = (props: MineFieldProps) => {
    const {
        title,
        body,
        onClick
    } = props;
  
    const [modal, setModal] = useState(true);
  
    const toggle = () => {
        setModal(!modal);
        onClick();
    }
  
    return (
      <>
        <Modal isOpen={modal} >
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            {body}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>Start New Game</Button>{' '}
          </ModalFooter>
        </Modal>
      </>
    );
  }
  