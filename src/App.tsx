import { useState } from "react";
import ReactMarkdown from 'react-markdown';

import './App.css'
interface Message {
  text: string;
  sender: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const sendMessage = async () => {
    if (input.trim() === "") return; // Prevent sending empty messages
    
    const userMessage: Message = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch("https://open-ai-api-mauve.vercel.app/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      });
      
      const data = await response.json();
      console.log(data);
      const botMessage: Message = { text: data.reply.content, sender: "assistant" }; 
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling the API:", error);
    }

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="container chatbot-container">
      <div className="row">
      <img src="/images/avatar.png" alt="Avatar" style={{width:"300px"}} className="mx-auto mt-5"/>
      </div>
      <div className="messages-container row" >
        {messages.map((msg, idx) => (
          <div key={idx} className={"row my-1 " + msg.sender + (msg.sender == "user"? " ms-auto w-auto rounded-pill px-3 py-2 me-2" : "")}>
            {msg.sender == "user"? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>}
          </div>
        ))}
      </div>
      <div className="input-container row">
        <div className="col-10">
          <input
            value={input}
            className="mx-2 p-1 form-control"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
          />
        </div>
        <div className="col-2">
          <button className="btn btn-primary" onClick={sendMessage}>Send</button></div>
        </div>
    
    </div>
  );
};

export default Chatbot;
