const express = require('express');
const cors = require('cors');
const coinRoutes = require('./routes/coins');
const portfolioRoutes = require('./routes/portfolio');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/coins', coinRoutes);
app.use('/api/crypto', coinRoutes); // Add alias for crypto routes
app.use('/api/portfolio', portfolioRoutes);

// Health check route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'welcome to crytocurrency tracker API' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});