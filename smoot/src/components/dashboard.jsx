import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from the endpoint
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = sessionStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/users/me',
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`, // Assuming you store the token in localStorage
                },
            }
        ); // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem('authToken');
    navigate('/login'); 
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6" style={{ fontFamily: 'montserrat' }}>
         <div className="flex items-center justify-between bg-white shadow-md p-4">
            <div className="text-white text-2xl font-bold">
              <a href="/">
                <img src="/smt.png" alt="logo" className="h-12 w-auto" />
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/settings" className="text-customBlue hover:text-gray-300">Settings</a>
              <button onClick={handleSignOut} className="bg-customBlue text-white px-4 py-2 rounded-lg">
                Sign Out
              </button>
            </div>
      </div>


      <div className="max-w-4xl m-12 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-customBlue text-white p-6 flex items-center space-x-6">
          <img
            src={user.profilePicture || '/gr.jpeg'} // Fallback to a default image
            alt="Profile"
            className="h-24 w-24 rounded-full border-4 border-white shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
            <p className="text-sm text-gray-200">{user.email}</p>
            <p className="text-sm text-gray-200">@{user.username}</p>
          </div>
        </div>

        {/* User Details Section */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">User Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-bold text-gray-500">First Name</h3>
              <p className="text-lg text-gray-700">{user.firstName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-bold text-gray-500">Last Name</h3>
              <p className="text-lg text-gray-700">{user.lastName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-bold text-gray-500">Username</h3>
              <p className="text-lg text-gray-700">@{user.username}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-bold text-gray-500">Email</h3>
              <p className="text-lg text-gray-700">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Actions</h2>
          <div className="flex space-x-4">
            <button className="bg-customBlue text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
              Edit Profile
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;