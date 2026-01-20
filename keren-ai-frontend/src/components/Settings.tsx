// Settings.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      if (accessToken) {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/logout`, // or hardcoded if needed
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
    } catch (error) {
      console.error('Logout request failed:', error);
      // Even if it fails, proceed to client-side cleanup
    } finally {
      // Clear all tokens and user data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userProfile'); // If you store the profile
      localStorage.removeItem('isLoggedIn');  // Any custom flag you use

      // Optionally clear everything:
      // localStorage.clear();

      // Redirect to root path
      navigate('/');
    }
  };

  return (
    <div className="text-center mt-20">
      <p>Settings Page</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
