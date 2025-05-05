'use client'

import { useEffect, useRef, useCallback } from 'react'
import HexagonGrid from './HexagonGrid'
import throttle from 'lodash/throttle'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

interface ParticleSystem extends THREE.Points {
  velocities?: Float32Array;
  accelerations?: Float32Array;
  maxSpeed?: number;
  mouseInfluenceRadius?: number;
  lifespan?: Float32Array;
  sizes?: Float32Array;
}

const MouseGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!glowRef.current) return;

      glowRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
      glowRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
    }, 16); // Throttle to ~60fps

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 mouse-glow"
    />
  );
};

const InteractiveBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const createFloatingElements = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const numElements = 20

    // Remove existing elements
    const existingElements = container.getElementsByClassName('floating-element')
    while (existingElements.length > 0) {
      existingElements[0].remove()
    }

    // Create new elements
    for (let i = 0; i < numElements; i++) {
      const element = document.createElement('div')
      element.className = 'floating-element'

      // Random size between 4px and 12px
      const size = Math.random() * 8 + 4
      element.style.width = `${size}px`
      element.style.height = `${size}px`

      // Random position
      element.style.left = `${Math.random() * 100}%`
      element.style.top = `${Math.random() * 100}%`

      container.appendChild(element)
    }
  }, [])

  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      if (!containerRef.current) return

      const elements = containerRef.current.getElementsByClassName('floating-element')
      const rect = containerRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      Array.from(elements).forEach((el) => {
        const element = el as HTMLElement
        const elementRect = element.getBoundingClientRect()
        const elementX = elementRect.left - rect.left + elementRect.width / 2
        const elementY = elementRect.top - rect.top + elementRect.height / 2

        // Calculate distance from mouse
        const deltaX = mouseX - elementX
        const deltaY = mouseY - elementY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        // Move elements only if they're within 200px of the cursor
        if (distance < 200) {
          const moveX = (deltaX / distance) * 2 // Adjust multiplier to control movement intensity
          const moveY = (deltaY / distance) * 2
          element.style.transform = `translate(${moveX}px, ${moveY}px)`
        } else {
          element.style.transform = 'translate(0, 0)'
        }
      })
    }, 16), // Throttle to ~60fps
    []
  )

  useEffect(() => {
    createFloatingElements()
    window.addEventListener('resize', createFloatingElements)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', createFloatingElements)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [createFloatingElements, handleMouseMove])

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />
      <div className="fixed inset-0 pointer-events-none z-10">
        <Canvas style={{ background: 'transparent' }}>
          <ParticleEffect />
        </Canvas>
      </div>
      <div className="fixed inset-0 pointer-events-none z-20">
        <HexagonGrid />
      </div>
      <MouseGlow />
    </>
  )
}

const createParticleTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)')
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }
  return new THREE.Texture()
}

interface IParticleUniforms {
  time: { value: number };
}

interface CustomPointsMaterial extends THREE.PointsMaterial {
  uniforms?: IParticleUniforms;
}

const createParticleUniforms = (): IParticleUniforms => ({
  time: { value: 0 }
})

const ParticleEffect: React.FC = () => {
  const materialRef = useRef<CustomPointsMaterial>(null)
  const { viewport, camera } = useThree()
  const pointsRef = useRef<ParticleSystem>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const particleTexture = useRef<THREE.Texture>(createParticleTexture())

  useEffect(() => {
    camera.position.z = 5

    const handleMouseMove = throttle((e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      }
    }, 16)

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [camera])

  useEffect(() => {
    if (!pointsRef.current) return

    const geometry = pointsRef.current.geometry
    const particleCount = 3000 // More particles for richer effect
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const accelerations = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const lifespan = new Float32Array(particleCount)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < positions.length; i += 3) {
      // Distribute particles more naturally
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * Math.min(viewport.width, viewport.height)
      positions[i] = Math.cos(angle) * radius
      positions[i + 1] = Math.sin(angle) * radius
      positions[i + 2] = 0

      // Initialize with slight circular motion
      velocities[i] = Math.cos(angle + Math.PI/2) * 0.01
      velocities[i + 1] = Math.sin(angle + Math.PI/2) * 0.01
      velocities[i + 2] = 0

      accelerations[i] = 0
      accelerations[i + 1] = 0
      accelerations[i + 2] = 0

      // Enhanced color palette with subtle variations and complementary colors
      const t = Math.random()
      const variance = Math.random() * 0.08 - 0.04 // Subtle color variance

      if (t < 0.35) {
        // Cool blue
        colors[i] = 0.145 + variance
        colors[i + 1] = 0.388 + variance
        colors[i + 2] = 0.922 + variance
      } else if (t < 0.65) {
        // Vibrant purple
        colors[i] = 0.486 + variance
        colors[i + 1] = 0.227 + variance
        colors[i + 2] = 0.929 + variance
      } else if (t < 0.85) {
        // Soft cyan
        colors[i] = 0.247 + variance
        colors[i + 1] = 0.388 + variance
        colors[i + 2] = 0.847 + variance
      } else {
        // Accent color (warmer tone)
        colors[i] = 0.525 + variance
        colors[i + 1] = 0.345 + variance
        colors[i + 2] = 0.855 + variance
      }
    }

    // Initialize particle attributes
    for (let i = 0; i < particleCount; i++) {
      lifespan[i] = Math.random() * 5 + 2 // Random lifespan between 2-7 seconds
      sizes[i] = 1.5 + Math.random() * 2.5 // Random size between 1.5-4
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('lifespan', new THREE.BufferAttribute(lifespan, 1))

    if (pointsRef.current) {
      pointsRef.current.velocities = velocities
      pointsRef.current.accelerations = accelerations
      pointsRef.current.maxSpeed = 0.12
      pointsRef.current.mouseInfluenceRadius = 5
      pointsRef.current.lifespan = lifespan
      pointsRef.current.sizes = sizes
    }
  }, [viewport.width, viewport.height])

  useFrame((state) => {
    if (materialRef.current?.uniforms) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
    if (!pointsRef.current) return

    const positions = (pointsRef.current.geometry.attributes.position.array as Float32Array)
    const velocities = pointsRef.current.velocities
    const accelerations = pointsRef.current.accelerations
    const maxSpeed = pointsRef.current.maxSpeed
    const mouseInfluenceRadius = pointsRef.current.mouseInfluenceRadius

    if (!velocities || !accelerations || !maxSpeed || !mouseInfluenceRadius) return

    const time = state.clock.elapsedTime

    for (let i = 0; i < positions.length; i += 3) {
      // Reset acceleration
      accelerations[i] = 0
      accelerations[i + 1] = 0

      // Mouse attraction/repulsion
      const dx = positions[i] - mousePosition.current.x * viewport.width
      const dy = positions[i + 1] - mousePosition.current.y * viewport.height
      const distToMouse = Math.sqrt(dx * dx + dy * dy)

      // Enhanced force calculation with distinct repulsion and attraction zones
      if (distToMouse < mouseInfluenceRadius) {
        const repulsionRadius = mouseInfluenceRadius * 0.25; // Close range repulsion
        const attractionRadius = mouseInfluenceRadius * 0.75; // Medium range attraction
        const maxForce = 0.004; // Increased from 0.002

        let force = 0;
        if (distToMouse < repulsionRadius) {
          // Strong repulsion when very close
          force = maxForce * (1 - distToMouse / repulsionRadius);
        } else if (distToMouse < attractionRadius) {
          // Smooth attraction at medium range
          force = -maxForce * 0.3 * (1 - (distToMouse - repulsionRadius) / (attractionRadius - repulsionRadius));
        } else {
          // Gentle fade-out beyond attraction radius
          force = -maxForce * 0.1 * (1 - (distToMouse - attractionRadius) / (mouseInfluenceRadius - attractionRadius));
        }

        // Apply force with smooth transition
        const angle = Math.atan2(dy, dx);
        accelerations[i] += -Math.cos(angle) * force;
        accelerations[i + 1] += -Math.sin(angle) * force;
      }

      // Enhanced fluid motion with multiple frequency components
      const swirl = 0.0004 // Reduced for smoother motion
      const baseSwirl = swirl * (1 + Math.sin(time * 0.5) * 0.2) // Breathing effect
      accelerations[i] += -positions[i + 1] * baseSwirl
      accelerations[i + 1] += positions[i] * baseSwirl

      // Multi-frequency oscillation for more organic movement
      const fastOsc = 0.00015 * Math.sin(time * 3 + positions[i] * 0.2)
      const slowOsc = 0.0002 * Math.sin(time * 0.7 + positions[i + 1] * 0.3)
      accelerations[i] += fastOsc + slowOsc
      accelerations[i + 1] += slowOsc - fastOsc

      // Add subtle spiral effect
      const distFromCenter = Math.sqrt(positions[i] * positions[i] + positions[i + 1] * positions[i + 1])
      const spiralStrength = 0.00005 * Math.max(0, 1 - distFromCenter / Math.max(viewport.width, viewport.height))
      const angle = Math.atan2(positions[i + 1], positions[i])
      accelerations[i] += Math.cos(angle) * spiralStrength
      accelerations[i + 1] += Math.sin(angle) * spiralStrength

      // Update velocity with acceleration
      velocities[i] += accelerations[i]
      velocities[i + 1] += accelerations[i + 1]

      // Calculate current speed
      const speed = Math.sqrt(velocities[i] * velocities[i] + velocities[i + 1] * velocities[i + 1])

      // Variable damping based on speed and position
      const speedFactor = Math.min(1, speed / (maxSpeed * 0.7))
      const baseDamping = 0.96
      const damping = baseDamping - speedFactor * 0.02
      velocities[i] *= damping
      velocities[i + 1] *= damping

      // Limit speed if necessary
      if (speed > maxSpeed) {
        velocities[i] = (velocities[i] / speed) * maxSpeed
        velocities[i + 1] = (velocities[i + 1] / speed) * maxSpeed
      }

      // Update position
      positions[i] += velocities[i]
      positions[i + 1] += velocities[i + 1]

      // Soft boundary behavior with gradual push back
      const margin = 1.0
      const boundaryForce = 0.02
      const pushBackEase = (x: number) => 1 - Math.pow(1 - x, 3) // Cubic ease-in

      if (Math.abs(positions[i]) > viewport.width - margin) {
        const overflow = Math.abs(positions[i]) - (viewport.width - margin)
        const force = pushBackEase(overflow / margin) * boundaryForce
        accelerations[i] -= Math.sign(positions[i]) * force
      }

      if (Math.abs(positions[i + 1]) > viewport.height - margin) {
        const overflow = Math.abs(positions[i + 1]) - (viewport.height - margin)
        const force = pushBackEase(overflow / margin) * boundaryForce
        accelerations[i + 1] -= Math.sign(positions[i + 1]) * force
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        ref={materialRef}
        transparent
        opacity={0.75}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
        map={particleTexture.current}
        customProgramCacheKey="particle-material-dynamic"
        onBeforeCompile={(shader) => {
          const uniforms = createParticleUniforms()
          shader.uniforms = { ...shader.uniforms, ...uniforms }

          shader.vertexShader = shader.vertexShader.replace(
            'void main() {',
            `
            uniform float time;
            attribute float size;
            attribute float lifespan;

            float getNormalizedPulse(float t, float freq, float phase) {
              return 0.5 * (1.0 + sin(t * freq + phase));
            }

            void main() {
              float age = mod(time, lifespan);
              float normalizedAge = age / lifespan;
              float fade = sin(normalizedAge * 3.14159);
              float pulse = 1.0 + getNormalizedPulse(time, 2.0, position.x * 0.5 + position.y * 0.5) * 0.15;
              float finalSize = size * pulse * fade;
            `
          )

          shader.vertexShader = shader.vertexShader.replace(
            'gl_PointSize = size;',
            'gl_PointSize = finalSize;'
          )

          if (materialRef.current) {
            materialRef.current.uniforms = uniforms
          }
        }}
      />
    </points>
  )
}

export default InteractiveBackground
