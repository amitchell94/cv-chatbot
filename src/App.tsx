import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState("")

  return (
    <>
      <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
    </>
  )
}

export default App
