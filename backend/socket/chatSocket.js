import Message from "../models/Message.js";

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("join_class_conversation", (conversationId) => {
      socket.join(conversationId);

      console.log(`Socket ${socket.id} joined room ${conversationId}`);
    });

    socket.on("send_message", async ({ conversationId, content }) => {
      try {
        if (!socket.user) {
          return socket.emit("message_error", {
            message: "Unauthorized",
          });
        }

        // 1. Get the authenticated user from the socket
        const currentUser = socket.user;

        if (!conversationId || !content?.trim()) {
          return socket.emit("message_error", {
            message: "Conversation and message content are required",
          });
        }

        // 2. Safely extract ID (handles both .id and ._id depending on your auth middleware)
        const senderId = currentUser._id || currentUser.id;

        // 3. Create the message using currentUser
        const message = await Message.create({
          conversationId,
          senderId,
          senderModel: currentUser.role === "teacher" ? "teacher" : "student",
          content: content.trim(),
        });
        console.log("chatsocket message", message);

        // Explicitly pass the path and model to populate
        const populatedMessage = await message.populate({
          path: "senderId",
          model: currentUser.role === "teacher" ? "teacher" : "student", // Ensure model names match your Mongoose model definitions
          select: "name",
        });

        console.log("populated message", populatedMessage);

        io.to(conversationId).emit("new_message", populatedMessage);
      } catch (error) {
        console.error("Send message error:", error);

        socket.emit("message_error", {
          message: "Failed to send message",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected:", socket.id);
    });
  });
};

export default chatSocket;
