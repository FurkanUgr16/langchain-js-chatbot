"use client";

import { Send, Loader2 } from 'lucide-react';

export default function Input({ inputMessage, setInputMessage, sendMessage, isLoading }) {
  
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              rows="1"
              style={{ minHeight: "52px", maxHeight: "120px" }}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className={`p-3 rounded-full transition-all duration-200 flex-shrink-0 ${
                !inputMessage.trim() || isLoading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}