import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

interface Message {
  role: "user" | "bot";
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  const [bgStyle, setBgStyle] = useState({});
  const chatRef = useRef<HTMLDivElement>(null);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    generateRandomBackground();
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const generateRandomBackground = () => {
    const colors = [
      "#6a11cb",
      "#2575fc",
      "#ff00cc",
      "#333399",
      "#00c6ff",
      "#f7971e",
      "#43cea2",
      "#185a9d",
    ];

    const c1 = colors[Math.floor(Math.random() * colors.length)];
    const c2 = colors[Math.floor(Math.random() * colors.length)];
    const c3 = colors[Math.floor(Math.random() * colors.length)];

    setBgStyle({
      background: `linear-gradient(-45deg, ${c1}, ${c2}, ${c3})`,
      backgroundSize: "400% 400%",
      animation: "gradientMove 12s ease infinite",
    });
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      setListening(false);
      handleUserMessage(speechText);
    };

    recognition.onerror = () => setListening(false);
  };

  const handleUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
    sendToGemini(text);
  };

  const sendToGemini = async (inputText: string) => {
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: inputText }] }],
        }
      );

      const botReply =
        res.data.candidates[0].content.parts[0].text;

      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
      speak(botReply);
    } catch (error) {
      console.error(error);
    }
  };

  const speak = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="background" style={bgStyle}>
      <div className="chat-container">
        <div className="chat-box" ref={chatRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {listening && (
          <div className="siri-wave">
            <svg viewBox="0 0 1200 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f5ff" />
                  <stop offset="50%" stopColor="#ff00ff" />
                  <stop offset="100%" stopColor="#7b00ff" />
                </linearGradient>
              </defs>

              <path className="wave layer1" />
              <path className="wave layer2" />
              <path className="wave layer3" />
            </svg>
          </div>
        )}

        <button
          className={`mic-button ${listening ? "active" : ""}`}
          onClick={startListening}
        >
          {listening ? "Listening..." : "🎤 Speak"}
        </button>
      </div>
    </div>
  );
}

export default App;