import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * React Error Boundary (PRD §69)
 * Prevents black screens / blank application crashes when any child component errors out.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("BEM ErrorBoundary caught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "#0f0f0f",
          color: "#ededed"
        }}>
          <div style={{
            maxWidth: 480,
            width: "100%",
            background: "rgba(20,20,20,0.95)",
            border: "1px solid rgba(255,107,53,0.3)",
            borderRadius: 16,
            padding: "32px 28px",
            textAlign: "center",
            boxShadow: "0 16px 40px rgba(0,0,0,0.8)"
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(255,107,53,0.12)",
              border: "1px solid rgba(255,107,53,0.3)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16
            }}>
              <AlertTriangle style={{ width: 28, height: 28, color: "#FF6B35" }} />
            </div>

            <h2 className="font-display" style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#ffffff",
              margin: "0 0 10px"
            }}>
              Something went wrong.
            </h2>

            <p style={{
              fontSize: 13,
              color: "#9ca3af",
              lineHeight: 1.6,
              margin: "0 0 24px"
            }}>
              BEM could not load this section.
            </p>

            <div style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <a
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,107,53,0.4)",
                  background: "rgba(255,107,53,0.15)",
                  color: "#FF6B35",
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 800,
                  textDecoration: "none"
                }}
              >
                [ RETURN TO LOGIN ]
              </a>

              <button
                onClick={this.handleReset}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)",
                  color: "#0f0f0f",
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 800,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(255,107,53,0.3)"
                }}
              >
                <RefreshCw style={{ width: 14, height: 14 }} />
                [ TRY AGAIN ]
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
