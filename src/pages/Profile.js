import React, { useEffect, useState } from "react";

// Profile page component for seller/admin users
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [joinDateInput, setJoinDateInput] = useState("");

  useEffect(() => {
    // Simulate fetching from localStorage or cookie session after login
    const userData = JSON.parse(localStorage.getItem("user")); // Replace with secure fetch if using cookies
    if (userData) {
      setProfile({
        username: userData.username,
        position: userData.role,
        email: userData.email,
        phone: userData.phoneNumber,
        storeName: "Kwee Long Trading Yong Peng", // Fixed value
        location: "Yong Peng, Johor", // Optional
        joinDate: "", // Initially empty
      });
    }else {
      window.location.href = "/login"; // Or use React Router's navigate
    }
  }, []);

  const handleSaveJoinDate = () => {
    setProfile({ ...profile, joinDate: joinDateInput });
    setIsEditing(false);
  };

  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="text-sm font-medium">Username</p>
            <p className="text-lg">{profile.username}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Position</p>
            <p className="text-lg">{profile.position}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-lg">{profile.email}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Phone</p>
            <p className="text-lg">{profile.phone}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Store Name</p>
            <p className="text-lg">{profile.storeName}</p>
          </div>

          {/* <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-lg">{profile.location}</p>
          </div> */}

          <div className="sm:col-span-2">
            <p className="text-sm font-medium">Join Date</p>
            {isEditing ? (
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1"
                  placeholder="Enter join date"
                  value={joinDateInput}
                  onChange={(e) => setJoinDateInput(e.target.value)}
                />
                <button
                  onClick={handleSaveJoinDate}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-lg">
                  {profile.joinDate || "Not set"}
                </p>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setJoinDateInput(profile.joinDate || "");
                  }}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
