import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from 'lucide-react';
import ChatWindow from '../chat/ChatWindow';
import InputBar from '../chat/InputBar';
import { useChat } from '../../contexts/ChatContext';
const CreativeGenerator = () => {
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [activeConversation?.messages]);
  const handleSendMessage = (message, files) => {
    sendMessage(message, files);
  };
  const isEmpty = !activeConversation?.messages?.length;
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="flex flex-col h-full bg-gray-950 pt-16 md:pt-0">
      <div className="flex-1 overflow-hidden flex flex-col">
        {isEmpty ? <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <SparklesIcon className="h-8 w-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Creative Generator</h2>
            <p className="text-gray-400 max-w-md mb-6">
              Generate creative content like stories, poems, code, ideas, and more with a simple prompt.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {['Story', 'Poem', 'Code', 'Script', 'Email', 'Lyrics', 'Essay', 'Ideas'].map(type => <button key={type} onClick={() => handleSendMessage(`Generate a ${type.toLowerCase()}`)} className="border border-gray-700 hover:border-purple-500 hover:bg-purple-500/10 text-gray-300 hover:text-purple-300 px-4 py-2 rounded-lg transition-all">
                  {type}
                </button>)}
            </div>
          </div> : <ChatWindow messages={activeConversation?.messages || []} messagesEndRef={messagesEndRef} />}
      </div>
      <div className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto w-full px-4">
          <InputBar onSendMessage={handleSendMessage} isProcessing={isProcessing} uploadedFiles={uploadedFiles} placeholder="Describe what you want me to create..." />
        </div>
      </div>
    </motion.div>;
};
export default CreativeGenerator;