import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  host: Types.ObjectId; // reference to the user hosting the event
  attendees: Types.ObjectId[]; // optional list of users attending
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
    attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>("Event", eventSchema);
