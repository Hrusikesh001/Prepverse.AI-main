

import React from 'react';

function RatingInput({
  value = 0,
  total = 5,
  onChange = () => {},
  color = '#ff6900',      // Active dot color (orange)
  bgColor = '#374151',    // Inactive dot color (dark gray)
  readOnly = false,
  size = 16
}) {
  // Convert 0-100 scale to 0-5 for display
  const displayValue = Math.round((value / 100) * total);

  const handleClick = (index) => {
    if (readOnly) return;
    const newValue = Math.round(((index + 1) / total) * 100);
    onChange(newValue);
  };

  return (
    <div className="flex gap-2 cursor-pointer">
      {[...Array(total)].map((_, index) => {
        const isActive = index < displayValue;
        return (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`w-4 h-4 rounded transition-all ${readOnly ? '' : 'hover:scale-110'}`}
            style={{
              backgroundColor: isActive ? color : bgColor,
              width: `${size}px`,
              height: `${size}px`,
            }}
          ></div>
        );
      })}
    </div>
  );
}

export default RatingInput;