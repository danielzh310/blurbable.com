export default function ChatBubble({ from = "bot", children }) {
  const cls = from === "bot" ? "bubble bot" : "bubble user";
  return <div className={cls} style={{ marginBottom: 12 }}>{children}</div>;
}