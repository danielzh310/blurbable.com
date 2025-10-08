export default function ChatInput({ placeholder = "", value, onChange, onSend }) {
  return (
    <form className="input-row" onSubmit={(e) => { e.preventDefault(); onSend(); }}>
      <input className="input-box" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      <button className="send-btn" type="submit">Send</button>
    </form>
  );
}