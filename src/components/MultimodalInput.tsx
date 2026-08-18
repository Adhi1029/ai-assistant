import { Mic, Paperclip, MonitorUp, Send, Loader, PauseCircle } from "lucide-react";
import { useState, useRef } from "react";

interface MultimodalInputProps {
  onSendMessage: (text: string, imageStr?: string) => void;
  isListening: boolean;
  toggleListen: () => void;
  isLoading: boolean;
}

export default function MultimodalInput({
  onSendMessage,
  isListening,
  toggleListen,
  isLoading,
}: MultimodalInputProps) {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<{ url: string; base64: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!text.trim() && !attachment) return;
    onSendMessage(text, attachment?.base64);
    setText("");
    setAttachment(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAttachment({ url: URL.createObjectURL(file), base64: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const frameBase64 = canvas.toDataURL('image/jpeg');
      setAttachment({ url: frameBase64, base64: frameBase64 });
      
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("Screen sharing failed", err);
    }
  };

  return (
    <div className="input-area glass-panel">
      {attachment && (
        <div className="attachment-preview">
          <img src={attachment.url} alt="attachment" />
          <button className="remove-attach" onClick={() => setAttachment(null)}>✕</button>
        </div>
      )}
      <div className="input-controls">
        <button className="icon-btn" onClick={() => fileInputRef.current?.click()} title="Attach File">
          <Paperclip size={20} />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={handleFileChange}
        />
        
        <button className="icon-btn" onClick={startScreenShare} title="Share Screen Snapshot">
          <MonitorUp size={20} />
        </button>

        <input
          type="text"
          className="text-input"
          placeholder="Ask me anything..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={isLoading}
        />

        <button 
          className={`icon-btn mic-btn ${isListening ? "active pulse" : ""}`} 
          onClick={toggleListen}
          title="Voice Command"
        >
          {isListening ? <PauseCircle size={20} /> : <Mic size={20} />}
        </button>

        <button 
          className="send-btn" 
          onClick={handleSubmit} 
          disabled={isLoading || (!text.trim() && !attachment)}
        >
          {isLoading ? <Loader className="spin" size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
}
