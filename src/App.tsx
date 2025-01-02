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
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (message.trim() === "") return;
    
    const userMessage: Message = { text: message, sender: "user" };
    setMessages([...messages, userMessage]);

    setLoading(true);
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
    setLoading(false);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(input);
    }
  };

  return (
    <div className="container chatbot-container">
      <div className="row">
        <img src="/images/avatar.png" alt="Avatar" style={{width:"300px"}} className="mx-auto mt-3"/>
      </div>
      <div className="row">
        <h2 className="text-center">Ask me anything!</h2>
      </div>
      <div className="row">
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-outline-primary mx-2"
            onClick={() => sendMessage("Where did Andy go to school?")}
          >
            Where did Andy go to school?
          </button>
          <button
            className="btn btn-outline-primary mx-2"
            onClick={() => sendMessage("What was Andy's first job?")}
          >
            What was Andy's first job?
          </button>
          <button
            className="btn btn-outline-primary mx-2"
            onClick={() => sendMessage("What code bases is Andy familiar with?")}
          >
            What code bases is Andy familiar with?
          </button>
        </div>
      </div>
      <div className="messages-container row" >
        {messages.map((msg, idx) => (
          <div key={idx} className={"row my-1 " + msg.sender + (msg.sender == "user"? " ms-auto w-auto rounded-pill px-3 py-2 me-2" : "")}>
            {msg.sender == "user"? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>}
          </div>
        ))}
        <div className="row" hidden={!loading}>
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        </div>
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
          <button className="btn btn-primary" onClick={() => sendMessage(input)}>Send</button></div>
        </div>
    
    </div>
  );
};

export default Chatbot;
