import React from 'react';
import { useAppContext } from '../AllContext/AllContext';
import user_icon from '../../assets/client_image/user_icon.jpeg'
import './Profile.css';

function Profile() {
  const { user } = useAppContext();
   console.log(user);
  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Image with Default Icon */}
        <img 
          src={user.profileImage || user_icon} 
          alt="Profile" 
          className="profile-image" 
        />
        
        {/* User Info */}
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <p className="profile-info"><strong>Mobile Number:</strong> {user.mobileNumber || 'Not Provided'}</p>
        <p className="profile-info"><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

        {/* Trip Details Section */}
        <h3 className="trip-header">Trip History</h3>
        {user.trips && user.trips.length > 0 ? (
          <div className="trip-list">
            {user.trips.map((trip, index) => (
              <div key={index} className="trip-item">
                <span className="trip-icon">📍</span>
                <div className="trip-details">
                  <strong>{trip.origin}</strong> → <strong>{trip.destination}</strong>  
                  <br />
                  <span className="trip-date">📅 {new Date(trip.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-trips">No trips recorded yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
