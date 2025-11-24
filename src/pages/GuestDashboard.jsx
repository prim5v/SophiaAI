
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createApiClient } from "../utils/ApiSocket";
import ChatWindow from "../components/chat/ChatWindow";
import {
  BrainIcon,
  MicIcon,
  MicOffIcon,
} from "lucide-react";

const rotatingMessages = [
  "What do you want to do today?",
  "Ask anything… I’ll figure it out.",
  "Summarize complex research instantly.",
  "Get creative — code, music, scripts, anything.",
  "Your AI assistant. Ready when you are.",
];

const GUEST_IDLE_TIMEOUT = 5 * 60 * 60 * 1000;

const stripHtml = (s) => {
  if (!s || typeof s !== "string") return "";
  return s.replace(/<[^>]*>?/gm, "");
};

const GuestDashboard = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeMessage, setActiveMessage] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [typingContent, setTypingContent] = useState("");
  const [listening, setListening] = useState(false); // voice input

  const messagesEndRef = useRef(null);
  const lastInteractionRef = useRef(Date.now());
  const timerRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const api = createApiClient();

  // ROTATING MESSAGES
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessage((prev) => (prev + 1) % rotatingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // IDLE TIME CHECK
  useEffect(() => {
    const interval = setInterval(() => {
      const idleTime = Date.now() - lastInteractionRef.current;
      setShowWelcome(idleTime > GUEST_IDLE_TIMEOUT && messages.length === 0);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [messages]);

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingContent]);

  // AUTO-RESIZE TEXTAREA
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleFileSelect = (f) => {
    setFile(f);
    if (f && f.type && f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // SIMULATED AI TYPING
  const simulateTyping = (fullText) => {
    setTypingContent("");
    let i = 0;
    const interval = setInterval(() => {
      setTypingContent((prev) => prev + fullText[i]);
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 30);
  };

  // SEND MESSAGE
  const handleSend = async () => {
    if (!input.trim() && !file) return;

    const userMessage = {
      id: uuidv4(),
      role: "user",
      content: input || (file ? file.name : ""),
    };

    lastInteractionRef.current = Date.now();
    setShowWelcome(false);
    setMessages((prev) => [...prev, userMessage]);
    setShowAttachOptions(false);
    setLoadingAI(true);

    const promptText = input;
    setInput("");

    try {
      const historyArray = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: stripHtml(m.content),
      }));

      let res;
      if (file) {
        const formData = new FormData();
        formData.append("prompt", promptText || "");
        formData.append("history", JSON.stringify(historyArray));
        formData.append("file", file);
        res = await api.post("/guest/ai", formData);
      } else {
        res = await api.post("/guest/ai", {
          prompt: promptText || "",
          history: historyArray,
        });
      }

      const aiText = String(res.data?.response || "🤖 AI returned no content");
      simulateTyping(aiText);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: "assistant",
            content: aiText,
            isHTML: true,
          },
        ]);
        setTypingContent("");
      }, aiText.length * 30 + 200);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content: "⚠️ Failed to get response from AI.",
          isHTML: false,
        },
      ]);
    } finally {
      setLoadingAI(false);
      setFile(null);
      setPreviewUrl(null);
    }
  };

  // VOICE INPUT (Web Speech API)
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice input not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const stopListening = () => {
    setListening(false);
    recognitionRef.current?.stop();
  };

  const toggleListening = () => {
    listening ? stopListening() : startListening();
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest("#attach-options") && !e.target.closest("#attach-button")) {
      setShowAttachOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-950 text-white relative">
      {/* TOP BAR */}
      <div className="absolute top-6 left-0 right-0 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BrainIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            SophiaAI
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-col flex-1 max-w-3xl w-full mx-auto px-4 relative">
        {showWelcome && (
          <motion.div
            key={activeMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 pt-40"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-teal-300 bg-clip-text text-transparent">
              {rotatingMessages[activeMessage]}
            </h1>
            <p className="text-gray-400 mt-2">
              Experience intelligent conversations, summaries, and creative AI generation — all in one place.
            </p>
          </motion.div>
        )}

        {/* CHAT WINDOW */}
        <ChatWindow
          messages={[
            ...messages,
            ...(typingContent ? [{ id: "typing", role: "assistant", content: typingContent }] : []),
          ]}
          messagesEndRef={messagesEndRef}
        />

        {/* INPUT BOX */}
        <motion.div
          className={`w-full max-w-2xl mx-auto bg-gray-900 rounded-3xl p-4 shadow-lg flex flex-col gap-2 z-10 transition-all duration-300`}
        >
          {/* FILE PREVIEW */}
          {file && (
            <div className="mb-2">
              <div className="text-gray-300 text-sm flex items-center justify-between bg-gray-800 px-3 py-1 rounded-xl mb-1">
                {file.name}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  ×
                </button>
              </div>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-32 w-auto rounded-lg object-cover border border-gray-700"
                />
              )}
            </div>
          )}

          {/* AUTO-RESIZING TEXTAREA */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-3xl bg-gray-800 text-white outline-none w-full resize-none overflow-hidden"
            rows={1}
          />

          {/* CONTROLS */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2 items-center">
              <button
                id="attach-button"
                onClick={() => setShowAttachOptions(!showAttachOptions)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl text-sm font-semibold"
              >
                Attach
              </button>

              {/* VOICE INPUT BUTTON */}
              <button
                onClick={toggleListening}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
              >
                {listening ? (
                  <MicOffIcon className="text-red-500" />
                ) : (
                  <MicIcon className="text-gray-300" />
                )}
              </button>
            </div>

            <button
              onClick={handleSend}
              className="px-6 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 font-semibold"
            >
              Send
            </button>
          </div>

          {/* ATTACH MENU */}
          {showAttachOptions && (
            <div
              id="attach-options"
              className="flex gap-2 mt-2 justify-start flex-wrap"
            >
              <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl cursor-pointer">
                Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </label>

              <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl cursor-pointer">
                Document
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </motion.div>
      </div>

      {/* BACKGROUND BLUR */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 w-[600px] h-[600px] -translate-x-1/2 bg-blue-500 opacity-10 rounded-full blur-[180px]"></div>
      </div>
    </div>
  );
};

export default GuestDashboard;
