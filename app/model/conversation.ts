import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
export const Conversation = mongoose.models.Conversation||mongoose.model("Conversation", conversationSchema);
