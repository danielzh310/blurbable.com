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
        fontFamily: "'Source Sans Pro', sans-serif",
        color: "#4a4a4a",
      }}
    >
      {/* LOGO */}
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

      {/* TITLE */}
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

      {/* CHAT AREA */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div
          ref={scrollRef}
          style={{
            width: "100%",
            maxWidth: 800,
            flexGrow: 1,
            overflowY: "auto",
            padding: "0 24px 200px", // ensures space for input/footer
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                width: "100%",
                justifyContent: m.from === "user" ? "flex-end" : "flex-start",
              }}
            >
              <ChatBubble
                message={m.text}
                isUser={m.from === "user"}
                bubbleColor={m.from === "user" ? "#b0b0b0" : "#a3b18a"}
              />
            </div>
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

        {/* FIXED INPUT + FOOTER SECTION */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px 0 12px",
            boxShadow: "0 -2px 4px rgba(0,0,0,0.05)",
          }}
        >
          {/* Input field first */}
          <div
            style={{
              width: "80%",
              maxWidth: 420,
              marginBottom: 6,
            }}
          >
            <ChatInput onSend={(v) => handleSend(v)} inputColor="#b0b0b0" height="32px" />
          </div>

          {/* Join counter BELOW the input */}
          <div
            style={{
              fontSize: 14,
              color: "#4a4a4a",
              marginTop: 6,
              textAlign: "center",
            }}
          >
            Join 1 others waiting for early access!
          </div>

          {/* Footer copyright under everything */}
          <div style={{ marginTop: 4 }}>
            <Footer />
          </div>
        </div>
      </div>

      {/* Styling */}
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
