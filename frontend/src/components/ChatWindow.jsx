import { useEffect, useRef } from "react";

export default function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    const chatWindow = bottomRef.current?.parentElement;
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message-row ${
            msg.role === "user" ? "user-row" : "ai-row"
          }`}
        >
          <div
            className={
              msg.role === "user"
                ? "user-message"
                : "ai-message"
            }
          >
            <div className="message-content">
              {msg.content === "__LOADING__" ? (
                <div className="typing-loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        </div>
      ))}

      <div ref={bottomRef}></div>
    </div>
  );
}