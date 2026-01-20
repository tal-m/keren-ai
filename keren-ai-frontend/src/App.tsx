import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ApiStatus from './components/ApiStatus';
import AuthForm from './components/AuthForm';
import { useAuth } from './auth';
import CreateProfile from './components/CreateProfile';
import Discovery from './components/Discovery';
import Trips from './components/Trips';
import Settings from './components/Settings';
import BottomNavBar from './components/BottomNavBar';
import MyProfile from './components/MyProfile';

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="w-full py-6 px-8 flex justify-between items-center bg-white/80 shadow-md">
        <h1 className="text-2xl font-bold text-indigo-700 tracking-tight">Connect</h1>
        <nav>{/* Navigation can go here */}</nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold text-indigo-800 mb-4">Travel. Meet. Connect.</h2>
        <p className="text-lg md:text-2xl text-indigo-600 mb-8 max-w-2xl">Discover new places, make friends around the world, and share your travel experiences on Connect – the social platform for explorers and adventurers.</p>
        <Routes>
          <Route path="/" element={!isLoggedIn ? <AuthForm /> : <Navigate to="/discovery" />} />
          <Route path="/create-profile" element={isLoggedIn ? <CreateProfile /> : <Navigate to="/" />} />
          <Route path="/my-Profile" element={isLoggedIn ? <MyProfile /> : <Navigate to="/" />} />
          <Route path="/discovery" element={isLoggedIn ? <Discovery /> : <Navigate to="/" />} />
          <Route path="/trips" element={isLoggedIn ? <Trips /> : <Navigate to="/" />} />
          <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/" />} />
        </Routes>
        <ApiStatus />
      </main>
      <footer className="py-4 text-center text-indigo-500 text-sm bg-white/70 mt-auto">© {new Date().getFullYear()} Connect. All rights reserved.</footer>
      {isLoggedIn && <BottomNavBar />}
    </div>
  );
};

export default App; 