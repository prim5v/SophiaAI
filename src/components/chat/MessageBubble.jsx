import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { UserIcon, BotIcon, FileTextIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const hasFiles = message.files && message.files.length > 0;

  // Timestamp
  const formattedTime = message.timestamp
    ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-3xl ${isUser ? 'flex-row-reverse' : ''}`}>
        
        {/* Avatar */}
        <div
          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-600' : 'bg-purple-600'
          }`}
        >
          {isUser ? (
            <UserIcon size={16} className="text-white" />
          ) : (
            <BotIcon size={16} className="text-white" />
          )}
        </div>

        {/* Message Wrapper */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>

          {/* Attached Files */}
          {hasFiles && (
            <div className="mb-2 flex flex-wrap gap-2">
              {message.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-md text-sm"
                >
                  <FileTextIcon size={14} className="text-blue-400" />
                  <span className="text-gray-300 max-w-[200px] truncate">{file.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`relative px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-gray-800 text-gray-100 rounded-tl-none'
            }`}
          >
            {/* COPY BUTTON — AI ONLY */}
            {!isUser && message.content && (
              <button
                onClick={handleCopy}
                className="absolute -top-3 -right-3 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full shadow-md transition"
              >
                {copied ? (
                  <CheckIcon size={14} className="text-green-400" />
                ) : (
                  <CopyIcon size={14} />
                )}
              </button>
            )}

            {/* Content */}
            {message.content ? (
              <div className="markdown-body">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="h-6 w-12 flex items-center justify-center">
                <div className="dot-typing"></div>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div
            className={`text-xs text-gray-500 mt-1 ${
              isUser ? 'text-right' : 'text-left'
            }`}
          >
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
