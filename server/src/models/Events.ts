import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEvent extends Document {
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
    host: Types.ObjectId; // reference to the user hosting the event
    attendees: Types.ObjectId[]; // list of users attending
    comments: Types.ObjectId[]; // list of comments on the event
    email: string;
    phone: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g., "18:00"
    location: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attendees: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
    phone: { type: String },
    email: { type: String },
    status: { type: String, enum: ["upcoming", "ongoing", "completed"], default: "upcoming" },
  },
  { timestamps: true }
);  

export default mongoose.model<IEvent>("Event", eventSchema);
