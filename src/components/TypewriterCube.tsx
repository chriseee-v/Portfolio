import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TypewriterCube = () => {
  const words = ["innovate.", "explore.", "solve."];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [showLab, setShowLab] = useState(false);
  const [rotationComplete, setRotationComplete] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    if (isTyping) {
      if (currentText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        // Check if this is the last word (solve.)
        if (currentWordIndex === words.length - 1) {
          // After solve. finishes typing, trigger rotation
          const timeout = setTimeout(() => {
            setShowLab(true); // Show Lab text immediately so it's ready for rotation
            setIsRotating(true);
            // After rotation completes, keep Lab visible then restart
            setTimeout(() => {
              setRotationComplete(true);
              // After showing Lab, restart the cycle
              setTimeout(() => {
                setShowLab(false);
                setIsRotating(false);
                setRotationComplete(false);
                setCurrentWordIndex(0);
                setCurrentText("");
                setIsTyping(true);
              }, 2000); // Show Lab for 2 seconds before restarting
            }, 800); // Duration of rotation animation
          }, 1500);
          return () => clearTimeout(timeout);
        } else {
          const timeout = setTimeout(() => {
            setIsTyping(false);
          }, 1500);
          return () => clearTimeout(timeout);
        }
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }
  }, [currentText, isTyping, currentWordIndex]);

  return (
    <span
      style={{
        display: "inline-block",
        perspective: "1000px",
        perspectiveOrigin: "center center",
      }}
    >
      <motion.span
        animate={
          isRotating || rotationComplete
            ? {
                rotateX: -180,
              }
            : {
                rotateX: 0,
              }
        }
        transition={
          isRotating
            ? {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
              }
            : {}
        }
        style={{
          display: "inline-block",
          transformStyle: "preserve-3d",
          position: "relative",
          transformOrigin: "center center",
        }}
      >
        {/* Top face - shows "solve." - positioned at front of cube */}
        <span
          style={{
            display: "inline-block",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(40px)",
            transformOrigin: "center center",
          }}
        >
          {currentText}
        </span>

        {/* Bottom face - shows "Lab." - positioned at back of cube */}
        {showLab && (
          <span
            style={{
              display: "inline-block",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              transform: "rotateX(180deg) translateZ(-40px)",
              transformOrigin: "center center",
            }}
          >
            Lab.
          </span>
        )}
      </motion.span>
    </span>
  );
};

export default TypewriterCube;
