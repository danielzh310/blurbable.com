import React, { useEffect, useRef, useState } from "react";

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");
  const ref = useRef();

  useEffect(() => {
    // focus the input on mount
    if (ref.current) ref.current.focus();
  }, []);

  const submit = (e) => {
    e?.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <form
      onSubmit={submit}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 14,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "auto",
        zIndex: 60,
      }}
    >
      <div
        style={{
          width: "95%",
          maxWidth: 760,
          display: "flex",
          gap: 12,
          alignItems: "center",
          background: "transparent",
        }}
      >
        <input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type here"
          style={{
            flex: 1,
            height: 52,
            borderRadius: 999,
            padding: "0 20px",
            background: "#cfcfcf",
            border: "none",
            boxShadow: "none",
            color: "#222",
            fontSize: 15,
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            background: "#a3b18a",
            border: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
          aria-label="Send"
        >
          +
        </button>
      </div>
    </form>
  );
}
