import React from 'react';
import { useAuth } from './auth';
import AuthForm from './components/AuthForm';
import AdminPage from './components/AdminPage';
import ChatWidget from './components/ChatWidget';

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div style={{ minHeight: '100vh' }}>
      {isLoggedIn ? <AdminPage /> : <AuthForm />}
      <ChatWidget />
    </div>
  );
};

export default App;
