import React from 'react';
import { MenuIcon, BrainIcon } from 'lucide-react';
const MobileHeader = ({
  toggleSidebar
}) => {
  return <header className="md:hidden fixed top-0 left-0 right-0 z-10 bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="flex justify-between items-center">
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white p-1">
          <MenuIcon size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BrainIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            SophiaAI
          </span>
        </div>
        <div className="w-8"></div> {/* Empty div for flex spacing */}
      </div>
    </header>;
};
export default MobileHeader;