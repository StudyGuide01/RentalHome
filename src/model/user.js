import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      trim: true,
      unique: true, // Ensure email uniqueness
      lowercase: true, // Store emails in lowercase
    },
    password: {
      type: String,
      required: [true, 'User password is required'],
      trim: true, //   minlength: [6, 'Password must be at least 6 characters long'], // Example validation
    },
    role: {
      type: String,
      default: "user" // Default role if not specified
    }
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create the user model
const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;
