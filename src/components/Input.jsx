import React from "react";
import { motion } from "framer-motion";


const Input = ({
  input,
  setInput,
  handleSend,
  file,
  setFile,
  showAttachOptions,
  setShowAttachOptions
}) => {
  return (
    <motion.div className={`w-full max-w-2xl mx-auto bg-gray-900 rounded-3xl p-4 shadow-lg flex flex-col gap-2 z-10 transition-all duration-300`}>
      {file && (
        <div className="text-gray-300 text-sm mb-2 flex items-center justify-between bg-gray-800 px-3 py-1 rounded-xl">
          {file.name}
          <button className="ml-2 text-red-500" onClick={() => setFile(null)}>×</button>
        </div>
      )}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a message..."
        className="flex-1 px-4 py-3 rounded-3xl bg-gray-800 text-white outline-none w-full"
      />

      <div className="flex justify-between items-center mt-2">
        <button
          id="attach-button"
          onClick={() => setShowAttachOptions(!showAttachOptions)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl text-sm font-semibold"
        >
          Attach
        </button>
        <button
          onClick={handleSend}
          className="px-6 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 font-semibold"
        >
          Send
        </button>
      </div>

      {showAttachOptions && (
        <div id="attach-options" className="flex gap-2 mt-2 justify-start flex-wrap">
          <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl cursor-pointer">
            Image
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
          </label>
          <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl cursor-pointer">
            Document
            <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
          </label>
        </div>
      )}
    </motion.div>
  );
};

export default Input;
