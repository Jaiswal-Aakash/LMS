import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';


// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());


// routes
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the LMS API" });
})
app.post('/clerk', express.json(), clerkWebhooks)



//port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});