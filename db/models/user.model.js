import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: { type: String, required: true, min: 4, max: 20 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    gender: { type: String, enum: ["male ", "female "] },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isConfirmed: { type: Boolean, required: false, default: false },
    activationCode: String,
    forGetCode: String,
    profileImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/ddqzfqu1j/image/upload/v1691297271/user/profile-avatar-buddyboss_lgstkx.webp",
      },
      id: {
        type: String,
        default: "profile-avatar-buddyboss_lgstkx",
      },
    },
    coverImage: [
      { url: { type: String, required: true } },
      { id: { type: String, required: true } },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
