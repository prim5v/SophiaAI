import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatWindow from '../chat/ChatWindow';
import InputBar from '../chat/InputBar';
import { useChat } from '../../contexts/ChatContext';

const ChatView = () => {
  const {
    getActiveConversation,
    sendMessage,
    isProcessing,
    uploadedFiles
  } = useChat();

  const activeConversation = getActiveConversation();
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages?.length]);

  const handleSendMessage = (message, files) => {
    if (!message && (!files || files.length === 0)) return; // avoid empty sends
    sendMessage(message, files);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-gray-950 pt-16 md:pt-0"
    >
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatWindow
          messages={activeConversation?.messages || []}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <div className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto w-full px-4">
          <InputBar
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
            uploadedFiles={uploadedFiles}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ChatView;
