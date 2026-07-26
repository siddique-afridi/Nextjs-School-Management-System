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

        const senderId = socket.user.id;

        if (!conversationId || !content?.trim()) {
          return socket.emit("message_error", {
            message: "Conversation and message content are required",
          });
        }

        const message = await Message.create({
          conversationId,
          senderId,
          content: content.trim(),
        });

        const populatedMessage = await message.populate("senderId", "name");

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
