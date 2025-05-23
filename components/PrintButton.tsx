"use client";
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{ padding: "8px 16px", fontSize: "1rem" }}
    >
      印刷
    </button>
  );
}
