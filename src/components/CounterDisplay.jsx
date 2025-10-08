import { useEffect, useState } from "react";

export default function CounterDisplay() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/count").then(r => r.json()).then(d => { if(mounted) setCount(d.count); });
    // poll every 8s
    const id = setInterval(() => fetch("/api/count").then(r => r.json()).then(d => { if(mounted) setCount(d.count); }), 8000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  return <div style={{marginTop:10, color:"#b0b0b0"}}>{count !== null ? `Already ${count} people signed up` : 'Loading signups...'}</div>
}