import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { SendIcon, PaperclipIcon, XIcon, Loader2Icon } from 'lucide-react';
import FileUploader from './FileUploader';
import { useChat } from '../../contexts/ChatContext';
const InputBar = ({
  onSendMessage,
  isProcessing,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState('');
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const textareaRef = useRef(null);
  const {
    uploadedFiles,
    removeUploadedFile
  } = useChat();
  // Auto-resize textarea
  const handleTextareaChange = e => {
    const textarea = e.target;
    setMessage(textarea.value);
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    // Set the height based on scrollHeight (with a max height)
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  };
  const handleKeyDown = e => {
    // Send message on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleSendMessage = () => {
    if (message.trim() || uploadedFiles.length > 0) {
      onSendMessage(message, uploadedFiles);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  const toggleUploader = () => {
    setIsUploaderOpen(!isUploaderOpen);
  };
  return <div className="py-4">
      {/* File Uploader */}
      {isUploaderOpen && <div className="mb-4">
          <FileUploader onClose={() => setIsUploaderOpen(false)} />
        </div>}
      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && <div className="mb-3 flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => <div key={index} className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-md text-sm">
              <span className="text-gray-300 max-w-[200px] truncate">{file.name}</span>
              <button onClick={() => removeUploadedFile(file.name)} className="text-gray-400 hover:text-red-400">
                <XIcon size={14} />
              </button>
            </div>)}
        </div>}
      {/* Input Area */}
      <div className="relative flex items-end border border-gray-700 rounded-lg bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
        <textarea ref={textareaRef} value={message} onChange={handleTextareaChange} onKeyDown={handleKeyDown} placeholder={placeholder} disabled={isProcessing} className="flex-1 max-h-[200px] py-3 pl-4 pr-12 bg-transparent border-0 resize-none focus:ring-0 focus:outline-none text-white placeholder-gray-400" rows={1} />
        <div className="absolute right-2 bottom-2 flex items-center space-x-1">
          <button onClick={toggleUploader} disabled={isProcessing} className={`p-1.5 rounded-md ${isUploaderOpen ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>
            <PaperclipIcon size={18} />
          </button>
          <button onClick={handleSendMessage} disabled={isProcessing || !message.trim() && uploadedFiles.length === 0} className={`p-1.5 rounded-md ${isProcessing || !message.trim() && uploadedFiles.length === 0 ? 'text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
            {isProcessing ? <Loader2Icon size={18} className="animate-spin" /> : <SendIcon size={18} />}
          </button>
        </div>
      </div>
      {/* Typing indicator */}
      {isProcessing && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} className="mt-2 text-sm text-gray-500 flex items-center gap-2">
          <div className="dot-typing"></div>
          <span>AI is thinking...</span>
        </motion.div>}
    </div>;
};
export default InputBar;