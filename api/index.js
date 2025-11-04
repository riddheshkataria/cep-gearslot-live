const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
// --- 1. Initial Setup ---
// Load environment variables from .env file
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- 2. Connect to Database ---
connectDB();

// --- 3. Middleware ---

// THIS IS THE FIX:
// Using the default cors() setup allows all origins.
// This is the easiest way to solve preflight request errors.
// It MUST be placed before the API routes.
app.use(cors({
  origin: ['http://localhost:5173','https://gearslot-frontend.vercel.app'], // Must be the exact origin
  credentials: true               // This allows cookies
}));

app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser());

// --- 4. API Routes ---
// All your routes come AFTER the cors() middleware
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/trainees', require('./routes/trainees'));
app.use('/api/slots', require('./routes/slots'));
// --- 5. Export the app for Vercel ---
module.exports = app;