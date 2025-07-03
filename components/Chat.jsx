"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, RefreshCw, MessageSquare } from 'lucide-react';

export default function Chat(){
     const [messages, setMessages] = useState(() => {
    const initialMessages = [
      {
        id: 1,
        text: "Merhaba! Ben AI asistanınızım. Size nasıl yardımcı olabilirim?",
        sender: 'bot',
        timestamp: new Date()
      }
    ];
    console.log('Initial messages:', initialMessages);
    return initialMessages;
  });
  
  // Debug için messages'i izle
  useEffect(() => {
    console.log('Messages updated:', messages, 'Type:', typeof messages, 'isArray:', Array.isArray(messages));
  }, [messages]);

    const [ inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const messageRef = useRef(null)

    function scrollToBottom(){
        messageRef.current?.scrollIntoWiev({behavior: "smooth"})
    }

    useEffect(() =>{
        scrollToBottom
    }, [messages])

    async function sendMessage() {
        if(!inputMessage.trim() || isLoading) return;

        const userMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: "user",
        timestamp: new Date()
    }

        setMessages(prev => [...prev, userMessage]);
        setInputMessage("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/fetch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({message: inputMessage})
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = response.json()
            
            const botMessage ={
                id: Date.now() + 1,
                text: data.content || data.message || 'Yanıt alınamadı',
                sender: 'bot',
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            console.error("Api error", error)
            const errorMessage = {
                 id: Date.now() + 1,
                text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
                sender: 'bot',
                timestamp: new Date(),
                isError: true
            }
            setMessages(prev => [...prev, errorMessage])
        }finally{
            setIsLoading(false)
        }
    }

    function handleKeyPress(event){
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage()
        }
    }

    function formatTime(timestamp){
        return new Date(timestamp).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    
   

    function clearChat(){
        setMessages({
            id: 1,
            text: "Merhaba! Ben AI asistanınızm. Size nasıl yardımcı olabilirim",
            sender: "bot",
            timestamp: new Date()
        })
    }


    return(
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-4xl mx-auto p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">AI ChatBot</h1>
                                <p className="text-sm text-gray-500">Yapay zeka destekli asistan</p>
                            </div>
                        </div>
                        <button
                            onClick={clearChat}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span className="text-sm font-medium">Temizle</span>
                        </button>
                    </div>
                </div>
            </div>


            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                  {Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((message) =>(
                        <div
                            key={message.id}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${
                                message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                            }`}>

                            </div>

                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                message.sender === "user" ? "bg-blue-500": message.isError ? "bg-red-500" : "bg-gradient-to-r from-purple-500 to bg-pink-500"
                            }`}>
                                {message.sender === "user" ? 
                                (
                                    <User className="w-4 h-4 text-white" />
                                ):
            
                                (
                                    <Bot className="w-4 h-4 text-white" />
                                )
                                }
                                    
                            </div>

                            {/* Avatar Bubble*/}
                            <div className={`rounded-2xl px-4 py-3 shadow-md ${
                                message.sender === "user" ? "bg-blue-500 text-white" : message.isError ? "bg-red-100 text-red-800 border-red-200": "bg-white text-gray-800 border border-gray-200"
                            }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {message.text}
                                </p>
                                <p className={`text-xs mt-2 ${
                                    message.sender === "user" ? "text-blue-100" : message.isError ? "text-red-600": "text-gray-500"
                                }`}>
                                    {formatTime(message.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))
                  ): ( 
                    <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500">Henüz mesaj yok</p>
                    </div>)}
                </div>
            </div>
        </div>
    )
}