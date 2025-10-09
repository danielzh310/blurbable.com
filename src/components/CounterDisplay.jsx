import React, { useEffect, useState } from "react";

export default function CounterDisplay() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchCount() {
      try {
        const res = await fetch("/api/count");
        const json = await res.json();
        if (!mounted) return;
        const n = Number(json.count ?? 0);
        setCount(n);
      } catch (err) {
        if (!mounted) return;
        setCount(0);
      }
    }
    fetchCount();
    const id = setInterval(fetchCount, 8000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 8, color: "#666", fontSize: 14 }}>
      {count === null ? "Loading..." : `Join ${count} others waiting for early access!`}
    </div>
  );
}
