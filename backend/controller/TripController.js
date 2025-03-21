const TripModel = require('../model/TripModel');
const TripParticipantModel = require('../model/TripParticipantModel');
const UserModel = require('../model/UserModel');
const TripRequestToJoinModel= require('../model/TripRequestToJoinModel.js')
const axios = require("axios");



const getCoordinates = async (location) => {
  const apiKey = "f749c5da4b76481d8416e76508509a86"; // Replace with your actual API key
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      return [lng, lat]; 
    } else {
      throw new Error("Location not found");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};



const postTrip = async (req, res) => {
  try {
    const { 
      userId, origin, destination, date, time, seatsAvailable, 
      vehicle, pickupPoints, description, mobileNumber, email 
    } = req.body;

    // Validate user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Get coordinates for origin & destination
    const originCoords = await getCoordinates(origin);
    const destinationCoords = await getCoordinates(destination);

    if (!originCoords || !destinationCoords) {
      return res.status(400).json({ msg: "Invalid origin or destination" });
    }

    // Ensure pickupPoints array exists
    if (!pickupPoints || !Array.isArray(pickupPoints) || pickupPoints.length === 0) {
      return res.status(400).json({ msg: "At least one pickup point is required" });
    }

    // Create new trip
    const trip = new TripModel({
      userId,
      origin,
      destination,
      originCoords,       
      destinationCoords,  
      date,
      time,
      seatsAvailable,
      vehicle,
      pickupPoints, 
      description,
      mobileNumber,
      email
    });

    const savedTrip = await trip.save();

    // Add trip host to TripParticipant collection
    const tripParticipant = new TripParticipantModel({
      tripId: savedTrip._id,
      users: [
        {
          userId,
          host: true,
          pickupPoint: pickupPoints[0]  // Assume the first pickup point for the host
        }
      ]
    });

    await tripParticipant.save();

    res.status(201).json({ success: true, trip: savedTrip, tripParticipant });
  } catch (error) {
    console.error("postTrip Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


const requestToJoinTrip = async (req, res) => {
  try {
    const { tripId, userId, pickupPoint } = req.body;

    const trip = await TripModel.findById(tripId).populate('userId');
    if (!trip) return res.status(404).json({ msg: "Trip not found" });

    // Ensure user isn't already in the trip
    const existingRequest = await TripRequestToJoinModel.findOne({ tripId, userId });
    if (existingRequest) return res.status(400).json({ msg: "Request already Submit" });

    const newRequest = new TripRequestToJoinModel({
      tripId,
      userId,
      hostId: trip.userId._id,
      pickupPoint,
      status: 'pending',
    });

    await newRequest.save();
    res.status(201).json({ success: true, msg: "Request sent to the trip host." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};



// Request a trip
const requestTrip = async (req, res) => {
  try {
    const { userId, origin, destination, date, time, seatsAvailable, pricePerSeat, vehicle, pickupPoint, description, mobileNumber, email } = req.body;

    const trip = new TripModel({
      userId,
      origin,
      destination,
      date,
      time,
      seatsAvailable,
      pricePerSeat,
      vehicle,
      pickupPoint,
      description,
      mobileNumber,
      email
    });

    const result = await trip.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("requestTrip:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all trips
const allTrips = async (req, res) => {
  try {
    const trips = await TripModel.find().populate('userId', 'name email profileImage');
    res.status(200).json(trips);
  } catch (error) {
    console.error("allTrips:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Join a trip
const joinTrip = async (req, res) => {
  try {
    const { tripId, userId, pickupPoint } = req.body;

    const trip = await TripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const tripParticipant = await TripParticipantModel.findOne({ tripId });
    if (!tripParticipant) {
      return res.status(404).json({ msg: "Trip participants not found" });
    }

    // Check if user is already a participant
    const isParticipant = tripParticipant.users.some(
      (participant) => participant.userId.toString() === userId
    );
    if (isParticipant) {
      return res.status(400).json({ msg: "User is already a participant" });
    }

    // Ensure pickupPoint contains required fields
    if (!pickupPoint || !pickupPoint.price || !pickupPoint.location) {
      return res.status(400).json({ msg: "Pickup point details are required" });
    }

    // Add user to participants with pickupPoint
    tripParticipant.users.push({
      userId,
      host: false,
      pickupPoint, // Add pickupPoint to meet schema validation
    });

    await tripParticipant.save();

    // Add user to trip participants and update available seats
    const updatedTrip = await TripModel.findByIdAndUpdate(
      tripId,
      {
        $push: { participants: { userId, joinedAt: Date.now(), pickupPoint } },
        $inc: { seatsAvailable: -1 },
      },
      { new: true }
    );

    res.status(200).json({ msg: "User joined the trip", trip: updatedTrip });
  } catch (error) {
    console.error("joinTrip error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// leave trip
const leaveTrip = async (req, res) => {
  try {
    const { tripId, userId } = req.body;

    const trip = await TripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const tripParticipant = await TripParticipantModel.findOne({ tripId });
    if (!tripParticipant) {
      return res.status(404).json({ msg: "Trip participants not found" });
    }

    // Check if user is a participant
    const userIndex = tripParticipant.users.findIndex(
      (participant) => participant.userId.toString() === userId
    );
    if (userIndex === -1) {
      return res.status(400).json({ msg: "User is not a participant" });
    }

    // Remove user from trip participants
    tripParticipant.users.splice(userIndex, 1);
    await tripParticipant.save();

    // Remove user from trip and update available seats
    const updatedTrip = await TripModel.findByIdAndUpdate(
      tripId,
      {
        $pull: { participants: { userId } },
        $inc: { seatsAvailable: 1 },
      },
      { new: true }
    );

    res.status(200).json({ msg: "User left the trip", trip: updatedTrip });
  } catch (error) {
    console.error("leaveTrip error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};




//Get trip by ID
const getTripById = async (req, res) => {
  try {
    console.log(req.params.id);
    const trip = await TripModel.findById(req.params.id).populate('userId', 'name email');
    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }
    res.status(200).json(trip);
  } catch (error) {
    console.error("getTripById:", error);
    res.status(500).json({ msg: "Server error" });
  }
};




const getUserTrip = async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from request body

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    // Find all trips where this user is a participant
    const participants = await TripParticipantModel.find({ "users.userId": userId })
      .populate({
        path: "tripId",
        model: "Trip", // Populate full trip details
      })
      .populate({
        path: "users.userId",
        model: "User", // Populate full user details
        select: "name profileImage email", // Get only relevant user fields
      });

    if (!participants.length) {
      return res.status(404).json({ msg: "No trips found for this user" });
    }

    // Format the response with all trips and their participants
    const tripsData = await Promise.all(
      participants.map(async (participant) => {
        // Get all user details from the users array in TripParticipantModel
        const usersDetails = await Promise.all(
          participant.users.map(async (user) => {
            const userData = await UserModel.findById(user.userId).select("name profileImage email");
            return {
              _id: userData._id,
              name: userData.name,
              profileImage: userData.profileImage,
              email: userData.email,
              host: user.host,
            };
          })
        );

        return {
          trip: {
            _id: participant.tripId._id,
            userId: participant.tripId.userId,
            origin: participant.tripId.origin,
            destination: participant.tripId.destination,
            originCoords: participant.tripId.originCoords,
            destinationCoords: participant.tripId.destinationCoords,
            date: participant.tripId.date,
            time: participant.tripId.time,
            seatsAvailable: participant.tripId.seatsAvailable,
            pricePerSeat: participant.tripId.pricePerSeat,
            vehicle: participant.tripId.vehicle,
            pickupPoint: participant.tripId.pickupPoint,
            description: participant.tripId.description,
            mobileNumber: participant.tripId.mobileNumber,
            email: participant.tripId.email,
          },
          users: usersDetails, // Return all user details in the trip
        };
      })
    );

    return res.status(200).json({ trips: tripsData });
  } catch (err) {
    console.error("Error in getUserTrip:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


// const getRequestMessage = async (req, res) => {
//   try {
//     const hostId = req.user._id; // Ensure the user is authenticated

//     const tripRequests = await TripRequestToJoinModel.find({ hostId, status: 'pending' })
//       .populate('userId', 'name email profileImage')
//       .populate('tripId', 'origin destination date time');

//     if (tripRequests.length === 0) {
//       return res.status(404).json({ success: false, msg: 'No pending trip requests' });
//     }

//     res.status(200).json({ success: true, tripRequests });

//   } catch (error) {
//     console.error('Error fetching trip requests:', error);
//     res.status(500).json({ success: false, msg: 'Server error' });
//   }
// };


const getRequestMessage = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch requests where the user is either the host or the requesting user
    const tripRequests = await TripRequestToJoinModel.find({
      $or: [{ hostId: userId }, { userId: userId }]
    })
      .populate('tripId', 'origin destination date time')
      .populate('userId', 'name email profileImage')
      .populate('hostId', 'name email profileImage')
      .exec();

    res.status(200).json({ success: true, tripRequests });
  } catch (error) {
    console.error('Error fetching trip requests:', error);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const hostId = req.user._id; // The host handling the request

    // Validate status input
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, msg: 'Invalid status' });
    }

    // Find the trip request
    const tripRequest = await TripRequestToJoinModel.findById(requestId);
    if (!tripRequest) {
      return res.status(404).json({ success: false, msg: 'Request not found' });
    }

    // Ensure only the host of the trip can update the request
    if (tripRequest.hostId.toString() !== hostId.toString()) {
      return res.status(403).json({ success: false, msg: 'Unauthorized action' });
    }

    // Update the request status
    tripRequest.status = status;
    await tripRequest.save();

    // Send response
    res.status(200).json({
      success: true,
      msg: `Trip request has been ${status}.`,
      tripRequest
    });

  } catch (error) {
    console.error('Error responding to request:', error);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};








module.exports = { postTrip, requestTrip, allTrips, joinTrip, getTripById, getUserTrip, requestToJoinTrip, getRequestMessage, respondToRequest, leaveTrip };