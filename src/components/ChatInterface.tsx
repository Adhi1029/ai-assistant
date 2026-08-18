import { useEffect, useRef } from "react";
import { motion } from "motion/react";

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
    // We scroll the document body or main content, but the chatRef itself doesn't scroll anymore
    // Let's scroll the window or closest scrollable parent
    const scrollContainer = chatRef.current?.parentElement;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="chat-interface" ref={chatRef}>
      {messages.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          className="empty-state"
        >
          <h2>How can I help you today?</h2>
          <p>I can search the web, analyze images, and remember our context.</p>
        </motion.div>
      ) : (
        messages.map((msg, i) => (
          <motion.div 
            key={i} 
            className={`message-row ${msg.role}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          >
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
          </motion.div>
        ))
      )}
    </div>
  );
}
