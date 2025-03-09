import React, { useEffect, useState } from 'react';
import { useAppContext } from '../AllContext/AllContext';
import user_icon from '../../assets/client_image/user_icon.jpeg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const { user, setUser, url, token, getUserInformation } = useAppContext();
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getUserInformation();
  }, []);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setUpdatedUser({ ...user });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setUpdatedUser({ ...updatedUser, profileImage: URL.createObjectURL(file) });
    }
  };

  const userUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', updatedUser.name);
      formData.append('email', updatedUser.email);
      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }

      const response = await fetch(`${url}/api/users/update`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        toast.error('Failed to update user information');
        return;
      }

      const userData = await response.json();
      setUser(userData.user);
      toast.success('User information updated successfully');

      setSelectedImage(null);
      getUserInformation();
    } catch (error) {
      console.log('Error updating user info:', error);
      toast.error('Something went wrong!');
    }
  };

  const handleSave = () => {
    userUpdate();
    setEditMode(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
          <label htmlFor="profileImage" className="cursor-pointer relative group">
            <img
              src={updatedUser.profileImage ? `${url}/${updatedUser.profileImage}` : user_icon}
              alt="Profile"
              className="h-24 w-24 rounded-full border-4 border-gray-300 object-cover"
            />
          </label>
          {editMode && (
            <input type="file" id="profileImage" accept="image/*" className="hidden" onChange={handleImageChange} />
          )}
        </div>

        <div className="text-center mt-4">
          {editMode ? (
            <input
              type="text"
              name="name"
              value={updatedUser.name || ''}
              onChange={handleChange}
              className="text-xl font-semibold text-gray-800 text-center border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <h2 className="text-xl font-semibold text-gray-800">{updatedUser.name || 'User Name'}</h2>
          )}
          <p className="text-gray-500">{updatedUser.email || 'No Email Provided'}</p>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-gray-700">Trip History</h3>
        {updatedUser.trips?.length > 0 ? (
          <div className="mt-2 space-y-2">
            {updatedUser.trips.map((trip, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
                <span className="text-blue-500">📍</span>
                <div>
                  <strong>{trip.origin}</strong> → <strong>{trip.destination}</strong>
                  <br />
                  <span className="text-gray-500 text-sm">📅 {new Date(trip.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-gray-500">No trips recorded yet.</p>
        )}

        <div className="mt-6 flex justify-center">
          {editMode ? (
            <>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                Save
              </button>
              <button onClick={() => setEditMode(false)} className="ml-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
