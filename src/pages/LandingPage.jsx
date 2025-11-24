import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, BrainIcon, FileTextIcon, SparklesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
const LandingPage = ({
  onEnter
}) => {
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="min-h-screen bg-gray-950 text-white">
      <header className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <motion.div initial={{
          x: -20,
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} transition={{
          delay: 0.2
        }} className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BrainIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              SophiaAI
            </span>
          </motion.div>
        </div>
      </header>
      <main className="container mx-auto px-4 pt-12 pb-24">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 0.3
        }} className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              The AI Assistant You've Been Waiting For
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of AI assistance with powerful natural language understanding, 
              document analysis, and creative content generation.
            </p>
          </motion.div>
          <motion.div initial={{
          y: 30,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 0.5
        }} className="grid md:grid-cols-3 gap-8 mb-16">
            <FeatureCard icon={<BrainIcon className="h-8 w-8" />} title="Natural Conversations" description="Engage in human-like conversations with context awareness and natural language understanding." delay={0.6} />
            <FeatureCard icon={<FileTextIcon className="h-8 w-8" />} title="Document Analysis" description="Upload and analyze complex documents, research papers, and get comprehensive summaries." delay={0.8} />
            <FeatureCard icon={<SparklesIcon className="h-8 w-8" />} title="Creative Generation" description="Generate creative content like code, stories, poetry, and more with a simple prompt." delay={1.0} />
          </motion.div>
          <motion.div initial={{
          y: 30,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 1.2
        }} className="text-center">
            <Link to="/dashboard" onClick={onEnter} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
              Start Exploring
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </main>
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 text-sm">
  © {new Date().getFullYear()} SophiaAI. All rights reserved.
</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </motion.div>;
};
const FeatureCard = ({
  icon,
  title,
  description,
  delay
}) => <motion.div initial={{
  y: 20,
  opacity: 0
}} animate={{
  y: 0,
  opacity: 1
}} transition={{
  delay
}} className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300">
    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>;
export default LandingPage;