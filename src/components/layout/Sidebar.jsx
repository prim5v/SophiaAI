import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BrainIcon, MessageSquareIcon, FileTextIcon, SparklesIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import ProfileOverview from './ProfileOverview';

const Sidebar = () => {
  const navigate = useNavigate();
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    deleteConversation
  } = useChat();

  const [hoveredConversation, setHoveredConversation] = useState(null);

  const handleNewChat = () => {
    const newConv = createNewConversation();
    setActiveConversationId(newConv.tempId);
    navigate('/dashboard/chat');
  };

  const handleConversationClick = idOrTempId => {
    setActiveConversationId(idOrTempId);
    navigate('/dashboard/chat');
  };

  return (
    <div className="h-full w-72 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BrainIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            SophiaAI
          </span>
        </div>
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="mx-4 mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <PlusIcon size={18} />
        <span>New Chat</span>
      </button>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          <NavItem
            to="/dashboard/summarize"
            icon={<FileTextIcon size={18} />}
            label="Document Summarizer"
          />
          <NavItem
            to="/dashboard/creative"
            icon={<SparklesIcon size={18} />}
            label="Creative Generator"
          />
        </ul>
      </nav>

      {/* Conversations */}
      {conversations.length > 0 && (
        <div className="mt-6 flex-1 overflow-y-auto">
          <div className="px-4 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
             Conversations
          </div>
          <ul className="space-y-1 px-3">
            {conversations.map(conversation => {
              const key = conversation.id || conversation.tempId;
              return (
                <li
                  key={key}
                  onMouseEnter={() => setHoveredConversation(key)}
                  onMouseLeave={() => setHoveredConversation(null)}
                >
                  <button
                    onClick={() => handleConversationClick(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between group ${
                      activeConversationId === key
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquareIcon size={16} />
                      <span className="truncate">{conversation.title || 'New Chat'}</span>
                    </div>
                    {(hoveredConversation === key || activeConversationId === key) && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteConversation(key);
                        }}
                        className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon size={16} />
                      </button>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Profile Overview */}
      <ProfileOverview />
    </div>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800/50'
          }`
        }
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

export default Sidebar;
