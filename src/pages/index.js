import { useEffect, useRef, useState } from "react";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import CounterDisplay from "../components/CounterDisplay";
import Footer from "../components/Footer";

export default function Home() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Welcome 👋 — want early access? Tell me your name to join the waitlist." }
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0); // 0 => ask name, 1 => ask email, 2 => done
  const [form, setForm] = useState({ name: "", email: "" });
  const [typing, setTyping] = useState(false);
  const scroller = useRef();

  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [messages, typing]);

  const append = (msg) => setMessages(m => [...m, msg]);

  async function handleSend() {
    if (!input.trim()) return;
    // add user bubble
    append({ from: "user", text: input });
    if (step === 0) {
      // capture name, prompt for email
      setForm(f => ({ ...f, name: input.trim() }));
      setInput("");
      setTyping(true);
      await new Promise(r => setTimeout(r, 700));
      setTyping(false);
      append({ from: "bot", text: `Nice to meet you, ${input.trim()}! What's your email?` });
      setStep(1);
    } else if (step === 1) {
      // submit signup
      const email = input.trim();
      setForm(f => ({ ...f, email }));
      setInput("");
      setTyping(true);
      await new Promise(r => setTimeout(r, 900));
      // call api
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, email })
        });
        const data = await res.json();
        setTyping(false);
        append({ from: "bot", text: data?.message ?? "You're on the list — thanks!" });
      } catch (err) {
        setTyping(false);
        append({ from: "bot", text: "Oops — there was an error. Try again later." });
      }
      setStep(2);
    }
  }

  return (
    <div className="container">
      <div className="chat-panel">
        <h2 style={{ margin: 0, marginBottom: 12 }}>blurbable</h2>

        <div ref={scroller} style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 420, overflowY: "auto", paddingBottom: 8 }}>
          {messages.map((m, i) => <ChatBubble key={i} from={m.from}>{m.text}</ChatBubble>)}
          {typing && <div className="bubble bot"><span className="typing"><span className="dot" /><span className="dot" /><span className="dot" /></span></div>}
        </div>

        {step < 2 ? (
          <ChatInput
            placeholder={step === 0 ? "Enter your name" : "Enter your email"}
            value={input}
            onChange={setInput}
            onSend={handleSend}
          />
        ) : (
          <div style={{ marginTop: 12 }}>
            <div className="bubble bot">You're all set — we'll email you when we launch. Thanks! ✨</div>
          </div>
        )}

        <CounterDisplay />
        <Footer />
      </div>
    </div>
  );
}