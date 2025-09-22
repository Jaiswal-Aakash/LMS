import { Webhook } from "svix";
import User from "../models/User.js";

//API Controller to handle  Clerk User wwith DB
export const clerkWebhooks = async (req, res) => {
    console.log("=== WEBHOOK DEBUG START ===");
    console.log("Environment variables check:");
    console.log("CLERK_WEBHOOK_SECRET exists:", !!process.env.CLERK_WEBHOOK_SECRET);
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    
    try {
        // Debug: Check if webhook secret exists
        if (!process.env.CLERK_WEBHOOK_SECRET) {
            console.log("ERROR: CLERK_WEBHOOK_SECRET is not defined");
            return res.status(500).json({ message: "Webhook secret not configured" });
        }
        
        console.log("Webhook secret length:", process.env.CLERK_WEBHOOK_SECRET.length);
        console.log("Webhook secret starts with:", process.env.CLERK_WEBHOOK_SECRET.substring(0, 10));
        
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await wh.verify(JSON.stringify(req.body), {
            "svix-id": req.headers['svix-id'],
            "svix-timestamp": req.headers['svix-timestamp'],
            "svix-signature": req.headers['svix-signature']
        });
        const { data, type } = req.body;
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageURL: data.image_url || "", // Provide default empty string if no image
                }
                console.log("Creating user with data:", userData);
                await User.create(userData);
                console.log("User created successfully");
                res.status(200).json({ message: "User created successfully" });
                break;
            }
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageURL: data.image_url || "", // Provide default empty string if no image
                }
                console.log("Updating user with data:", userData);
                await User.findByIdAndUpdate(data.id, userData);
                console.log("User updated successfully");
                res.status(200).json({ message: "User updated successfully" });
                break;

            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                res.status(200).json({ message: "User deleted successfully" });
                break;
            }
            default:
                break;
        }
    } catch (error) {
        console.log("=== WEBHOOK ERROR ===");
        console.log("Error type:", error.constructor.name);
        console.log("Error message:", error.message);
        console.log("Error stack:", error.stack);
        
        if (error.message.includes("Base64Coder: incorrect characters for decoding")) {
            console.log("ERROR: Invalid CLERK_WEBHOOK_SECRET format");
            return res.status(500).json({ 
                message: "Invalid webhook secret format", 
                error: "The CLERK_WEBHOOK_SECRET environment variable has an invalid format. Please check your Vercel environment variables."
            });
        }
        
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

}