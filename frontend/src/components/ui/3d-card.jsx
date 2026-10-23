import React, { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export function CardContainer({ children, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0.5); 
  const y = useMotionValue(0.5); 

  const rotateX = useTransform(y, [0, 0.5, 1], [15, 0, -15]);
  const rotateY = useTransform(x, [0, 0.5, 1], [-15, 0, 15]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className={`relative flex items-center justify-center ${className}`}
    >
      <motion.div 
        style={{ 
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out" 
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function CardBody({ children, className = "" }) {
  return (
    <div className={`relative w-full h-full transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardItem({
  children,
  className = "",
  translateZ = 0,
  ...props
}) {
  return (
    <motion.div
      style={{ transform: `translateZ(${translateZ}px)` }}
      className={`transition-transform duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}