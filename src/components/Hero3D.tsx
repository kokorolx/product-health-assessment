'use client'

import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'

const CELL_SIZE = 40
const DEPTH_LAYERS = 3
const LAYER_DEPTH = 20

const Hero3D = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)

  const rotateX = useTransform(mouseY, [-300, 300], [15, -15])
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15])
  const scale = useTransform(
    mouseX,
    [-300, 0, 300],
    [0.95, 1, 0.95]
  )

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }


  // Reset on mouse leave
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{ perspective: 1500 }}
      className="absolute inset-0 overflow-hidden bg-gradient-to-br from-blue-900/10 to-purple-900/10"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
          transition: 'transform 0.1s ease-out'
        }}
        className="relative h-full w-full"
      >
        {/* Multiple depth layers with grid patterns */}
        {[...Array(DEPTH_LAYERS)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{
              transform: `translateZ(${-index * LAYER_DEPTH}px)`,
              opacity: 1 - (index * 0.2)
            }}
          >
            <svg width="100%" height="100%" className={`opacity-${20 - index * 5}`}>
              <pattern
                id={`grid-${index}`}
                width={CELL_SIZE}
                height={CELL_SIZE}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${CELL_SIZE} 0 L 0 0 0 ${CELL_SIZE}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={0.5 - index * 0.1}
                  className="text-blue-500"
                />
              </pattern>
              <rect width="100%" height="100%" fill={`url(#grid-${index})`} />
            </svg>

            {/* Layer-specific gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5"
                 style={{ opacity: 0.8 - index * 0.2 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5"
                 style={{ opacity: 0.8 - index * 0.2 }} />
          </motion.div>
        ))}

        {/* Hover effect particles */}
        <AnimatePresence>
          {isHovered && [...Array(15)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              initial={{
                opacity: 0,
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                scale: 0
              }}
              animate={{
                opacity: [0, 0.8, 0],
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
                scale: [0, 1.5, 0],
                z: Math.random() * -200
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: Math.random() * 2
              }}
              style={{ transformStyle: "preserve-3d" }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default Hero3D
