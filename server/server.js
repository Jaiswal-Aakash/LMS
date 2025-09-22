import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './configs/mongodb.js';

import { clerkWebhooks } from './controllers/webhooks.js';

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

// Debug endpoint to check environment variables
app.get('/debug', (req, res) => {
    res.json({
        message: "Environment Debug",
        CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET ? 
            `Set (length: ${process.env.CLERK_WEBHOOK_SECRET.length})` : "Not set",
        MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not set",
        NODE_ENV: process.env.NODE_ENV || "Not set"
    });
})

app.post('/clerk', express.json(), clerkWebhooks)



//port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});