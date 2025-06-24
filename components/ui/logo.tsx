import React from "react";
import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: "default" | "icon" | "text";
}

export function Logo({ className, showText = true, variant = "default" }: LogoProps) {
  const iconSvg = (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", variant === "icon" ? "h-8 w-8" : "h-10 w-10")}
    >
      {/* Magnifying glass with circuit pattern inside */}
      <circle
        cx="16"
        cy="16"
        r="12"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        className="text-blue-600"
      />
      
      {/* Circuit pattern inside magnifying glass */}
      <g className="text-blue-500">
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="20" cy="12" r="1.5" fill="currentColor" />
        <circle cx="16" cy="20" r="1.5" fill="currentColor" />
        <line x1="12" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="16" y1="12" x2="16" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="12" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="12" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5" />
      </g>
      
      {/* Magnifying glass handle */}
      <line
        x1="25"
        y1="25"
        x2="35"
        y2="35"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-blue-600"
      />
      
      {/* AI sparkles around the glass */}
      <g className="text-blue-400">
        <circle cx="8" cy="8" r="1" fill="currentColor" opacity="0.7" />
        <circle cx="30" cy="6" r="1" fill="currentColor" opacity="0.7" />
        <circle cx="6" cy="24" r="1" fill="currentColor" opacity="0.7" />
      </g>
    </svg>
  );

  const textElement = showText && variant !== "icon" && (
    <div className="flex flex-col">
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        Deep Research
      </span>
      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 -mt-1">
        Agent
      </span>
    </div>
  );

  if (variant === "icon") {
    return <div className={className}>{iconSvg}</div>;
  }

  if (variant === "text") {
    return <div className={className}>{textElement}</div>;
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {iconSvg}
      {textElement}
    </div>
  );
} 