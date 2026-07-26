import client from "@/lib/client";

export const createClassConversation = async (classId: string) => {
  const response = await client.post("/createClassConversation", {
    classId,
  });

  return response.data.conversation;
};

export const fetchMyClassConversation = async () => {
  const response = await client.get("/myClassConversation");

  return response.data;
};

export const fetchConversationMessages = async (conversationId: string) => {
  const response = await client.get(`/messages/conversation/${conversationId}`);

  return response.data.messages;
};
