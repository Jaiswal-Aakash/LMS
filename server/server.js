import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './configs/mongodb.js';
import { clerkWebhook } from './controllers/webhooks.js';

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());



// routes
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the LMS API" });
})
app.post('/clerk', express.json(), clerkWebhook)



//port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});