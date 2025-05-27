import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

import './App.css'
interface Message {
  text: string;
  sender: string;
}
const ALL_PRESET_QUESTIONS = [
  "Where did Andy go to school?",
  "What was Andy's first job?",
  "What code bases is Andy familiar with?",
  "What are Andy's key technical skills?",
  "Tell me about a challenging project Andy worked on.",
  "WHat subjects did Andy study at grad school?",
  "What are Andy's hobbies outside of work?",
  "What was Anfy's Master's thesis?",
  "Where did Andy grow up?",
  "Describe Andy's experience with programming",
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const N8N_WEBHOOK_URL = import.meta.env.VITE_REACT_APP_N8N_WEBHOOK_URL;
  const [displayedPresetQuestions, setDisplayedPresetQuestions] = useState<string[]>(
    ALL_PRESET_QUESTIONS.slice(0, 3)
  );
  const [nextPresetQuestionIndex, setNextPresetQuestionIndex] = useState(3);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (message.trim() === "") return;
    
    const userMessage: Message = { text: message, sender: "user" };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");

    setLoading(true);
    try {
      const payload = {
        messages: [...messages, userMessage].map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
      };
      
      const response = await fetch(N8N_WEBHOOK_URL, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from n8n API:", response.status, errorData);
        const botMessage: Message = { text: `Error: ${errorData.message || 'Failed to get response from agent.'}`, sender: "assistant" };
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Data from n8n:", data);
      if (data.output) {
        const botMessage: Message = { text: data.output, sender: "assistant" }; 
        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error("Unexpected response structure from n8n:", data);
        const botMessage: Message = { text: "Sorry, I received an unexpected response.", sender: "assistant" };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error calling the n8n API:", error);
      const botMessage: Message = { text: "Sorry, something went wrong while connecting to the agent.", sender: "assistant" };
      setMessages((prev) => [...prev, botMessage]);
    }
    setLoading(false);
  };

  const handlePresetQuestionClick = (question: string, buttonIndex: number) => {
    sendMessage(question); 

    // Update the clicked button with the next question from the list
    setDisplayedPresetQuestions(prevDisplayedQuestions => {
      const newDisplayedQuestions = [...prevDisplayedQuestions];
      // Get the next question, cycling through ALL_PRESET_QUESTIONS
      const nextQuestion = ALL_PRESET_QUESTIONS[nextPresetQuestionIndex % ALL_PRESET_QUESTIONS.length];
      newDisplayedQuestions[buttonIndex] = nextQuestion;
      return newDisplayedQuestions;
    });
    setNextPresetQuestionIndex(prevIndex => prevIndex + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(input);
    }
  };

  return (
    <div className="container chatbot-container">
      <div className="row">
        <img src="/images/avatar.png" alt="Avatar" style={{width:"150px"}} className="mx-auto mt-3"/>
      </div>
      <div className="row">
        <h2 className="text-center">Ask me anything!</h2>
      </div>
      <div className="row mb-3"> 
        <div className="d-flex justify-content-center flex-wrap">
          {displayedPresetQuestions.map((question, index) => (
            question && ( 
              <button
                key={`${question}-${index}`}
                className="btn btn-outline-primary mx-1 my-1"
                onClick={() => handlePresetQuestionClick(question, index)}
                style={{minWidth: '180px'}}
              >
                {question}
              </button>
            )
          ))}
        </div>
      </div>
      <div className="messages-container" >
        {messages.map((msg, idx) => (
          <div key={idx} className={"row my-1 " + msg.sender + (msg.sender === "user"? " ms-auto w-auto rounded-pill px-3 py-2 me-2" : " w-auto rounded-pill bg-light px-3 py-2 ms-2")}>
            {msg.sender === "user"? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>}
          </div>
        ))}
        <div className="row" hidden={!loading}>
          <div className="spinner-border text-secondary ms-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container row">
        <div className="col-10">
          <input
            value={input}
            className="mx-2 p-1 form-control"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            disabled={loading}
          />
        </div>
        <div className="col-2">
          <button 
            className="btn btn-primary" 
            onClick={() => sendMessage(input)}
            disabled={loading || input.trim() === ""}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;