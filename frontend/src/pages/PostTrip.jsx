import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../component/AllContext/AllContext";

function PostTrip() {
  const { token, url, user, getUserInformation } = useAppContext();
  const navigate = useNavigate();

  const [tripDetails, setTripDetails] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    seatsAvailable: "",
    pricePerSeat: "",
    vehicle: "",
    pickupPoint: "",
    description: "",
    mobileNumber: "",
    email: "",
  });

  if (!token) {
    return (
      <div className="text-center text-red-500 text-lg mt-10">
        You must be logged in to post a trip.
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripDetails({ ...tripDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/api/trips/post-trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...tripDetails,
          userId: user._id, 
        }),
      });
      if (response.ok) {
        navigate("/");
      } else {
        alert("Failed to post trip");
      }
    } catch (error) {
      console.error("Error posting trip:", error);
    }
  };

  useEffect(()=>{
    getUserInformation();
  },[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 bg-[url('/src/assets/client_image/postTrip_img.jpeg')]">
      <div className="bg-white bg-opacity-90 p-10 rounded-xl shadow-lg max-w-4xl w-full">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Post a Trip
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Origin", name: "origin", type: "text", placeholder: "Start Location" },
              { label: "Destination", name: "destination", type: "text", placeholder: "Destination" },
              { label: "Date", name: "date", type: "date" },
              { label: "Time", name: "time", type: "time" },
              { label: "Seats Available", name: "seatsAvailable", type: "number", placeholder: "Seats Available" },
              { label: "Price Per Seat", name: "pricePerSeat", type: "number", placeholder: "Price" },
              { label: "Vehicle", name: "vehicle", type: "text", placeholder: "Car/Bike/Bus" },
              { label: "Pickup Point", name: "pickupPoint", type: "text", placeholder: "Pickup Location" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-gray-700">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={tripDetails[name]}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            {[
              { label: "Mobile Number", name: "mobileNumber", type: "tel", placeholder: "Phone Number" },
              { label: "Email", name: "email", type: "email", placeholder: "Email" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-gray-700">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={tripDetails[name]}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={tripDetails.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional details about the trip"
            ></textarea>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Post Trip
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostTrip;
