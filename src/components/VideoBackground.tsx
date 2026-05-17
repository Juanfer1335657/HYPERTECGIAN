"use client";

import { useState, useEffect } from "react";

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || "ontouchstart" in window;
}

export default function VideoBackground() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (isMobile()) return;
    const id = setTimeout(() => setShowVideo(true), 2000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-black/40" />

      {showVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
