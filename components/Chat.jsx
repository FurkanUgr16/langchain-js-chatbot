"use client"

import { useState, useRef, useEffect } from "react";
import Header from "./Header";
import Messages from "./Messages";
import Input from "./Input";

export default function Chat() {
    // 1. STATE VE REFLER
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Merhaba! Ben Gem. Size nasıl yardımcı olabilirim?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messageContainerRef = useRef(null);

    // 2. OTOMATİK KAYDIRMA
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // 3. ANA MANTIK FONKSİYONLARI
    async function sendMessage() {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: "user",
            timestamp: new Date()
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputMessage("");
        setIsLoading(true);

        try {
            // İSTEK DEĞİŞİKLİĞİ: API rotası /api/agents olarak güncellendi.
            const response = await fetch('/api/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok || !response.body) {
                throw new Error(`HTTP hatası! Durum: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botResponseText = "";
            const botMessageId = Date.now() + 1;
            
            setMessages(prev => [
                ...prev,
                { id: botMessageId, text: "", sender: 'bot', timestamp: new Date() }
            ]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                botResponseText += chunk;
                
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === botMessageId
                            ? { ...msg, text: botResponseText }
                            : msg
                    )
                );
            }
        } catch (error) {
            console.error("API hatası:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
                sender: 'bot',
                timestamp: new Date(),
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    }

    function formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function clearChat() {
        setMessages([
            {
                id: 1,
                text: "Merhaba! Ben Gem. Size nasıl yardımcı olabilirim?",
                sender: "bot",
                timestamp: new Date()
            }
        ]);
    }

    // 4. COMPONENT'LERİ BİRLEŞTİRME
    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header onClearChat={clearChat} />
            <Messages 
                messages={messages}
                isLoading={isLoading}
                messageContainerRef={messageContainerRef}
                formatTime={formatTime}
            />
            <Input 
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                sendMessage={sendMessage}
                isLoading={isLoading}
            />
        </div>
    );
}