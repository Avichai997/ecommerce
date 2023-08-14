import dotenv from 'dotenv';

dotenv.config();

export const { PORT = 3500, MONGODB_URL, JWT_SECRET, PAYPAL_CLIENT_ID } = process.env;
