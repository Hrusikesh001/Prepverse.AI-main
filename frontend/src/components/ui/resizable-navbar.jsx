import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils.js";

const Navbar = ({ children, className }) => (
  <nav
    className={cn(
      "w-full flex items-center justify-between px-6 h-16 sticky top-0 z-50 transition-colors duration-300",
      className
    )}
  >
    {children}
  </nav>
);

export const NavBody = ({ children, className }) => (
  <div className={cn("hidden lg:flex w-full items-center justify-between px-40", className)}>
    {children}
  </div>
);

export const NavItems = ({ items, className, onItemClick, theme, currentPath }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "hidden lg:flex flex-row items-center space-x-6 text-sm font-medium",
        theme === "dark" ? "text-neutral-300" : "text-gray-800",
        className
      )}
    >
      {items.map((item, idx) => {
  const isActive = currentPath === item.link;
  const isAlwaysHighlighted = item.name === "Find Internship"; // ✅ only internship

  return (
    <a
      key={idx}
      href={item.link}
      onClick={onItemClick}
      onMouseEnter={() => setHovered(idx)}
      className={cn(
        "relative px-3 py-2 rounded-md transition-colors",
        isAlwaysHighlighted
          ? "text-[#FF6900] font-bold"   // ✅ internship always highlighted
          : isActive
          ? "text-[#FF6900] font-semibold" // ✅ keep old active behavior
          : "hover:text-[#FF6900]"         // ✅ keep old hover
      )}
    >
      {(hovered === idx || isActive) && ( // ❌ no hover-bg for internship, only others
        <motion.div
          layoutId="hovered"
          className={`absolute inset-0 rounded-md ${
            theme === "dark"
              ? "bg-gradient-to-r from-gray-500/10 to-orange-500/10"
              : "bg-orange-500/10"
          }`}
        />
      )}
      <span className="relative z-20">{item.name}</span>
    </a>
  );
})}

    </motion.div>
  );
};

// ================= Mobile Nav =================
export const MobileNav = ({ children, className }) => (
  <div className={cn("lg:hidden w-full", className)}>{children}</div>
);

export const MobileNavHeader = ({ children, className }) => (
  <div className={cn("flex w-full items-center justify-between px-4 h-16", className)}>
    {children}
  </div>
);

export const MobileNavToggle = ({ isOpen, onClick }) => (
  <button onClick={onClick} className="flex flex-col space-y-1.5 focus:outline-none">
    <span
      className={`h-0.5 w-6 rounded-full transition ${
        isOpen ? "rotate-45 translate-y-2 bg-[#FF6900]" : "bg-gray-600"
      }`}
    />
    <span
      className={`h-0.5 w-6 rounded-full transition ${
        isOpen ? "opacity-0" : "bg-gray-600"
      }`}
    />
    <span
      className={`h-0.5 w-6 rounded-full transition ${
        isOpen ? "-rotate-45 -translate-y-2 bg-[#FF6900]" : "bg-gray-600"
      }`}
    />
  </button>
);

export const MobileNavMenu = ({ children, className, isOpen, theme }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "absolute inset-x-0 top-16 z-50 flex flex-col items-start gap-4 px-6 py-6 shadow-lg backdrop-blur-md border rounded-lg",
          theme === "dark"
            ? "bg-neutral-900/95 border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-800",
          className
        )}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export const NavbarLogo = ({ theme }) => (
  <div className="flex items-center gap-1 font-bold text-xl">
    <span className="text-sm text-[#FF6900]">◆</span>
    <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Prepverse.</span>
    <span className="text-[#FF6900]">AI</span>
  </div>
);

export const NavbarButton = ({ children, className, variant = "default", ...props }) => {
  const base =
    "px-4 py-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1";

  const variants = {
    default: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    primary: "bg-[#FF6900] text-white hover:bg-[#e65c00]",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Navbar;