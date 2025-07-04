"use client";

import { RefreshCw, Bot } from 'lucide-react';

// `onClearChat` fonksiyonunu prop olarak alıyoruz.
export default function Header({ onClearChat }) {
  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AI ChatBot</h1>
              <p className="text-sm text-gray-500">Gemini Destekli Asistan</p>
            </div>
          </div>
          <button
            onClick={onClearChat} // Prop olarak gelen fonksiyonu burada çağırıyoruz.
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Temizle</span>
          </button>
        </div>
      </div>
    </div>
  );
}