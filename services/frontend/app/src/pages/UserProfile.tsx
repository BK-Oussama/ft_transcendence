import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatApi } from '../api/chat.api';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await chatApi.getUserProfile(Number(id));
        setProfile(data);
      } catch (err) {
        console.error("Profile fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="p-20 text-center font-bold text-gray-400">
      Loading user profile...
    </div>
  );

  if (!profile) return (
    <div className="p-20 text-center">
      <p className="font-bold text-red-400 mb-4">User not found</p>
      <button onClick={() => navigate(-1)} className="text-blue-600 underline">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center">
        {/* Avatar */}
        <img 
          src={profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`} 
          className="w-32 h-32 rounded-3xl object-cover shadow-xl mb-6 border-4 border-white"
          alt="Avatar"
        />

        {/* Username / Full Name */}
        <h1 className="text-3xl font-black text-gray-900 capitalize">
          {profile.firstName} {profile.lastName}
        </h1>

        {/* Role / Job Title */}
        <p className="text-blue-600 font-bold mb-2 uppercase tracking-widest text-xs">
          {profile.jobTitle || 'Member'}
        </p>

        {/* Bio */}
        <p className="text-gray-500 text-center max-w-md mb-8 leading-relaxed italic">
          "{profile.bio || "No bio added yet."}"
        </p>
        
        {/* Contact Info (Gmail) */}
        <div className="w-full border-t border-gray-50 pt-6 flex justify-center text-center">
          <div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
              Email Address
            </p>
            <p className="text-sm font-bold text-gray-700">
              {profile.email || 'Private Profile'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Back Button */}
      <div className="mt-6 text-center">
        <button 
          onClick={() => navigate(-1)} 
          className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
        >
          ← Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default UserProfile;