import React from 'react';

import SignIn from './pages/SignIn';
import { AuthProvider } from './hooks/Auth';
import ToastContainer from './components/ToastContainer';

import GlobalStyle from './styles/global';

const App: React.FC = () => (
  <>
    <AuthProvider>
      <SignIn />
    </AuthProvider>

    <ToastContainer />

    <GlobalStyle />
  </>
);

export default App;
