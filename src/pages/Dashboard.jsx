import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import ChatView from '../components/features/ChatView';
import DocumentSummarizer from '../components/features/DocumentSummarizer';
import CreativeGenerator from '../components/features/CreativeGenerator';
import MobileHeader from '../components/layout/MobileHeader';
import { useChat } from '../contexts/ChatContext';
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const {
    createNewConversation,
    setActiveConversationId
  } = useChat();
  // Check if mobile on initial render and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  // Handle creating a new conversation based on the route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard/summarize') {
      createNewConversation('summarize');
    } else if (path === '/dashboard/creative') {
      createNewConversation('creative');
    }
  }, [location.pathname, createNewConversation]);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Mobile Header */}
      {isMobile && <MobileHeader toggleSidebar={toggleSidebar} />}
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && <motion.div initial={{
        x: -280
      }} animate={{
        x: 0
      }} exit={{
        x: -280
      }} transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }} className={`${isMobile ? 'absolute z-20' : 'relative'} h-full`}>
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </motion.div>}
      </AnimatePresence>
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<ChatView />} />
            <Route path="/chat" element={<ChatView />} />
            <Route path="/summarize" element={<DocumentSummarizer />} />
            <Route path="/creative" element={<CreativeGenerator />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 0.5
    }} exit={{
      opacity: 0
    }} transition={{
      type: 'spring',
      stiffness: 300,
      damping: 30
    }} className="fixed inset-0 bg-black z-10" onClick={() => setSidebarOpen(false)} />}
    </div>;
};
export default Dashboard;