import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState("")
  const [messageList, setMessageList] = useState<string[]>([])

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    setMessageList([...messageList, message]);
    setMessage("");
  }

  return (
    <>
    <ol>
      {messageList?.map((msg, i) => (
        <li key={i}>{msg}</li>
      ))}
    </ol>
    <form onSubmit={sendMessage}>
      <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      <button type="submit">Send</button>
    </form>
    </>
  )
}

export default App
