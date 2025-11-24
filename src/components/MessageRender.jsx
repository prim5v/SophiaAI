import React, { useEffect, useRef } from "react";
import MessageContent from "../components/MessageContent";

const Message = ({ msg }) => (
  <div
    className={`p-1 rounded-xl max-w-[80%] ${
      msg.role === "user" ? "self-end bg-blue-600" : "self-start bg-gray-800 w-full"
    }`}
  >
    <MessageContent msg={msg} />
  </div>
);

const MessageRender = ({ messages, loadingAI, thinkingTime, thoughtText }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingAI]);

  return (
    <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2 h-[500px] scrollbar-hide relative">
      {thoughtText && (
        <div className="text-center text-gray-400 text-sm mb-1">{thoughtText}</div>
      )}

      {messages.map((msg) => (
        <Message key={msg.id} msg={msg} />
      ))}

      {loadingAI && (
        <div className="text-center text-gray-400 py-2">
          Thinking... {thinkingTime} second{thinkingTime !== 1 ? "s" : ""}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageRender;
