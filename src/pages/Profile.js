import React, { useEffect, useState } from "react";

// Profile page component for seller/admin users
const Profile = () => {
  // Placeholder state for user profile info (replace with API data later)
  const [profile, setProfile] = useState({
    username: "Admin1",
    position: "Manager",
    email: "admin1@udd.co.my",
    phone: "+60 143198830",
    storeName: "Kwee Long Trading Yong Peng",
    location: "Yong Peng, Johor",
    joinDate: "January 15, 2024",
  });

  // Fetch user profile from backend (later)
  useEffect(() => {
    // Simulate fetching from API
    // Replace this with actual fetch or axios call to backend
    // Example: fetch('/api/user/profile')
  }, []);

  // useEffect(() => {
  //   fetch("/api/user/profile")
  //     .then((res) => res.json())
  //     .then((data) => setProfile(data))
  //     .catch((err) => console.error(err));
  // }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          {/* Username */}
          <div>
            <p className="text-sm font-medium">Username</p>
            <p className="text-lg">{profile.username}</p>
          </div>

          {/* Position */}
          <div>
            <p className="text-sm font-medium">Position</p>
            <p className="text-lg">{profile.position}</p>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-lg">{profile.email}</p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-sm font-medium">Phone</p>
            <p className="text-lg">{profile.phone}</p>
          </div>

          {/* Store Name */}
          <div>
            <p className="text-sm font-medium">Store Name</p>
            <p className="text-lg">{profile.storeName}</p>
          </div>

          {/* Location */}
          {/* <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-lg">{profile.location}</p>
          </div> */}

          {/* Join Date */}
          <div className="sm:col-span-2">
            <p className="text-sm font-medium">Join Date</p>
            <p className="text-lg">{profile.joinDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
