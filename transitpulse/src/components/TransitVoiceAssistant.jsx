import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Radio,
  AlertCircle,
  Navigation,
  Compass,
  CheckCircle,
  Clock,
  Users,
  ChevronDown,
  X,
  Bot,
  User,
  RefreshCw,
  Search
} from 'lucide-react';
import { useTransit } from '../context/TransitContext.jsx';

export default function TransitVoiceAssistant({
  isOpen,
  onClose,
  activeVehicleId,
  onActionTrigger,
  isDocked = false,
}) {
  const navigate = useNavigate();
  const { buses, setSearchParams } = useTransit();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [liveMode, setLiveMode] = useState(false); // Live WebSockets vs Grounded REST

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello! I'm your **TransitPulse AI Assistant**. Ask me anything about bus schedules, live GPS telemetry, route options (like **Thoothukudi to Tirunelveli**), or real-time crowd indexes.",
      spokenText: "Hello! I am your TransitPulse assistant. How can I help with your commute today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const recognitionRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initialize Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicPermissionDenied(true);
          setErrorMsg('Microphone access denied. Please allow microphone permissions in your browser.');
        } else if (event.error !== 'no-speech') {
          setErrorMsg(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // If text was collected, automatically submit
        if (inputText.trim().length > 2) {
          handleSendQuery(inputText.trim());
          setInputText('');
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('SpeechRecognition API not available in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [inputText]);

  // Play audio response using either Gemini TTS or browser synthesis
  const speakResponse = useCallback(
    async (spokenText) => {
      if (!soundEnabled || !spokenText) return;

      // Stop any existing speech
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      setIsSpeaking(true);

      try {
        const res = await fetch('/api/ai/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: spokenText }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.audioBase64) {
            const audioSrc = `data:${data.mimeType || 'audio/mp3'};base64,${data.audioBase64}`;
            const audio = new Audio(audioSrc);
            audioPlayerRef.current = audio;
            audio.onended = () => setIsSpeaking(false);
            audio.onerror = () => fallbackBrowserSpeech(spokenText);
            await audio.play();
            return;
          }
        }
      } catch (err) {
        console.warn('Backend TTS failed, using browser speech synthesis:', err);
      }

      fallbackBrowserSpeech(spokenText);
    },
    [soundEnabled]
  );

  const fallbackBrowserSpeech = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleListening = async () => {
    if (isSpeaking) {
      stopSpeaking();
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // Request microphone access
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermissionDenied(false);
      setErrorMsg(null);

      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        setErrorMsg("Voice recognition is not supported in this browser. Please type your message below.");
      }
    } catch (err) {
      console.warn("Microphone permission denied:", err);
      setMicPermissionDenied(true);
      setErrorMsg("Microphone permission is blocked. Please grant microphone access or use text input.");
    }
  };

  // Submit query to backend
  const handleSendQuery = async (queryText) => {
    const textToSend = queryText || inputText.trim();
    if (!textToSend || isLoading) return;

    setInputText('');
    setErrorMsg(null);

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Package current buses data for grounding
      const busesSummary = Object.values(buses).map((b) => ({
        id: b.vehicleId,
        name: b.name,
        corridor: b.corridorName,
        liveGps: b.isLiveConfirmed !== false,
        speed: `${b.speed} km/h`,
        crowd: b.crowdLevel,
        currentLocation: b.currentLocation,
        nextEta: b.etaCountdown,
        destination: b.destination,
      }));

      const response = await fetch('/api/ai/transit-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.text })),
          transitContext: {
            activeVehicleId,
            busesSummary,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        text: data.text || data.spokenText || "I've processed your transit query.",
        spokenText: data.spokenText,
        action: data.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Trigger automatic UI and Map actions
      if (data.action) {
        handleAction(data.action);
      }

      // Speak answer
      if (data.spokenText) {
        speakResponse(data.spokenText);
      }
    } catch (err) {
      console.error('Error submitting query:', err);
      setErrorMsg('Could not contact the transit AI service. Please try again.');
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: "I experienced a temporary communication hiccup. Please check your network or try again in a moment.",
          spokenText: "I had a temporary connection issue. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action) => {
    if (!action) return;

    if (action.type === 'TRACK_BUS' && action.vehicleId) {
      if (onActionTrigger) {
        onActionTrigger('TRACK_BUS', action.vehicleId);
      }
      navigate(`/track/${action.vehicleId}`);
    } else if (action.type === 'SEARCH_ROUTE') {
      setSearchParams((prev) => ({
        ...prev,
        origin: action.origin || "Thoothukudi Old Bus Stand",
        destination: action.destination || "Tirunelveli New Bus Stand",
      }));
      navigate('/search/results');
    }
  };

  const quickPrompts = [
    "Thoothukudi to Tirunelveli bus?",
    "Where is Bus 101 now?",
    "Is the next bus crowded?",
    "Track Bus 42A",
    "Status of Bus 77?",
    "Show nearest bus stop",
  ];

  if (!isOpen && !isDocked) return null;

  const content = (
    <div className={`flex flex-col bg-[#0e131d] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden ${isDocked ? 'h-full' : 'w-full max-w-lg h-[620px]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#121824] border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F5B700] to-amber-500 flex items-center justify-center text-black shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">TransitPulse AI</h3>
              <span className="text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.5 rounded">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Grounded Voice & Transit Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mute/Unmute */}
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setSoundEnabled(!soundEnabled);
            }}
            className={`p-1.5 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-gray-800/80 text-emerald-400 border-gray-700 hover:bg-gray-700'
                : 'bg-gray-800/80 text-gray-400 border-gray-700 hover:text-white'
            }`}
            title={soundEnabled ? 'Mute Speech Output' : 'Unmute Speech Output'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {!isDocked && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Voice Activity Banner / Visualizer */}
      <div className="px-4 py-2.5 bg-[#0a0d14] border-b border-gray-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isListening ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F5B700]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F5B700] animate-ping" />
              <span>Listening to your voice...</span>
            </div>
          ) : isSpeaking ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Speaking response...</span>
            </div>
          ) : isLoading ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Consulting real-time satellite data...</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-400" />
              Tap the microphone to speak or type below
            </span>
          )}
        </div>

        {/* Dynamic Waveform Bars */}
        {(isListening || isSpeaking) && (
          <div className="flex items-center gap-0.5 h-4">
            <span className="w-1 bg-[#F5B700] rounded-full animate-[bounce_0.6s_infinite_100ms] h-3" />
            <span className="w-1 bg-[#F5B700] rounded-full animate-[bounce_0.6s_infinite_200ms] h-4" />
            <span className="w-1 bg-[#F5B700] rounded-full animate-[bounce_0.6s_infinite_300ms] h-2" />
            <span className="w-1 bg-[#F5B700] rounded-full animate-[bounce_0.6s_infinite_150ms] h-4" />
            <span className="w-1 bg-[#F5B700] rounded-full animate-[bounce_0.6s_infinite_250ms] h-3" />
          </div>
        )}
      </div>

      {/* Mic Permission Warning */}
      {micPermissionDenied && (
        <div className="p-3 bg-amber-950/40 border-b border-amber-800/60 text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Microphone access blocked. Click your browser lock icon to enable voice input, or type below.</span>
        </div>
      )}

      {/* Messages Transcript */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-gray-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-[#121824] border border-gray-700 flex items-center justify-center shrink-0 mt-0.5 text-[#F5B700]">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#F5B700] text-black font-medium shadow-md'
                  : 'bg-[#121824] text-gray-100 border border-gray-800 shadow-md'
              }`}
            >
              <div className="whitespace-pre-line prose-invert">
                {msg.text}
              </div>

              {/* Action Button inside message if returned */}
              {msg.action && (
                <div className="mt-2.5 pt-2 border-t border-gray-800/80">
                  {msg.action.type === 'TRACK_BUS' && msg.action.vehicleId && (
                    <button
                      type="button"
                      onClick={() => handleAction(msg.action)}
                      className="w-full bg-[#F5B700] text-black font-bold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 hover:bg-amber-400 transition-colors shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Track Bus {msg.action.vehicleId} on Google Map
                    </button>
                  )}
                  {msg.action.type === 'SEARCH_ROUTE' && (
                    <button
                      type="button"
                      onClick={() => handleAction(msg.action)}
                      className="w-full bg-[#F5B700] text-black font-bold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 hover:bg-amber-400 transition-colors shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5" />
                      View Route {msg.action.origin} → {msg.action.destination}
                    </button>
                  )}
                </div>
              )}

              <span
                className={`block text-[10px] mt-1 ${
                  msg.role === 'user' ? 'text-black/60 text-right' : 'text-gray-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-[#F5B700]/20 border border-[#F5B700]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#F5B700]">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-xs text-gray-400 pl-8">
            <span className="w-2 h-2 rounded-full bg-[#F5B700] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#F5B700] animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-[#F5B700] animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-mono text-gray-400">Verifying live telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-[#0a0d14]/70 border-t border-gray-800/80 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSendQuery(prompt)}
            className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-[#121824] hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700/80 transition-colors whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form & Microphone Controls */}
      <div className="p-3 bg-[#121824] border-t border-gray-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          {/* Big Microphone Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                : 'bg-[#0a0d14] text-[#F5B700] border border-gray-700 hover:border-[#F5B700]'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice speaking'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? 'Listening to voice...' : 'Ask about buses, routes, stops...'}
            disabled={isLoading}
            className="flex-1 bg-[#0a0d14] border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F5B700] transition-colors"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-[#F5B700] text-black disabled:opacity-40 disabled:hover:bg-[#F5B700] hover:bg-amber-400 flex items-center justify-center transition-colors shrink-0 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );

  if (isDocked) {
    return content;
  }

  // Floating modal / drawer style
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {content}
    </div>
  );
}
