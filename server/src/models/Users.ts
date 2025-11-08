import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  bio: string;
  major: string;
  status: string;
  isAdmin: Boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    password: { type: String, required: true },
    bio: { type: String },
    major: { type: String },
    status: { type: String },
    isAdmin: { type: Boolean },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
