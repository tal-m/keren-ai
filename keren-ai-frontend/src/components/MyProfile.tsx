import React, { useEffect, useState } from 'react';

interface ConnectorImageDTO {
  id: string;
  url: string;
}

interface ConnectorSocialMediaDTO {
  platform: string;
  url: string;
}

interface UserProfile {
  userId: string;
  firstName: string;
  country: string;
  city: string;
  bio: string;
  galleryImages: ConnectorImageDTO[];
  socialMediaLinks: ConnectorSocialMediaDTO[];
}

const API_URL = 'http://localhost:4003/api';

const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/connectors/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch profile');

      const data = await res.json();
      setProfile(data);
      setOriginalProfile(data);
    } catch (err) {
      console.error('❌ Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field: keyof UserProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSocialMediaChange = (index: number, value: string) => {
    if (!profile) return;
    const updatedLinks = [...profile.socialMediaLinks];
    updatedLinks[index] = { ...updatedLinks[index], url: value };
    setProfile({ ...profile, socialMediaLinks: updatedLinks });
  };

  const getPartialUpdate = () => {
    if (!profile || !originalProfile) return {};

    const updatedFields: Partial<UserProfile> = {};

    if (profile.firstName !== originalProfile.firstName)
      updatedFields.firstName = profile.firstName;
    if (profile.country !== originalProfile.country)
      updatedFields.country = profile.country;
    if (profile.city !== originalProfile.city)
      updatedFields.city = profile.city;
    if (profile.bio !== originalProfile.bio)
      updatedFields.bio = profile.bio;

    const socialMediaDiff = profile.socialMediaLinks.filter((link, i) =>
      link.url !== originalProfile.socialMediaLinks[i]?.url
    );
    if (socialMediaDiff.length > 0) updatedFields.socialMediaLinks = profile.socialMediaLinks;

    return updatedFields;
  };

  const handleUpdate = async () => {
    if (!profile) return;

    const token = localStorage.getItem('accessToken');
    const partialUpdatePayload = getPartialUpdate();
    console.log('🔄 Partial Update Payload:', partialUpdatePayload);

    try {
      const res = await fetch(`${API_URL}/connectors/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(partialUpdatePayload),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const updated = await res.json();
      setOriginalProfile(updated);
      setProfile(updated);
    } catch (err) {
      console.error('❌ Error updating profile:', err);
    }
  };

  if (loading || !profile) return <div className="p-6 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">First Name</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Country</label>
          <input
            type="text"
            value={profile.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">City</label>
          <input
            type="text"
            value={profile.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-600">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
          />
        </div>
      </div>

      {/* Social Media Links */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Social Media</h3>
        {profile.socialMediaLinks.map((link, index) => (
          <div key={index} className="mb-2">
            <label className="block text-sm text-gray-600">{link.platform}</label>
            <input
              type="text"
              value={link.url}
              onChange={(e) => handleSocialMediaChange(index, e.target.value)}
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}
      </div>

      {/* Gallery */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Gallery</h3>
        <div className="flex gap-4 flex-wrap">
          {profile.galleryImages.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt="User gallery"
              className="w-24 h-24 rounded-lg object-cover border"
            />
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleUpdate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
