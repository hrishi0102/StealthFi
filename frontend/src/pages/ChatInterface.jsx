import React, { useState, useRef, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { Send, Loader2 } from "lucide-react";

const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
    <div
      className={`max-w-[80%] rounded-lg p-4 ${
        isUser ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-100"
      }`}
    >
      <p className="text-sm whitespace-pre-wrap">{message}</p>
    </div>
  </div>
);

const ChatInterface = () => {
  const { address } = useAppKitAccount();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/covalent/chat-defi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            walletAddress: address,
          }),
        }
      );

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, there was an error processing your request.",
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-none p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">AI DeFi Advisor</h1>
        <p className="text-sm text-gray-400">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg.text} isUser={msg.isUser} />
        ))}
        {loading && (
          <div className="flex items-center text-gray-400">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-none p-4 border-t border-gray-800"
      >
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about DeFi opportunities..."
            className="flex-grow p-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`p-2 rounded-lg ${
              loading || !input.trim()
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
