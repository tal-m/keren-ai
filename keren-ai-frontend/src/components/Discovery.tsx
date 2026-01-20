import React, { useState, useEffect } from 'react';
import axios from 'axios';

type UserProfile = {
  id: string;
  name: string;
  country: string;
  profilePictureUrl?: string;
};

type DiscoveredUserRaw = {
  userId: string;
};

const Discovery: React.FC = () => {
  const [mode, setMode] = useState<'local' | 'traveler'>('traveler');
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [discoveredUsers, setDiscoveredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUserProfile = async (accessToken: string) => {
    try {
      const response = await axios.get("http://localhost:4003/api/connectors/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCurrentUserProfile(response.data);
    } catch (err) {
      console.error("Failed to fetch current user profile:", err);
      setError("Failed to load your profile. Please ensure you are logged in.");
    }
  };

  const fetchPublicProfile = async (userId: string, accessToken: string): Promise<UserProfile | null> => {
    try {
      const response = await axios.get(`http://localhost:4003/api/connectors/public/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch public profile for ${userId}:`, err);
      return null;
    }
  };

  const fetchDiscoveredUsers = async () => {
    setLoading(true);
    setError(null);

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("Authentication token not found. Please log in to see connections.");
      setLoading(false);
      return;
    }

    if (!currentUserProfile) {
      setLoading(false);
      return;
    }

    try {
      let discoveryEndpoint = "";
      if (mode === 'traveler') {
        discoveryEndpoint = "http://localhost:4003/api/discovery/public/travelers";
      } else {
        discoveryEndpoint = "http://localhost:4003/api/discovery/public/locals";
      }

      const discoveryResponse = await axios.get<DiscoveredUserRaw[]>(discoveryEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userIdsToFetch = discoveryResponse.data.map((user: DiscoveredUserRaw) => user.userId);

      const profilesPromises = userIdsToFetch.map(id => fetchPublicProfile(id, accessToken));
      const profiles = await Promise.all(profilesPromises);

      let validProfiles = profiles.filter(p => p !== null) as UserProfile[];

      // Filter users based on the current user's country
      if (currentUserProfile.country) {
        validProfiles = validProfiles.filter(user => user.country === currentUserProfile.country);
      }

      setDiscoveredUsers(validProfiles);

    } catch (err) {
      console.error("Failed to fetch discovered users:", err);
      setError("Failed to load discovered users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchCurrentUserProfile(accessToken);
    } else {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUserProfile) {
      fetchDiscoveredUsers();
    }
  }, [mode, currentUserProfile]);

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'local' ? 'traveler' : 'local'));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-indigo-700">
          Discovery ({mode === 'local' ? 'Locals' : 'Travelers'})
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 font-medium">Local Mode</span>
          <label htmlFor="mode-toggle" className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="mode-toggle"
              className="sr-only peer"
              checked={mode === 'traveler'}
              onChange={toggleMode}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
          </label>
          <span className="text-gray-700 font-medium">Traveler Mode</span>
        </div>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-600 text-lg py-10">
          Loading {mode === 'local' ? 'locals' : 'travelers'}...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {discoveredUsers.length > 0 ? (
            discoveredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105"
              >
                <img
                  src={user.profilePictureUrl || `https://placehold.co/100x100/E0E7FF/4F46E5?text=${user.name.charAt(0).toUpperCase()}`}
                  alt={`${user.name}'s profile`}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-indigo-400 shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://placehold.co/100x100/E0E7FF/4F46E5?text=${user.name.charAt(0).toUpperCase()}`;
                  }}
                />
                <h3 className="text-xl font-semibold text-indigo-800">{user.name}</h3>
                <p className="text-gray-600">{user.country}</p>
                <p className="text-sm text-gray-500 mt-2 italic">
                  {mode === 'traveler'
                    ? `Connect with ${user.name} for local insights and experiences.`
                    : `Connect with ${user.name} for shared travel stories.`
                  }
                </p>
                <button className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors shadow-md">
                  Connect
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 text-lg py-10">
              No {mode === 'local' ? 'locals' : 'travelers'} found in your country.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Discovery;
