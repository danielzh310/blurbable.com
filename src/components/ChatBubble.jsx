import React from "react";

/**
 * ChatBubble now only renders the bubble itself.
 * Alignment is handled by the parent wrapper in index.js
 */
export default function ChatBubble({ message, isUser = false }) {
  const base = {
    borderRadius: 20,
    padding: "10px 14px",
    maxWidth: "75%",
    wordBreak: "break-word",
    fontSize: 15,
    lineHeight: 1.35,
    boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
  };

  const botStyle = {
    ...base,
    background: "#a3b18a",
    color: "#fff",
  };

  const userStyle = {
    ...base,
    background: "#e7e7e7",
    color: "#4a4a4a",
  };

  return <div style={isUser ? userStyle : botStyle}>{message}</div>;
}
