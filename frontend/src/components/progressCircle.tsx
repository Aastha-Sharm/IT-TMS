import React from "react";
import { motion } from "framer-motion";

interface ProgressCircleProps {
  label: string;
  current: number;
  total: number;
  color?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  label,
  current,
  total,
  color = "#4f46e5", // Indigo-600 default
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
      {/* Circle */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background ring */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#e5e7eb" // Tailwind gray-200
            strokeWidth="10"
            fill="transparent"
          />
          {/* Animated foreground ring */}
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            strokeWidth="10"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold text-gray-800">
            {current}/{total}
          </span>
          <span className="text-sm text-gray-500">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;
