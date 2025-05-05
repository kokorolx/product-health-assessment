import { useState, useEffect, useCallback } from 'react';
import { getInitialProducts } from '@/lib/data';
import { Product } from '@/types';

type MouseMoveHandler = (e: MouseEvent) => void;

const HexagonGrid: React.FC = () => {
  const [activeHexagons, setActiveHexagons] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [autoMoveEnabled, setAutoMoveEnabled] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await getInitialProducts();
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Auto-movement effect
  useEffect(() => {
    if (!autoMoveEnabled) return;

    const moveHexagons = () => {
      const hexagons = document.querySelectorAll('.hexagon');
      hexagons.forEach((hexagon, index) => {
        const hexElement = hexagon as HTMLElement;
        const time = Date.now() / 2000; // Slower movement
        const offset = index * (Math.PI / 12); // Offset based on index

        // Circular movement pattern
        const moveX = Math.cos(time + offset) * 15;
        const moveY = Math.sin(time + offset) * 15;
        const rotateZ = Math.sin(time + offset) * 10;

        hexElement.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotateZ}deg)`;
      });
    };

    const animationFrame = requestAnimationFrame(function animate() {
      moveHexagons();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [autoMoveEnabled]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (autoMoveEnabled) {
      setAutoMoveEnabled(false);
    }
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
      const hexElement = hexagon as HTMLElement;
      if (distance < activationRadius) {
        // Calculate movement and intensity
        const intensity = Math.pow(1 - (distance / activationRadius), 1.5);
        const angle = Math.atan2(y - hexCenterY, x - hexCenterX);
        const moveX = Math.cos(angle) * (20 * intensity); // Max 20px movement
        const moveY = Math.sin(angle) * (20 * intensity);
        const rotateZ = (Math.cos(angle) * 15 * intensity); // Max 15deg rotation

        newActiveHexagons.add(`hex-${index}`);
        hexElement.style.setProperty('--activation-intensity', intensity.toString());
        hexElement.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotateZ}deg)`;
      } else {
        // Reset to original position with smooth transition
        hexElement.style.transform = 'translate(0, 0) rotate(0deg)';
      }
    });

    setActiveHexagons(newActiveHexagons);
  }, [autoMoveEnabled]);

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
      {[...Array(24)].map((_, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const isEvenRow = row % 2 === 0;
        const product = products[i % products.length];

        return (
          <div
            key={`hex-${i}`}
            className={`hexagon ${mounted ? 'mounted' : ''} ${
              activeHexagons.has(`hex-${i}`) ? 'active' : ''
            }`}
            style={{
              animationDelay: `${i * 50}ms`,
              transitionDelay: `${i * 25}ms`,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              gridRow: row + 1,
              gridColumn: col + 1,
              transform: isEvenRow ? 'translateX(50%)' : undefined,
              backgroundImage: product ? `url(${product.image_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            data-index={i}
          >
            {product && (
              <div className="hexagon-content">
                <div className="product-info">
                  <span className="product-score">{product.health_score}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HexagonGrid;
