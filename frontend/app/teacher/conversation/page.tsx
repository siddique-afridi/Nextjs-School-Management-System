"use client";

import { useEffect, useState, useRef,useCallback } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Users,
  MessageCircle,
  ArrowLeft,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { socket } from "@/lib/socket";
import { useAuth } from "@/app/context/userContext";

import {
  fetchMyClassConversation,
  fetchConversationMessages,
} from "@/app/services/conversation.service";

type ConversationType = "class" | "direct";

interface Conversation {
  _id: string;
  type: ConversationType;
  classId: {
    _id: string;
    sclassName: string;
  };
}

interface SidebarConversation {
  id: string;
  name: string;
  type: ConversationType;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  online?: boolean;
}

interface ApiMessage {
  _id: string;
  conversationId: string;
  senderId: {
    _id: string;
    name: string;
  };
  content: string;
  createdAt: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  time: string;
  isMine: boolean;
  read: boolean;
}

export default function ConversationPage() {
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  const currentTeacherId = user._id;

  const hasInitiallyScrolled = useRef(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showNewMessages, setShowNewMessages] = useState(false);

  const [conversation, setConversation] = useState<Conversation | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [messageInput, setMessageInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [showConversationList, setShowConversationList] = useState(true);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });

    setShowNewMessages(false);
  };

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (isAtBottom) {
      setShowNewMessages(false);
    }
  };

  useEffect(() => {
    const loadConversation = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchMyClassConversation();

        const currentConversation = data.conversation;

        setConversation(currentConversation);

        const apiMessages: ApiMessage[] = await fetchConversationMessages(currentConversation._id);
        console.log("apimessage", apiMessages);


        const formattedMessages: Message[] = apiMessages.map((message) => ({
          id: message._id,
          senderId: message.senderId._id,
          senderName: message.senderId.name,
          content: message.content,
          time: new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMine: message.senderId._id === currentTeacherId,
          read: false,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Conversation loading error:", error);

        setError(error instanceof Error ? error.message : "Failed to load conversation");
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, []);

  useEffect(() => {
    if (!conversation) return;

    socket.connect();

    const handleConnect = () => {
      console.log("Frontend socket connected:", socket.id);

      socket.emit("join_class_conversation", conversation._id);
    };

const handleNewMessage = useCallback((message: ApiMessage) => {
  const container = messagesContainerRef.current;
  const isAtBottom =
    container &&
    container.scrollHeight - container.scrollTop - container.clientHeight < 100;

  // Safely extract sender details
  const senderObj = typeof message.senderId === "object" ? message.senderId : null;
  const senderIdStr = String(senderObj?._id || message.senderId || "");
  const currentUserIdStr = String(currentTeacherId || "");

  const formattedMessage: Message = {
    id: message._id,
    senderId: senderIdStr,
    senderName: senderObj?.name || "User",
    content: message.content,
    time: new Date(message.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isMine: Boolean(senderIdStr && currentUserIdStr && senderIdStr === currentUserIdStr),
    read: false,
  };

  // ✅ Call setMessages EXACTLY ONCE with a duplicate guard
  setMessages((previousMessages) => {
    if (previousMessages.some((m) => m.id === formattedMessage.id)) {
      return previousMessages;
    }
    return [...previousMessages, formattedMessage];
  });

  if (isAtBottom) {
    setTimeout(() => {
      scrollToBottom("smooth");
    }, 50);
  } else {
    setShowNewMessages(true);
  }
}, [currentTeacherId]);

useEffect(() => {
  if (!conversation) return;

  socket.connect();

  const handleConnect = () => {
    console.log("Frontend socket connected:", socket.id);
    socket.emit("join_class_conversation", conversation._id);
  };

  socket.on("connect", handleConnect);
  socket.on("new_message", handleNewMessage);

  return () => {
    socket.off("connect", handleConnect);
    socket.off("new_message", handleNewMessage);
    socket.disconnect();
  };
}, [conversation, handleNewMessage]);

    socket.on("connect", handleConnect);

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("connect", handleConnect);

      socket.off("new_message", handleNewMessage);

      socket.disconnect();
    };
  }, [conversation,currentTeacherId]);

  console.log("messages",messages);

  const handleSendMessage = () => {
    const content = messageInput.trim();

    if (!content || !conversation) return;

    socket.emit("send_message", {
      conversationId: conversation._id,
      content,
    });

    setMessageInput("");
  };

  // scroll to latest message

  useEffect(() => {
    if (messages.length > 0 && !hasInitiallyScrolled.current) {
      scrollToBottom("auto");
      hasInitiallyScrolled.current = true;
    }
  }, [messages]);

  console.log("messages", messages);
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-2rem)] min-h-150 items-center justify-center rounded-xl border border-border bg-background">
        {" "}
        <div className="flex items-center gap-2 text-muted-foreground">
          {" "}
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading conversations...{" "}
        </div>{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-2rem)] min-h-150 items-center justify-center rounded-xl border border-border bg-background">
        {" "}
        <div className="text-center">
          {" "}
          <MessageCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Unable to load conversations</h2>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex h-[calc(100vh-2rem)] min-h-150 items-center justify-center rounded-xl border border-border bg-background">
        {" "}
        <div className="text-center">
          {" "}
          <MessageCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">No conversations yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your class conversation will appear here.
          </p>
        </div>
      </div>
    );
  }

  const classConversation: SidebarConversation = {
    id: conversation._id,
    name: conversation.classId.sclassName,
    type: "class",
    lastMessage: "No messages yet",
    time: "",
  };

  return (
    <div className="flex h-[calc(100vh-96px)] md:h-[calc(100vh-112px)] overflow-hidden rounded-xl border border-border shadow-sm">
      {/* Conversation List */}
      <aside
        className={`flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-r border-border bg-card ${
          showConversationList ? "flex" : "hidden"
        } md:flex md:w-85`}
      >
        {/* Sidebar Header - fixed */}
        <div className="shrink-0 border-b border-border p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Messages</h1>
              <p className="text-xs text-muted-foreground">Stay connected with your classmates</p>
            </div>

            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* ONLY this list scrolls */}
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <div className="mb-2 px-2 pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Class Groups
            </p>
          </div>

          <ConversationItem
            conversation={classConversation}
            active
            onClick={() => setShowConversationList(false)}
          />

          <div className="mb-2 mt-6 px-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Direct Messages
            </p>
          </div>

          <div className="px-3 py-6 text-center">
            <MessageCircle className="mx-auto mb-2 h-7 w-7 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">No direct messages yet</p>
          </div>
        </div>
      </aside>

      {/* Chat Window */}
      <main
        className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${
          showConversationList ? "hidden" : "flex"
        } md:flex`}
      >
        {/* Chat Header - fixed */}
        <header className="flex h-18.25 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setShowConversationList(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-foreground">
                {conversation.classId.sclassName}
              </h2>
              <p className="text-xs text-muted-foreground">Class group</p>
            </div>
          </div>

          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
            <MoreVertical className="h-4 w-4" />
          </button>
        </header>

        {/* ONLY messages scroll */}
        <div
          ref={messagesContainerRef}
          onScroll={handleMessagesScroll}
          className="min-h-0 flex-1 overflow-y-auto bg-background p-4 md:p-6"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-8 w-8" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Welcome to {conversation.classId.sclassName}
                </h2>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Start the conversation with your classmates.
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={message.id}
                  //  ref={index === messages.length - 1 ? messagesEndRef : undefined}
                  className={`flex items-end gap-2 ${
                    message.isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  {!message.isMine && (
                    <img
                      src="/placeholder-user.jpg"
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  )}

                  <div
                    className={`flex max-w-[55%] flex-col ${
                      message.isMine ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-full wrap-break-word rounded-2xl px-4 py-2.5 text-sm ${
                        message.isMine
                          ? "rounded-tr-md bg-primary text-primary-foreground"
                          : "rounded-tl-sm bg-card text-foreground shadow-sm ring-1 ring-border"
                      }`}
                    >
                      {!message.isMine && (
                        <div className="mb-1 flex items-center gap-3 px-1">
                          <span className="text-xs font-extrabold">{message.senderName}</span>
                          <span className="text-[10px] text-muted-foreground">{message.time}</span>
                        </div>
                      )}
                      {message.content}
                    </div>

                    {message.isMine && (
                      <div className="mt-1 flex items-center gap-1 px-1">
                        <span className="text-[10px] text-muted-foreground">{message.time}</span>
                        <CheckCheck className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {message.isMine && (
                    <img
                      src="/placeholder.avif"
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Input - fixed */}
        <div className="shrink-0 border-t border-border bg-card p-3 md:p-4">
          <div className="mx-auto flex max-w-4xl items-end gap-2">
            <button className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
              <Paperclip className="h-5 w-5" />
            </button>

            <div className="relative flex-1">
              <textarea
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Write a message..."
                rows={1}
                className="max-h-32 min-h-10.5 w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 pr-11 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
                <Smile className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

interface ConversationItemProps {
  conversation: SidebarConversation;
  active: boolean;
  onClick: () => void;
}

function ConversationItem({ conversation, active, onClick }: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={`mb-1 flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
        active ? "bg-primary/10" : "hover:bg-accent"
      }`}
    >
      {" "}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {" "}
        <Users className="h-5 w-5" />{" "}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">{conversation.name}</p>

          <span className="shrink-0 text-[10px] text-muted-foreground">{conversation.time}</span>
        </div>

        <p className="mt-1 truncate text-xs text-muted-foreground">{conversation.lastMessage}</p>
      </div>
    </button>
  );
}
