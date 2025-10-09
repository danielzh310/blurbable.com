import React, { useEffect, useRef, useState } from "react";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import CounterDisplay from "../components/CounterDisplay";
import Footer from "../components/Footer";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Welcome 👋 — want early access? Tell me your name to join the waitlist.",
    },
  ]);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "" });
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    // ensure page background and font
    document.documentElement.style.background = "#f5f5f5";
    document.body.style.background = "#f5f5f5";
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 200;
    }
  }, [messages, typing]);

  function appendMessage(msg) {
    setMessages((m) => [...m, msg]);
  }

  async function handleSend(raw) {
    const value = (raw || "").trim();
    if (!value) return;

    // add user message
    appendMessage({ from: "user", text: value });

    if (step === 0) {
      setForm((f) => ({ ...f, name: value }));
      setTyping(true);
      await new Promise((r) => setTimeout(r, 650));
      setTyping(false);
      appendMessage({
        from: "bot",
        text: `Nice to meet you, ${value}! What's your email?`,
      });
      setStep(1);
      return;
    }

    if (step === 1) {
      // submit email
      setForm((f) => ({ ...f, email: value }));
      setTyping(true);
      await new Promise((r) => setTimeout(r, 900));
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name || "", email: value }),
        });
        const data = await res.json();
        setTyping(false);
        appendMessage({
          from: "bot",
          text: data?.message || "You're on the waitlist — thanks!",
        });
      } catch (err) {
        setTyping(false);
        appendMessage({
          from: "bot",
          text: "Sorry — something went wrong. Try again later.",
        });
      }
      setStep(2);
      return;
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 40,
        paddingBottom: 80,
        fontFamily: "'Source Sans Pro', sans-serif",
        color: "#4a4a4a",
      }}
    >
      {/* logo (bigger) */}
      <img
        src="/favicon.ico"
        alt="logo"
        style={{
          position: "fixed",
          left: 20,
          top: 18,
          width: 70,
          height: 70,
          objectFit: "contain",
        }}
      />

      {/* heading */}
      <h1
        style={{
          fontSize: 34,
          color: "#4a4a4a",
          marginBottom: 24,
          fontWeight: 600,
        }}
      >
        Hey there 👋 Want in?
      </h1>

      {/* two-column layout: chat (left) and input column (right) */}
      <div
        style={{
          width: "95%",
          maxWidth: 1100,
          display: "flex",
          gap: 40,
          alignItems: "flex-start",
        }}
      >
        {/* left: chat area */}
        <div
          ref={scrollRef}
          style={{
            flex: 2,
            minHeight: 300,
            maxHeight: 520,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "20px 24px",
          }}
        >
          {messages.map((m, i) => (
            <ChatBubble key={i} message={m.text} isUser={m.from === "user"} />
          ))}

          {typing && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  background: "#a3b18a",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: 18,
                  maxWidth: "70%",
                }}
              >
                <span style={{ display: "inline-flex", gap: 6 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.9)",
                      animation: "bounce 1s infinite",
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.9)",
                      animation: "bounce 1s infinite 0.15s",
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.9)",
                      animation: "bounce 1s infinite 0.3s",
                      display: "inline-block",
                    }}
                  />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* right: vertical input column (centered) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center", // vertically center
            minHeight: 200,
            gap: 12,
            padding: "8px 4px",
          }}
        >
          {/* optional micro-help bubble at top of input column */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                background: "#d0d0d0",
                color: "#333",
                padding: "8px 14px",
                borderRadius: 18,
                maxWidth: "80%",
                fontSize: 14,
              }}
            >
              How do I sign up?
            </div>
          </div>

          {/* the ChatInput will fill the column width */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "100%", maxWidth: 360 }}>
              <ChatInput onSend={(v) => handleSend(v)} />
            </div>
          </div>
        </div>
      </div>

      {/* counter and footer */}
      <div style={{ marginTop: 28, width: "100%", textAlign: "center" }}>
        <CounterDisplay />
      </div>

      <div style={{ width: "100%", maxWidth: 760, marginTop: 18 }}>
        <Footer />
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap');

        @keyframes bounce {
          0% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-6px);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 0.3;
          }
        }

        body {
          font-family: 'Source Sans Pro', sans-serif !important;
          color: #4a4a4a;
        }
      `}</style>
    </div>
  );
}
