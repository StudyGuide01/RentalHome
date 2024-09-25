import connectToDatabase from "@/database/db";
import UserModel from "@/model/user";
import { NextResponse } from "next/server";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Corrected the spelling

await connectToDatabase();

export async function POST(req) {
    try {
        const body = await req.json();

        // Find user by email
        const user = await UserModel.findOne({ email: body.email });
        if (!user) {
            return NextResponse.json({ status: 404, message: "User does not exist! Please verify your account." });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ status: 404, message: "Invalid credentials" });
        }

        // Create a unique secret key for the user
        const data = [
            user.email, // Use user's email for uniqueness
            "1234567058954",
            "/*-+=-0987654321`",
            "/^[^\\s@]+@[^\s@]+\\.[^\s@]+$/"
        ];

        // Combine the data
        const combinedData = data.join('');

        // Create a secret key using SHA-256
        const secretKey = crypto.createHash('sha256').update(combinedData).digest('hex');

        console.log("Secret Key:", secretKey);

        const payload = { subject: user.email };
        const token = jwt.sign(payload, secretKey);

        // Return the token and user data
        return NextResponse.json({ status: 200, message: "User logged in", data: { ...body, token } });
    } catch (error) {
        console.error("Error during login:", error); // Log the error for debugging
        return NextResponse.json({ status: 500, message: "Internal server error" });
    }
}
