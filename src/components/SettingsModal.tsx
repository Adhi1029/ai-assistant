import { Settings, X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceURI: string;
  setVoiceURI: (uri: string) => void;
  voices: SpeechSynthesisVoice[];
  clearMemory: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  voiceURI,
  setVoiceURI,
  voices,
  clearMemory,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal glass-panel">
        <div className="settings-header">
          <h2>
            <Settings size={20} /> Settings
          </h2>
          <button onClick={onClose} className="icon-btn">
            <X size={20} />
          </button>
        </div>
        
        <div className="settings-body">
          <div className="setting-item">
            <label>Assistant Voice (Sound Type)</label>
            <select 
              value={voiceURI} 
              onChange={(e) => setVoiceURI(e.target.value)}
              className="glass-select"
            >
              <option value="">Default OS Voice</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
          
          <div className="setting-item">
            <label>Data & Privacy</label>
            <p className="privacy-note">All conversations are stored locally for context memory. You can clear this memory at any time.</p>
            <button className="danger-btn" onClick={clearMemory}>
              Clear Context & Memory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
