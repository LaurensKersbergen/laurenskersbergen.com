"use client";

import { useEffect, useState } from "react";

// Miro teal/mint green color (matched from screenshot)
const CURSOR_COLOR = "#6BCCC4";

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
      document.body.style.cursor = "";
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
      document.body.style.cursor = "none";
    };

    document.body.style.cursor = "none";

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: 0,
          top: 0,
          transform: `translate(${position.x}px, ${position.y}px)`,
          opacity: isVisible ? 1 : 0,
          transition: "transform 100ms ease-out, opacity 150ms ease-out",
        }}
      >
        {/* Miro cursor pointer - clean simple triangle */}
        <svg
          width="18"
          height="22"
          viewBox="0 0 18 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ 
            filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
          }}
        >
          {/* White outline */}
          <path
            d="M1.5 1L1.5 19L6 14H15L1.5 1Z"
            fill="white"
            stroke="white"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Teal fill */}
          <path
            d="M3 3.5L3 16L6 13H12L3 3.5Z"
            fill={CURSOR_COLOR}
          />
        </svg>
        
        {/* Label container */}
        <div
          className="absolute"
          style={{
            left: "4px",
            top: "20px",
          }}
        >
          {/* Triangle notch pointing up toward cursor */}
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            style={{
              marginLeft: "16px",
              marginBottom: "-1px",
              display: "block",
            }}
          >
            <path d="M6 0L12 8H0L6 0Z" fill={CURSOR_COLOR} />
          </svg>
          
          {/* Pill with avatar and name */}
          <div
            className="flex items-center rounded-full"
            style={{
              backgroundColor: CURSOR_COLOR,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              paddingRight: "14px",
              paddingLeft: "3px",
              paddingTop: "3px",
              paddingBottom: "3px",
            }}
          >
            {/* Avatar */}
            <div
              className="rounded-full overflow-hidden flex-shrink-0 bg-gray-200"
              style={{
                width: "32px",
                height: "32px",
                border: "2.5px solid white",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {/* Placeholder - gray circle with simple avatar silhouette */}
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%", height: "100%", backgroundColor: "#d0d0d0" }}
              >
                <circle cx="16" cy="12" r="5" fill="#a0a0a0" />
                <ellipse cx="16" cy="28" rx="9" ry="7" fill="#a0a0a0" />
              </svg>
            </div>
            {/* Name */}
            <span
              className="whitespace-nowrap"
              style={{
                color: "#1a3d3a",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: "15px",
                fontWeight: 500,
                marginLeft: "8px",
                letterSpacing: "-0.01em",
              }}
            >
              Laurens
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
