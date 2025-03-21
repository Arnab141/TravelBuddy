import React, { useState } from 'react';
import { useAppContext } from '../AllContext/AllContext';
import './Usercard.css';
import user_icon from '../../assets/client_image/user_icon.jpeg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Usercard({ trip: initialTrip }) {
  const { token, url, user } = useAppContext();
  const [trip, setTrip] = useState(initialTrip);
  const [selectedPickup, setSelectedPickup] = useState(trip.pickupPoints?.[0] || null);

  const handleRequestToJoin = async () => {
    if (!selectedPickup) {
      toast.warn('Please select a pickup point.');
      return;
    }
    try {
      const response = await fetch(`${url}/api/trips/request-to-join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tripId: trip._id,
          userId: user._id,
          pickupPoint: selectedPickup, // Sending the correct object
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Successfully request  submit 🎉');
        setTrip(prevTrip => ({
          ...prevTrip,
          participants: [...prevTrip.participants, { userId: user, joinedAt: new Date() }],
          seatsAvailable: prevTrip.seatsAvailable - 1,
        }));
      } else {
        toast.error(result.msg || 'Failed to join the trip.');
      }
    } catch (error) {
      console.error('Error joining trip:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 transition transform hover:scale-105 hover:shadow-lg">
      {/* User Info */}
      <div className="flex items-center space-x-4">
        <img
          src={trip.userId?.profileImage ? `${url}/${trip.userId.profileImage}` : user_icon}
          alt="User"
          className="w-16 h-16 rounded-full border-2 border-blue-300"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{trip.userId?.name || 'Unknown User'}</h3>
          <p className="text-sm text-gray-600"><strong>From:</strong> {trip.origin} → <strong>To:</strong> {trip.destination}</p>
          <p className="text-sm text-gray-600"><strong>Seats:</strong> {trip.seatsAvailable}</p>
        </div>
      </div>

      {/* Trip Details */}
      <div className="mt-4 text-gray-700 space-y-2">
        <p><strong>Date:</strong> {new Date(trip.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {trip.time}</p>
        <p><strong>Vehicle:</strong> {trip.vehicle}</p>
        <p><strong>Description:</strong> {trip.description}</p>

        {/* Pickup Points Selection */}
        <div>
          <label className="font-semibold">Select Pickup Point:</label>
          <select
            value={selectedPickup?.location || ""}
            onChange={(e) => {
              const selected = trip.pickupPoints.find(point => point.location === e.target.value);
              setSelectedPickup(selected);
            }}
            className="block w-full mt-1 p-2 border rounded-md"
          >
            {trip.pickupPoints.map((point, index) => (
              <option key={index} value={point.location}>
                {point.location} - ₹{point.price}
              </option>
            ))}
          </select>
        </div>

        {/* Contact Details */}
        <p><strong>Phone:</strong> <a href={`tel:${trip.mobileNumber}`} className="text-blue-500">{trip.mobileNumber}</a></p>
        <p><strong>Email:</strong> <a href={`mailto:${trip.email}`} className="text-blue-500">{trip.email}</a></p>

        {/* Participants */}
        <div className="mt-3">
          <strong>Participants:</strong>
          {trip.participants.length > 0 ? (
            trip.participants.map((participant, index) => (
              <span key={index}> {participant.userId?.name || 'Unknown'}{index !== trip.participants.length - 1 ? ', ' : ''}</span>
            ))
          ) : (
            <span> No one has joined yet.</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-5">
        <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">Chat</button>
        <button
          className={`px-4 py-2 rounded-md transition ${
            user._id === trip.userId?._id ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          onClick={handleRequestToJoin}
          disabled={user._id === trip.userId?._id}
        >
          {user._id === trip.userId?._id ? 'You are the Host' : 'Request to join'}
        </button>
      </div>
    </div>
  );
}

export default Usercard;
