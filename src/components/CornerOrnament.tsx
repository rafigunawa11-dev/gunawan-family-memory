export default function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {/* Top-left */}
      <svg className="absolute top-0 left-0" width="29" height="24" viewBox="0 0 29 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.15 1.08H0.76V23.91" stroke="#EBEAE4" strokeWidth="1" />
      </svg>
      {/* Top-right */}
      <svg className="absolute top-0 right-0" width="29" height="24" viewBox="0 0 29 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scaleX(-1)" }}>
        <path d="M28.15 1.08H0.76V23.91" stroke="#EBEAE4" strokeWidth="1" />
      </svg>
      {/* Bottom-left */}
      <svg className="absolute bottom-0 left-0" width="29" height="24" viewBox="0 0 29 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scaleY(-1)" }}>
        <path d="M28.15 1.08H0.76V23.91" stroke="#EBEAE4" strokeWidth="1" />
      </svg>
      {/* Bottom-right */}
      <svg className="absolute bottom-0 right-0" width="29" height="24" viewBox="0 0 29 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scale(-1)" }}>
        <path d="M28.15 1.08H0.76V23.91" stroke="#EBEAE4" strokeWidth="1" />
      </svg>
    </div>
  );
}
