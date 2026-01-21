import React, { useEffect, useState } from 'react';
import { apiGet } from '../api';

const ApiStatus: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The API Gateway should expose a health or root endpoint
    apiGet('/')
      .then(() => {
        setStatus('API Gateway is reachable!');
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-indigo-600">Checking backend connection...</div>;
  if (error) return <div className="text-red-600">Backend error: {error}</div>;
  return <div className="text-green-600">{status}</div>;
};

export default ApiStatus; 