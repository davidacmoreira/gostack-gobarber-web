import React from 'react';
import { FiAlertCircle, FiXCircle } from 'react-icons/fi';

import { Container, Toast } from './styles';

const ToastContainer: React.FC = () => {
  return (
    <Container>
      <Toast type="info" hasDescription>
        <FiAlertCircle size={20} />

        <div>
          <strong>Info</strong>
          <p>SignIn</p>
        </div>

        <button type="button">
          <FiXCircle size={18} />
        </button>
      </Toast>

      <Toast type="info" hasDescription={false}>
        <FiAlertCircle size={20} />

        <div>
          <strong>Success</strong>
        </div>

        <button type="button">
          <FiXCircle size={18} />
        </button>
      </Toast>

      <Toast type="error" hasDescription>
        <FiAlertCircle size={20} />

        <div>
          <strong>Error</strong>
          <p>SignIn</p>
        </div>

        <button type="button">
          <FiXCircle size={18} />
        </button>
      </Toast>
    </Container>
  );
};

export default ToastContainer;