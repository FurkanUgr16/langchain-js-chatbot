"use client";

import { Bot, User } from 'lucide-react';

export default function Messages({ messages, isLoading, messageContainerRef, formatTime }) {
  return (
    <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.sender === 'bot' && (
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.isError ? "bg-red-500" : "bg-gradient-to-r from-purple-500 to-pink-500"}`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`rounded-2xl px-4 py-3 shadow-md max-w-xs md:max-w-md lg:max-w-lg ${
                message.sender === "user" 
                ? "bg-blue-500 text-white rounded-br-none" 
                : message.isError 
                    ? "bg-red-100 text-red-800 border-red-200 rounded-bl-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.text}
                {/* AI yazarken yanıp sönen imleç */}
                {isLoading && message.sender === 'bot' && message.id === messages[messages.length - 1].id && <span className="animate-pulse">▍</span>}
              </p>
              <p className={`text-xs mt-2 text-right ${
                  message.sender === "user" ? "text-blue-100" : message.isError ? "text-red-600" : "text-gray-400"
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
            {message.sender === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}