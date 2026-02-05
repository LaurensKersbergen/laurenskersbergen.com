"use client";

import { useEffect, useState } from "react";

export function CollabCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        opacity: isVisible ? 1 : 0,
        transition: "transform 150ms ease-out, opacity 200ms ease-out",
      }}
    >
      {/* Miro-style cursor arrow */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
      >
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L5.93 2.84a.5.5 0 0 0-.43.37Z"
          fill="#FFD02F"
          stroke="#1a1a1a"
          strokeWidth="1.5"
        />
      </svg>
      {/* Name label */}
      <span
        className="absolute left-4 top-4 whitespace-nowrap rounded-sm px-2 py-0.5 text-xs font-medium"
        style={{
          backgroundColor: "#FFD02F",
          color: "#1a1a1a",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      >
        Laurens
      </span>
    </div>
  );
}
