import React from "react";

export default function Footer() {
  return (
    <div
      style={{
        textAlign: "center",
        color: "#777",
        fontSize: 13,
        paddingTop: 12,
        paddingBottom: 24,
      }}
    >
      ©{new Date().getFullYear()} Blurbable
    </div>
  );
}
