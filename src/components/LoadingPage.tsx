import { useEffect, useState } from "react";
import "./LoadingPage.css";

const LoadingPage = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-container">
      <div className="box">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} style={{ "--i": i + 1 } as React.CSSProperties}>
            <i>INNOVATE</i>
            EXPLORE
            <i>SOLVE</i>
          </span>
        ))}
      </div>
    </div>
  );
};

export default LoadingPage;