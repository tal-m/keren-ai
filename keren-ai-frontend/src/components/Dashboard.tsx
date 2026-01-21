import React from 'react';
import { useAuth } from '../auth';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Welcome to Connect!</h2>
      <p className="mb-6">You are logged in. This is your dashboard.</p>
      <button
        className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
        onClick={logout}
      >
        Log Out
      </button>
    </div>
  );
};

export default Dashboard; 