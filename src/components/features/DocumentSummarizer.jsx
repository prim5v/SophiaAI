import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileTextIcon, UploadIcon } from 'lucide-react';
import ChatWindow from '../chat/ChatWindow';
import InputBar from '../chat/InputBar';
import { useChat } from '../../contexts/ChatContext';
const DocumentSummarizer = () => {
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
            <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <FileTextIcon className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Document Summarizer</h2>
            <p className="text-gray-400 max-w-md mb-6">
              Upload a document or paste text to get a comprehensive summary of the key points and insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                <UploadIcon size={18} />
                <span>Upload Document</span>
              </button>
              <button className="flex items-center gap-2 border border-gray-700 hover:border-gray-600 text-gray-300 px-6 py-3 rounded-lg transition-colors">
                <span>Paste Text</span>
              </button>
            </div>
          </div> : <ChatWindow messages={activeConversation?.messages || []} messagesEndRef={messagesEndRef} />}
      </div>
      <div className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto w-full px-4">
          <InputBar onSendMessage={handleSendMessage} isProcessing={isProcessing} uploadedFiles={uploadedFiles} placeholder="Upload a document or describe what you want to summarize..." />
        </div>
      </div>
    </motion.div>;
};
export default DocumentSummarizer;