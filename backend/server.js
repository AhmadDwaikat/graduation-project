const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const uploadRoute = require('./routes/upload');
const cors = require('cors');

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Middleware to handle CORS
app.use(cors());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/upload', uploadRoute);

// Static folder for serving uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
