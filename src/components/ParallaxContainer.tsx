import { useEffect, useRef, ReactNode } from 'react';

interface ParallaxContainerProps {
  children: ReactNode;
  disabled?: boolean;
}

const ParallaxContainer: React.FC<ParallaxContainerProps> = ({ children, disabled = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate rotation based on mouse position relative to center
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      targetRotateY = ((mouseX - centerX) / rect.width) * 20;
      targetRotateX = ((mouseY - centerY) / rect.height) * -20;
    };

    const animate = () => {
      // Smooth interpolation
      const ease = 0.1;
      currentRotateX += (targetRotateX - currentRotateX) * ease;
      currentRotateY += (targetRotateY - currentRotateY) * ease;

      // Apply transformation
      container.style.transform = `
        rotateX(${currentRotateX}deg)
        rotateY(${currentRotateY}deg)
      `;

      rafId = requestAnimationFrame(animate);
    };

    const throttle = (fn: (e: MouseEvent) => void, delay: number) => {
      let lastCall = 0;
      return (event: MouseEvent) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
          fn(event);
          lastCall = now;
        }
      };
    };

    const throttledHandleMouseMove = throttle(handleMouseMove, 16);
    window.addEventListener('mousemove', throttledHandleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', throttledHandleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [disabled]);

  return (
    <div ref={containerRef} className="parallax-container">
      {children}
    </div>
  );
};

export default ParallaxContainer;