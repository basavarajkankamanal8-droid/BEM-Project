import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  processQuery, 
  getQuickQuestions, 
  getWelcomeMessage, 
  getPageContext 
} from "../../services/bemAI";
import { 
  MessageSquare, 
  X, 
  Minus, 
  Send, 
  Sparkles, 
  ExternalLink, 
  Bot, 
  User, 
  Compass, 
  Maximize2,
  Trash2
} from "lucide-react";

export const ChatAssistant = () => {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem("bem_ai_messages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [getWelcomeMessage()];
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickQuestions = getQuickQuestions();
  const pageContext = getPageContext(location.pathname);

  // Persist conversation per session
  useEffect(() => {
    try {
      sessionStorage.setItem("bem_ai_messages", JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom whenever messages change or window opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSend = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg = {
      text: query,
      isBot: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate intelligent processing delay
    setTimeout(() => {
      try {
        const response = processQuery(query, {
          isAdmin: !!isAdmin,
          currentPath: location.pathname
        });

        const botMsg = {
          text: response.text,
          followUp: response.followUp,
          navSuggestion: response.navSuggestion,
          isBot: true,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, botMsg]);
      } catch (err) {
        setMessages(prev => [...prev, {
          text: "The BEM Assistant is temporarily unavailable. Please try again later.",
          isBot: true,
          timestamp: new Date().toISOString()
        }]);
      } finally {
        setIsTyping(false);
      }
    }, 450);
  };

  const handleClearChat = () => {
    const welcome = getWelcomeMessage();
    setMessages([welcome]);
    sessionStorage.removeItem("bem_ai_messages");
  };

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <>
      {/* ══ FLOATING LAUNCHER BUTTON (Bottom Right) ══ */}
      {!isOpen && (
        <button
          id="bem-ai-floating-btn"
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="group"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9990,
            background: "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)",
            color: "#0f0f0f",
            borderRadius: 50,
            padding: "12px 20px",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 8px 32px rgba(255,107,53,0.45), 0 0 0 1px rgba(255,107,53,0.3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: "0.06em",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
            e.currentTarget.style.boxShadow = "0 12px 36px rgba(255,107,53,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,107,53,0.45)";
          }}
          aria-label="Open BEM AI Assistant"
        >
          <div style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#0f0f0f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FF6B35",
            fontSize: 12
          }}>
            💬
          </div>
          <span>ASK BEM</span>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 8px #10b981",
            display: "inline-block"
          }} />
        </button>
      )}

      {/* ══ AI CHAT WINDOW ══ */}
      {isOpen && (
        <div
          id="bem-ai-chat-window"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            width: "min(420px, calc(100vw - 32px))",
            height: isMinimized ? "auto" : "min(620px, calc(100vh - 48px))",
            background: "rgba(15, 15, 15, 0.97)",
            border: "1px solid rgba(255,107,53,0.3)",
            borderRadius: 18,
            boxShadow: "0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,107,53,0.15)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "all 0.3s ease",
            animation: "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* Top accent glowing stripe */}
          <div style={{
            height: 3,
            background: "linear-gradient(90deg, #FF6B35, #ff8c5a 50%, #FF6B35)",
            flexShrink: 0
          }} />

          {/* ── HEADER ── */}
          <div style={{
            padding: "14px 18px",
            background: "rgba(20,20,20,0.95)",
            borderBottom: "1px solid rgba(255,107,53,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg, #FF6B35, #ff8c5a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0f0f0f",
                fontWeight: 900,
                fontSize: 16,
                boxShadow: "0 4px 14px rgba(255,107,53,0.35)",
                flexShrink: 0
              }}>
                🛰
              </div>
              <div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <h3 className="font-display" style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "white",
                    letterSpacing: "0.08em",
                    margin: 0
                  }}>
                    BEM AI ASSISTANT
                  </h3>
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: "0 0 6px #10b981",
                    display: "inline-block"
                  }} />
                </div>
                <div style={{
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#FF6B35",
                  fontWeight: 600
                }}>
                  Your guide to Bharat Earth Monitor
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#737373",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#FF6B35"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#737373"}
              >
                <Trash2 style={{ width: 14, height: 14 }} />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#737373",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#737373"}
              >
                {isMinimized ? <Maximize2 style={{ width: 14, height: 14 }} /> : <Minus style={{ width: 14, height: 14 }} />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#737373",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#737373"}
              >
                <X style={{ width: 15, height: 15 }} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context bar if on a known page */}
              {pageContext && (
                <div style={{
                  padding: "6px 14px",
                  background: "rgba(255,107,53,0.06)",
                  borderBottom: "1px solid rgba(255,107,53,0.12)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#FF6B35",
                  flexShrink: 0
                }}>
                  <Compass style={{ width: 12, height: 12, flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Active Context: {pageContext.split(".")[0]}
                  </span>
                </div>
              )}

              {/* ── MESSAGES LIST ── */}
              <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,107,53,0.2) transparent"
              }}>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: msg.isBot ? "flex-start" : "flex-end",
                      gap: 4
                    }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 8,
                      maxWidth: "88%",
                      flexDirection: msg.isBot ? "row" : "row-reverse"
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: msg.isBot ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.1)",
                        border: `1px solid ${msg.isBot ? "rgba(255,107,53,0.3)" : "rgba(255,255,255,0.2)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: msg.isBot ? "#FF6B35" : "#ededed",
                        flexShrink: 0,
                        fontSize: 10
                      }}>
                        {msg.isBot ? <Bot style={{ width: 13, height: 13 }} /> : <User style={{ width: 13, height: 13 }} />}
                      </div>

                      {/* Bubble */}
                      <div style={{
                        padding: "10px 14px",
                        borderRadius: msg.isBot ? "14px 14px 14px 2px" : "14px 14px 2px 14px",
                        background: msg.isBot ? "rgba(24, 24, 24, 0.95)" : "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)",
                        color: msg.isBot ? "#ededed" : "#0f0f0f",
                        border: msg.isBot ? "1px solid rgba(255,107,53,0.18)" : "none",
                        fontSize: 12,
                        lineHeight: 1.55,
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: "pre-line",
                        boxShadow: msg.isBot 
                          ? "0 4px 16px rgba(0,0,0,0.3)" 
                          : "0 4px 16px rgba(255,107,53,0.3)"
                      }}>
                        {msg.text}

                        {/* Follow up prompt if present */}
                        {msg.followUp && (
                          <div style={{
                            marginTop: 8,
                            paddingTop: 8,
                            borderTop: "1px solid rgba(255,255,255,0.08)",
                            fontSize: 11,
                            color: "#9ca3af",
                            fontStyle: "italic"
                          }}>
                            {msg.followUp}
                          </div>
                        )}

                        {/* Navigation shortcut button */}
                        {msg.navSuggestion && (
                          <button
                            onClick={() => handleNavigate(msg.navSuggestion.path)}
                            style={{
                              marginTop: 10,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "6px 12px",
                              borderRadius: 6,
                              background: "rgba(255,107,53,0.15)",
                              border: "1px solid rgba(255,107,53,0.4)",
                              color: "#FF6B35",
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,107,53,0.25)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,107,53,0.15)"}
                          >
                            <span>{msg.navSuggestion.label}</span>
                            <ExternalLink style={{ width: 11, height: 11 }} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 32 }}>
                    <div style={{
                      padding: "8px 12px",
                      borderRadius: "12px 12px 12px 2px",
                      background: "rgba(24,24,24,0.9)",
                      border: "1px solid rgba(255,107,53,0.15)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}>
                      <span style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#FF6B35",
                        animation: "pulse 1s infinite"
                      }} />
                      <span style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#FF6B35",
                        animation: "pulse 1s infinite 0.2s"
                      }} />
                      <span style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#FF6B35",
                        animation: "pulse 1s infinite 0.4s"
                      }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ── QUICK QUESTIONS TABS ── */}
              <div style={{
                padding: "8px 14px",
                background: "rgba(18,18,18,0.95)",
                borderTop: "1px solid rgba(38,38,38,0.7)",
                display: "flex",
                gap: 6,
                overflowX: "auto",
                scrollbarWidth: "none",
                flexShrink: 0
              }}>
                {quickQuestions.slice(0, 5).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    style={{
                      whiteSpace: "nowrap",
                      padding: "5px 10px",
                      borderRadius: 100,
                      background: "rgba(255,107,53,0.08)",
                      border: "1px solid rgba(255,107,53,0.22)",
                      color: "#FF6B35",
                      fontSize: 10,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,107,53,0.18)";
                      e.currentTarget.style.borderColor = "rgba(255,107,53,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,107,53,0.08)";
                      e.currentTarget.style.borderColor = "rgba(255,107,53,0.22)";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* ── INPUT BAR ── */}
              <div style={{
                padding: "12px 14px",
                background: "rgba(14,14,14,0.98)",
                borderTop: "1px solid rgba(255,107,53,0.15)",
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexShrink: 0
              }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask me anything about BEM..."
                  style={{
                    flex: 1,
                    background: "rgba(8, 8, 8, 0.9)",
                    border: "1px solid rgba(38,38,38,0.8)",
                    borderRadius: 8,
                    padding: "9px 12px",
                    color: "white",
                    fontSize: 12,
                    fontFamily: "'Inter', sans-serif",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(255,107,53,0.6)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(38,38,38,0.8)"}
                />

                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim()}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: inputValue.trim() 
                      ? "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)" 
                      : "rgba(38,38,38,0.5)",
                    border: "none",
                    color: inputValue.trim() ? "#0f0f0f" : "#666666",
                    cursor: inputValue.trim() ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    flexShrink: 0,
                    fontWeight: 800
                  }}
                  aria-label="Send message"
                >
                  <Send style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
