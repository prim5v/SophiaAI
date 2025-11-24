import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';

const ChatWindow = ({
  messages,
  messagesEndRef
}) => {

  // Removed generic AI welcome text as requested  
  const displayMessages = messages;

  return (
    <div className="flex-1 overflow-y-auto py-4 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence initial={false}>
          {displayMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-6"
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
