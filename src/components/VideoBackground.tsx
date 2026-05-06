"use client";

export default function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      {/* Overlay para legibilidad */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute min-w-full min-h-full object-cover opacity-80"
      >
        <source src="/background.mp4" type="video/mp4" />
        {/* Fallback color si el video no carga */}
      </video>
    </div>
  );
}
