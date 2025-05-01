import { useState, useEffect, useCallback } from 'react';

type MouseMoveHandler = (e: MouseEvent) => void;

const HexagonGrid: React.FC = () => {
  const [activeHexagons, setActiveHexagons] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const grid = document.querySelector('.hexagon-grid');
    if (!grid) return;

    const rect = grid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hexagons = document.querySelectorAll('.hexagon');
    const newActiveHexagons = new Set<string>();

    hexagons.forEach((hexagon, index) => {
      const hexRect = hexagon.getBoundingClientRect();
      const hexCenterX = hexRect.left + hexRect.width / 2 - rect.left;
      const hexCenterY = hexRect.top + hexRect.height / 2 - rect.top;

      const distance = Math.sqrt(
        Math.pow(x - hexCenterX, 2) + Math.pow(y - hexCenterY, 2)
      );

      // Improved distance calculation with falloff
      const activationRadius = 180;
      if (distance < activationRadius) {
        const intensity = Math.pow(1 - (distance / activationRadius), 1.5); // More pronounced falloff
        newActiveHexagons.add(`hex-${index}`);
        const hexElement = hexagon as HTMLElement;
        hexElement.style.setProperty('--activation-intensity', intensity.toString());
      }
    });

    setActiveHexagons(newActiveHexagons);
  }, []);

  useEffect(() => {
    const throttle = (fn: MouseMoveHandler, delay: number): MouseMoveHandler => {
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

    // Set mounted after a small delay to trigger initial animations
    setTimeout(() => setMounted(true), 100);

    return () => {
      window.removeEventListener('mousemove', throttledHandleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div className="hexagon-grid">
      {[...Array(6)].map((_, i) => (
        <div
          key={`hex-${i}`}
          className={`hexagon ${mounted ? 'mounted' : ''} ${
            activeHexagons.has(`hex-${i}`) ? 'active' : ''
          }`}
          style={{
            animationDelay: `${i * 100}ms`,
            transitionDelay: `${i * 50}ms`
          }}
          data-index={i}
        />
      ))}
    </div>
  );
};

export default HexagonGrid;