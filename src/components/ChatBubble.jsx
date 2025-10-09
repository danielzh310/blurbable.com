import React from "react";

export default function ChatBubble({ message, isUser = false }) {
  const userStyle = {
    alignSelf: "flex-end",
    background: "#e0e0e0",
    color: "#111",
    borderRadius: 20,
    padding: "10px 14px",
    maxWidth: "75%",
    wordBreak: "break-word",
  };

  const botStyle = {
    alignSelf: "flex-start",
    background: "#a3b18a", // requested green
    color: "#fff",
    borderRadius: 20,
    padding: "10px 14px",
    maxWidth: "75%",
    wordBreak: "break-word",
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={isUser ? userStyle : botStyle}>{message}</div>
    </div>
  );
}
