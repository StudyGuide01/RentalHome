import connectToDatabase from "@/database/db";
import UserModel from "@/model/user"; // Import the user model
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
const saltRounds = 10;

// Connect to the database
await connectToDatabase();

export async function POST(req) {
  try {
    const body = await req.json();
    const updatedBody = { ...body, role: "user" }; // Adding role to the user data

    console.log("User data to be saved:", updatedBody); // Debugging line to check the user data

    // Find user by email
    const user = await UserModel.findOne({ email: updatedBody.email });
    
    if (!user) {
      //hash a password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(updatedBody.password, salt);
      updatedBody.password = hash;


      // Save the user to the database
      const savedUser = await UserModel.create(updatedBody);
      return NextResponse.json({ status: 201, message: "User created successfully", data: savedUser });
    } else {
      return NextResponse.json({ status: 409, message: "User already exists! Please sign up with a different account." });
    }

  } catch (error) {
    console.error('Error creating user:', error); // Log the error for debugging
    return NextResponse.json({ status: 500, message: "Error creating user", error: error.message });
  }
}
