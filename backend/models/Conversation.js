import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["CLASS"],
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass",
      required: true,
      unique: true,
    },

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema,
);

export default Conversation;
