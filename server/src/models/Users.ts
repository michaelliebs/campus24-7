import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  bio: string;
  major: string;
  status: string;
  isAdmin: Boolean;
  comments: mongoose.Types.ObjectId[]; // references to comments made by the user
  eventsHosted: mongoose.Types.ObjectId[]; // references to events hosted by the user
  eventsAttending: mongoose.Types.ObjectId[]; // references to events the user is attending
  eventsInterested: mongoose.Types.ObjectId[]; // references to events the user is interested in
  profilePicture: string;
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
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    eventsHosted: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    eventsAttending: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    eventsInterested: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
