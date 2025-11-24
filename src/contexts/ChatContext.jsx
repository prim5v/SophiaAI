import React, { createContext, useContext, useState, useEffect } from "react";
import { createApiClient } from "../utils/ApiSocket";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const token = localStorage.getItem("token"); // auth token
  const api = createApiClient(token);

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch all user conversations on mount
  const fetchConversations = async () => {
    try {
      const res = await api.get("/get_all_users_conversations");
      if (res.data.status === "success") {
        setConversations(
          res.data.data.map(c => ({
            id: c.conversation_id,
            title: c.conversation_name || "New Chat",
            type: c.conversation_type,
            messages: [] // messages loaded on-demand
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Get active conversation
  const getActiveConversation = () =>
    conversations.find(c => c.id === activeConversationId) ||
    conversations.find(c => c.id === null);

  // Create frontend-only conversation
  const createNewConversation = () => {
    const newConv = {
      id: null,
      title: "New Chat",
      type: "chat",
      messages: []
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(null);
    return newConv;
  };

  // Delete conversation
  const deleteConversation = async id => {
    if (!id) {
      // frontend-only conversation
      setConversations(prev => prev.filter(c => c.id !== null));
      return;
    }

    try {
      await api.delete(`/delete_conversation/${id}`);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConversationId === id) setActiveConversationId(null);
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  // Load messages for active conversation
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversationId) return;

      const conv = conversations.find(c => c.id === activeConversationId);
      if (!conv || conv.messages.length) return; // already loaded

      try {
        const res = await api.get(`/get_all_conversation_messages/${activeConversationId}`);
        if (res.data.status === "success") {
          const loadedMessages = res.data.data.map(m => ({
            id: m.id,
            role: m.role === "user" ? "user" : "assistant",
            content: m.content
          }));

          setConversations(prev =>
            prev.map(c =>
              c.id === activeConversationId ? { ...c, messages: loadedMessages } : c
            )
          );
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    loadMessages();
  }, [activeConversationId, conversations]);

  // Send message
  const sendMessage = async (message, files) => {
    const conversationId = activeConversationId;

    if (!conversationId) {
      // frontend-only conversation
      setConversations(prev =>
        prev.map(c =>
          c.id === null
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { role: "user", content: message },
                  { role: "assistant", content: "AI response will appear here" }
                ]
              }
            : c
        )
      );
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("prompt", message);
      formData.append("conversation_id", conversationId);

      if (files && files.length > 0) {
        files.forEach(file => formData.append("file", file));
      }

      const res = await api.post("/ai/logged_in_user", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const parsed = res.data;
      const responseText = parsed.response || "No response from AI";

      // Update messages
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { role: "user", content: message },
                  { role: "assistant", content: responseText }
                ],
                title: parsed.additional_context?.conversation_name || c.title,
                type: parsed.additional_context?.conversation_type || c.type
              }
            : c
        )
      );

    } catch (err) {
      console.error("Send message failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        setActiveConversationId,
        getActiveConversation,
        createNewConversation,
        deleteConversation,
        sendMessage,
        isProcessing,
        uploadedFiles
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
