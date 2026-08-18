import { useState, useEffect } from "react";
import axios from "axios";
import Groq from "groq-sdk";
import "./App.css";

import Strands from "./components/Strands";
import FloatingLines from "./components/FloatingLines";
import ElasticSlider from "./components/ElasticSlider";
import ChatInterface, { Message } from "./components/ChatInterface";
import MultimodalInput from "./components/MultimodalInput";
import SettingsModal from "./components/SettingsModal";
import { Settings as SettingsIcon } from "lucide-react";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Use dangerouslyAllowBrowser for frontend Groq usage (not recommended for prod, but needed here)
const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    // Load voices
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const clearMemory = () => {
    setMessages([]);
    setSettingsOpen(false);
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    
    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }

    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      setListening(false);
      handleSendMessage(speechText);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  const handleSendMessage = async (text: string, imageBase64?: string) => {
    if (!text && !imageBase64) return;

    const newMsg: Message = { role: "user", text, image: imageBase64 };
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    try {
      let botReply = "";
      
      // If there is an image, we MUST use Gemini because Groq's default models don't support vision directly yet
      if (imageBase64) {
        try {
          botReply = await sendToGeminiVision(text, imageBase64);
        } catch (geminiError) {
          console.warn("Gemini API failed. Falling back to Groq.", geminiError);
          const fallbackText = text ? text : "The user tried to upload an image, but my image processing failed. Apologize and ask them to describe the image instead.";
          botReply = await sendToGroq(fallbackText);
          botReply = "*(Note: My image sensors are currently down due to an API issue, so I could only read your text!)*\n\n" + botReply;
        }
      } else {
        // Use Groq for text
        botReply = await sendToGroq(text);
      }

      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
      speak(botReply);
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.message || error?.response?.data?.error?.message || "Sorry, I encountered an unknown error.";
      setMessages((prev) => [...prev, { role: "bot", text: `Error: ${errMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const sendToGroq = async (inputText: string) => {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a highly capable AI assistant. Answer intelligently, concisely, and with accurate information. Format output in Markdown."
        },
        ...messages.map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user' as const, content: m.text })),
        { role: "user", content: inputText }
      ],
      model: "openai/gpt-oss-20b",
    });
    return chatCompletion.choices[0]?.message?.content || "";
  };

  const sendToGeminiVision = async (text: string, imageBase64: string) => {
    // Strip the data:image/...;base64, part
    const base64Data = imageBase64.split(",")[1];
    const mimeType = imageBase64.substring(5, imageBase64.indexOf(";"));

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: text || "Describe this image." },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
      }
    );

    return res.data.candidates[0].content.parts[0].text;
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    // Remove markdown for speech
    const cleanText = text.replace(/[*_#\[\]]/g, '');
    const speech = new SpeechSynthesisUtterance(cleanText);
    speech.volume = volume / 100;
    
    if (voiceURI) {
      const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
      if (selectedVoice) speech.voice = selectedVoice;
    }

    speech.onstart = () => setIsBotSpeaking(true);
    speech.onend = () => setIsBotSpeaking(false);
    speech.onerror = () => setIsBotSpeaking(false);

    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="app-layout">
      {/* Dynamic Background via Strands when bot is speaking */}
      <div className={`strands-bg ${isBotSpeaking ? "visible" : "hidden"}`}>
        <Strands
          colors={["#00ffcc", "#7C3AED", "#0088ff"]}
          count={5}
          speed={0.8}
          amplitude={1.5}
          waviness={1.2}
          thickness={0.8}
          glow={3.0}
          intensity={0.8}
          opacity={isBotSpeaking ? 1 : 0}
        />
      </div>

      {/* Floating Lines permanently in the background */}
      <div className="strands-bg visible">
        <FloatingLines 
          enabledWaves={["top","middle","bottom"]}
          lineCount={8}
          lineDistance={8}
          bendRadius={8}
          bendStrength={-2}
          interactive
          parallax={true}
          animationSpeed={1}
        />
      </div>

      <header className="app-header glass-panel">
        <h1>Nexus AI</h1>
        <div className="header-controls">
          <div className="header-volume">
            <ElasticSlider
              defaultValue={50}
              maxValue={100}
              isStepped={false}
              onChange={(val: number) => setVolume(val)}
            />
          </div>
          <button className="icon-btn settings-btn" onClick={() => setSettingsOpen(true)}>
            <SettingsIcon size={24} />
          </button>
        </div>
      </header>

      <main className="main-content">
        <ChatInterface messages={messages} />
      </main>

      <div className="dock-container">
        <MultimodalInput
          onSendMessage={handleSendMessage}
          isListening={listening}
          toggleListen={startListening}
          isLoading={loading}
        />
      </div>

      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        voiceURI={voiceURI}
        setVoiceURI={setVoiceURI}
        voices={voices}
        clearMemory={clearMemory}
      />
    </div>
  );
}

export default App;