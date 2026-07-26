import Message from "../models/Message.js";

export const getConversationMessages = async (
  req,
  res,
) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversationId,
    })
      .populate(
        "senderId",
        "name",
      )
      .sort({ createdAt: 1 });

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error(
      "Get conversation messages error:",
      error,
    );

    return res.status(500).json({
      message: "Failed to get messages",
    });
  }
};
