import { useState } from "react";

interface Message {
  text: string;
  sender: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const sendMessage = async () => {
    
    console.log("got here\n")
    const userMessage: Message = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch("https://open-ai-6zol2w33u-andy-mitchells-projects-c469c246.vercel.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      });
      
      const data = await response.json();
      console.log(data);
      const botMessage: Message = { text: data.reply.content, sender: "bot" }; // Adjust this to match your API response structure
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling the API:", error);
    }

    setInput("");
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <p key={idx} className={msg.sender}>
            {msg.text}
          </p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbot;
