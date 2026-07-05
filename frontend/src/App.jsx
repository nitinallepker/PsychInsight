import { useState } from "react";
import axios from "axios";

import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const response = await axios.post(
        "https://psychinsight-backend.onrender.com/chat",
        {
          message,
        }
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.response,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  const displayMessages = loading
    ? [
        ...messages,
        {
          role: "assistant",
          content: "__LOADING__",
        },
      ]
    : messages;

  return (
    <div className="app">
      <h1>PsychInsight</h1>
      <p className="tagline">
        -- Helping you uncover the psychology behind your experiences --
      </p>

      <ChatWindow messages={displayMessages} />

      <ChatInput
        onSend={sendMessage}
        loading={loading}
      />
    </div>
  );
}

export default App;