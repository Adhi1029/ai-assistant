import { useEffect, useRef } from "react";

export interface Message {
  role: "user" | "bot";
  text: string;
  image?: string;
  citations?: string[];
}

interface ChatInterfaceProps {
  messages: Message[];
}

export default function ChatInterface({ messages }: ChatInterfaceProps) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="chat-interface glass-panel" ref={chatRef}>
      {messages.length === 0 ? (
        <div className="empty-state">
          <h2>How can I help you today?</h2>
          <p>I can search the web, analyze images, and remember our context.</p>
        </div>
      ) : (
        messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.role}`}>
            <div className={`message-bubble ${msg.role}`}>
              {msg.image && (
                <img src={msg.image} alt="User attachment" className="msg-img" />
              )}
              {msg.text && (
                <div className="msg-text" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
              )}
              {msg.citations && msg.citations.length > 0 && (
                <div className="citations">
                  <strong>Sources:</strong>
                  <ul>
                    {msg.citations.map((c, idx) => (
                      <li key={idx}><a href={c} target="_blank" rel="noreferrer">{c}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
