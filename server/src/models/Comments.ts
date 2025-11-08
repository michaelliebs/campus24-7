import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
    content: string;
    event: Types.ObjectId; // reference to the event
    user: Types.ObjectId; // reference to the user who made the comment
    createdAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        content: { type: String, required: true },
        event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IComment>("Comment", commentSchema);
