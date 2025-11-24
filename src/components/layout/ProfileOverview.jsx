import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, ChevronDown, ChevronUp, User } from "lucide-react";

const ProfileOverview = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  if (!user) return null; // don't render if not logged in

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  return (
    <div className="mt-auto border-t border-gray-800 p-4">
      {/* Collapsed profile button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
      >
        <div className="flex items-center gap-2">
          <User size={18} />
          <span>{user.username}</span>
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Expanded panel */}
      {isOpen && (
        <div className="mt-2 bg-gray-900 rounded-lg p-3 space-y-2">
          {/* Email display */}
          <div className="text-gray-300 text-sm truncate">{user.email}</div>

          {/* Action buttons */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
          >
            <LogOut size={16} />
            Logout
          </button>

          <button
            onClick={() => alert("Personalization clicked!")}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            Personalization
          </button>

          {/* Help collapsible */}
          <div>
            <button
              onClick={() => setHelpOpen(!helpOpen)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            >
              Help
              {helpOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {helpOpen && (
              <div className="mt-1 ml-2 bg-gray-800 p-2 rounded-lg space-y-1 text-gray-300 text-sm">
                <button
                  onClick={() => alert("Help Center clicked!")}
                  className="block w-full text-left hover:text-white"
                >
                  Help Center
                </button>
                <button
                  onClick={() => alert("Contact Support clicked!")}
                  className="block w-full text-left hover:text-white"
                >
                  Contact Support
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileOverview;
