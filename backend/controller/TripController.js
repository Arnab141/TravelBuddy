const TripModel = require('../model/TripModel');
const TripParticipantModel = require('../model/TripParticipantModel');
const UserModel = require('../model/UserModel');
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
      pricePerSeat, vehicle, pickupPoint, description, mobileNumber, email 
    } = req.body;

    // Validate user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Get coordinates
    const originCoords = await getCoordinates(origin);
    const destinationCoords = await getCoordinates(destination);

    if (!originCoords || !destinationCoords) {
      return res.status(400).json({ msg: "Invalid origin or destination" });
    }

    // Create trip with coordinates
    const trip = new TripModel({
      userId,
      origin,
      destination,
      originCoords,       
      destinationCoords,  
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

    // Create trip participant entry
    const tripId = result._id;
    const users = [{ userId: userId, host: true }];
    const tripParticipant = new TripParticipantModel({
      tripId,
      users
    });
    await tripParticipant.save();

    res.status(201).json({ trip: result, tripParticipant });
  } catch (error) {
    console.error("postTrip:", error);
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

    // Check if user is already a participant
    const isParticipant = tripParticipant.users.some(participant => participant.userId.toString() === userId);
    if (isParticipant) {
      return res.status(400).json({ msg: "User is already a participant" });
    }

    // Add user to participants
    tripParticipant.users.push({ userId, host: false });
    await tripParticipant.save();
    
    // Add user to trip participants and update the seatsAvailable
    const updatedTrip = await TripModel.findByIdAndUpdate(
      tripId,
      {
        $push: { participants: { userId, joinedAt: Date.now() } }, 
        $inc: { seatsAvailable: -1 }
      },
      { new: true } 
    );  

    res.status(200).json({ msg: "User joined the trip", tripParticipant });
  } catch (error) {
    console.error("joinTrip:", error);
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

    // Find the trip where this user is a participant
    const participant = await TripParticipantModel.findOne({ "users.userId": userId })
      .populate({
        path: "tripId",
        model: "Trip", // Populate full trip details
      })
      .populate({
        path: "users.userId",
        model: "User", // Populate full user details
        select: "name profileImage email", // Get only relevant user fields
      });

    if (!participant) {
      return res.status(404).json({ msg: "No trip found for this user" });
    }

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

    // Format the response
    const tripDetails = {
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

    return res.status(200).json(tripDetails);
  } catch (err) {
    console.error("Error in getUserTrip:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = getUserTrip;




module.exports = { postTrip, requestTrip, allTrips, joinTrip, getTripById, getUserTrip };