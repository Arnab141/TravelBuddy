import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../component/AllContext/AllContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  useEffect(() => {
    getUserInformation();
  }, []);

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
        toast.success("Trip posted successfully! 🎉", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        setTimeout(() => navigate("/"), 3000); // Redirect after toast
      } else {
        toast.error("Failed to post trip. Please try again!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error posting trip:", error);
      toast.error("Server error. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 bg-[url('/src/assets/client_image/postTrip_img.jpeg')]">
      <ToastContainer />
      <div className="bg-white bg-opacity-95 p-12 rounded-xl shadow-xl max-w-4xl w-full">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          🚗 Post a Trip
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Details */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Origin", name: "origin", type: "text", placeholder: "Start Location" },
              { label: "Destination", name: "destination", type: "text", placeholder: "Destination" },
              { label: "Date", name: "date", type: "date" },
              { label: "Time", name: "time", type: "time" },
              { label: "Seats Available", name: "seatsAvailable", type: "number", placeholder: "Seats Available" },
              { label: "Price Per Seat ($)", name: "pricePerSeat", type: "number", placeholder: "Price" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-gray-700 font-semibold">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={tripDetails[name]}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder={placeholder}
                />
              </div>
            ))}

            {/* Vehicle Type - Dropdown */}
            <div>
              <label className="block text-gray-700 font-semibold">Vehicle Type</label>
              <select
                name="vehicle"
                value={tripDetails.vehicle}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Select a vehicle</option>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Van">Van</option>
                <option value="Bus">Bus</option>
              </select>
            </div>

            {/* Pickup Point */}
            <div>
              <label className="block text-gray-700 font-semibold">Pickup Point</label>
              <input
                type="text"
                name="pickupPoint"
                value={tripDetails.pickupPoint}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Pickup Location"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {[
              { label: "Mobile Number", name: "mobileNumber", type: "tel", placeholder: "Phone Number" },
              { label: "Email", name: "email", type: "email", placeholder: "Email" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-gray-700 font-semibold">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={tripDetails[name]}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold">Description</label>
            <textarea
              name="description"
              value={tripDetails.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Any additional details about the trip..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            🚀 Post Trip
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostTrip;
