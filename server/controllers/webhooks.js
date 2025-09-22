import { Webhook } from "svix";
import User from "../models/User.js";

//API Controller to handle  Clerk User wwith DB
export const clerkWebhook = async (req, res) => {
    try {
        console.log('Received webhook:', {
            headers: req.headers,
            body: req.body
        });

        if (!process.env.CLERK_WEBHOOK_SECRET) {
            throw new Error('CLERK_WEBHOOK_SECRET is not set');
        }

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        try {
            await wh.verify(JSON.stringify(req.body), {
                "svix-id": req.headers['svix-id'],
                "svix-timestamp": req.headers['svix-timestamp'],
                "svix-signature": req.headers['svix-signature']
            });
        } catch (error) {
            console.error('Webhook verification failed:', error);
            return res.status(400).json({ error: 'Webhook verification failed' });
        }

        const { data, type } = req.body;
        console.log('Webhook type:', type);
        console.log('Webhook data:', data);
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,

                }
                await User.create(userData);
                res.status(200).json({ message: "User created successfully" });
                break;
            }
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,

                }
                await User.findByIdAndUpdate(data.id, userData);
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
        console.log("Error in Clerk Webhook: ", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

}