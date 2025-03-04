const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = require('./mongo/db');
const UserRoute = require('./route/UserRoute');
const TripRoute = require('./route/TripRoute');



connectDB();

app.use(cors());
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 




app.use('/uploads', express.static('uploads'));
app.use('/api/users', UserRoute);
app.use('/api/trips', TripRoute);






app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
