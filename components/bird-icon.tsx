"use client"

import { motion } from "framer-motion"

export function BirdIcon({ size = 40 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ rotate: [0, -10, 10, -5, 0] }}
      transition={{ duration: 0.5 }}
    >
      {/* Background */}
      <rect width="100" height="100" rx="24" fill="hsl(258, 55%, 58%)" />

      {/* Bird body */}
      <ellipse cx="50" cy="55" rx="22" ry="20" fill="white" />

      {/* Bird head */}
      <circle cx="50" cy="36" r="14" fill="white" />

      {/* Left eye */}
      <circle cx="44" cy="34" r="3" fill="hsl(222, 47%, 11%)" />
      <circle cx="45" cy="33" r="1" fill="white" />

      {/* Right eye */}
      <circle cx="56" cy="34" r="3" fill="hsl(222, 47%, 11%)" />
      <circle cx="57" cy="33" r="1" fill="white" />

      {/* Beak */}
      <path d="M47 39 L50 44 L53 39" fill="hsl(30, 90%, 60%)" strokeLinejoin="round" />

      {/* Cheeks */}
      <circle cx="39" cy="39" r="4" fill="hsl(340, 60%, 85%)" opacity="0.7" />
      <circle cx="61" cy="39" r="4" fill="hsl(340, 60%, 85%)" opacity="0.7" />

      {/* Wings */}
      <ellipse cx="30" cy="55" rx="8" ry="12" fill="hsl(258, 55%, 75%)" transform="rotate(-15, 30, 55)" />
      <ellipse cx="70" cy="55" rx="8" ry="12" fill="hsl(258, 55%, 75%)" transform="rotate(15, 70, 55)" />

      {/* Feet */}
      <line x1="43" y1="73" x2="40" y2="80" stroke="hsl(30, 90%, 60%)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="74" x2="50" y2="81" stroke="hsl(30, 90%, 60%)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="57" y1="73" x2="60" y2="80" stroke="hsl(30, 90%, 60%)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Heart on chest */}
      <path
        d="M50 58 C50 56, 47 53, 45 55 C43 57, 45 60, 50 63 C55 60, 57 57, 55 55 C53 53, 50 56, 50 58Z"
        fill="hsl(340, 60%, 70%)"
      />
    </motion.svg>
  )
}
