'use client'

import React, { useRef, useEffect } from 'react';

interface HexagonHeroBackgroundProps {
  imageUrls?: string[];
  info?: { [key: string]: string };
}

class Hexagon {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number;
  radius: number;
  image: HTMLImageElement | null = null;
  imageUrl: string | null = null;
  imageLoaded: boolean = false;
  isHovered: boolean = false;
  scale: number = 1;

  constructor(x: number, y: number, vx: number, vy: number, z: number, radius: number, imageUrl?: string) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.z = z;
    this.radius = radius;

    if (imageUrl) {
      this.imageUrl = imageUrl;
      const img = new Image();
      img.onload = () => {
        this.image = img;
        this.imageLoaded = true;
      };
      img.src = imageUrl;
    }
  }

  isPointInside(px: number, py: number): boolean {
    const dx = px - this.x;
    const dy = py - this.y;
    if (dx * dx + dy * dy > this.radius * this.radius * this.scale * this.scale) return false;

    const angleStep = (Math.PI * 2) / 6;
    const scaledRadius = this.radius * this.scale;
    let inside = false;

    for (let i = 0; i < 6; i++) {
      const j = (i + 1) % 6;
      const xi = this.x + Math.cos(i * angleStep) * scaledRadius;
      const yi = this.y + Math.sin(i * angleStep) * scaledRadius;
      const xj = this.x + Math.cos(j * angleStep) * scaledRadius;
      const yj = this.y + Math.sin(j * angleStep) * scaledRadius;

      if (((yi > py) !== (yj > py)) &&
          (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  }

  draw(context: CanvasRenderingContext2D) {
    const scaledRadius = this.radius * (this.isHovered ? 2 : this.scale);
    const angleStep = (Math.PI * 2) / 6;

    context.save();
    context.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = i * angleStep;
      const px = this.x + Math.cos(angle) * scaledRadius;
      const py = this.y + Math.sin(angle) * scaledRadius;
      if (i === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
    context.closePath();

    if (this.image && this.imageLoaded) {
      context.save();
      context.clip();
      try {
        const aspectRatio = this.image.width / this.image.height;
        let drawWidth = scaledRadius * 2;
        let drawHeight = drawWidth / aspectRatio;

        if (drawHeight < scaledRadius * 2) {
          drawHeight = scaledRadius * 2;
          drawWidth = drawHeight * aspectRatio;
        }

        context.drawImage(
          this.image,
          this.x - drawWidth / 2,
          this.y - drawHeight / 2,
          drawWidth,
          drawHeight
        );
      } catch (e) {
        console.error("Error drawing image:", e);
        context.fillStyle = `rgba(0, 180, 180, ${0.2 + this.z * 0.4})`;
        context.fill();
      }
      context.restore();
    } else {
      context.fillStyle = `rgba(0, 180, 180, ${0.2 + this.z * 0.4})`;
      context.fill();
    }

    if (this.isHovered) {
      context.strokeStyle = '#ffffff';
      context.lineWidth = 2;
      context.stroke();
    }

    context.restore();
  }

  update(context: CanvasRenderingContext2D, allHexagons: Hexagon[], canvasWidth: number, canvasHeight: number) {
    if (!this.isHovered) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x - this.radius < 0 || this.x + this.radius > canvasWidth) this.vx *= -1;
      if (this.y - this.radius < 0 || this.y + this.radius > canvasHeight) this.vy *= -1;
    }

    const targetScale = this.isHovered ? 1.5 : 1;
    this.scale += (targetScale - this.scale) * 0.1;

    this.draw(context);
  }
}

const HexagonHeroBackground: React.FC<HexagonHeroBackgroundProps> = ({ imageUrls = [], info = {} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredHexagon = useRef<Hexagon | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const popupImageSize = 300;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const hexagons: Hexagon[] = [];
    const count = Math.min(30, imageUrls.length || 30);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initHexagons = () => {
      hexagons.length = 0;
      const baseRadius = window.innerWidth > 1024 ? 60 : 40;

      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;
        const z = Math.random() * 0.5 + 0.5;
        const imageUrl = imageUrls[i];
        hexagons.push(new Hexagon(x, y, vx, vy, z, baseRadius * z, imageUrl));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hexagons.forEach(hex => hex.update(ctx, hexagons, canvas.width, canvas.height));
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * (canvas.width / rect.width);
      const y = (event.clientY - rect.top) * (canvas.height / rect.height);

      let found = false;
      for (const hex of hexagons) {
        if (hex.isPointInside(x, y)) {
          if (hoveredHexagon.current !== hex) {
            if (hoveredHexagon.current) {
              hoveredHexagon.current.isHovered = false;
            }
            hex.isHovered = true;
            hoveredHexagon.current = hex;

            if (tooltipRef.current && hex.imageUrl) {
              const information = info[hex.imageUrl] || '';
              if (information || hex.image) {
                tooltipRef.current.innerHTML = `
                  <div class="p-4">
                    ${hex.image ? `
                      <div class="mb-4">
                        <img src="${hex.imageUrl}"
                             alt="Product"
                             style="width: ${popupImageSize}px;
                                    height: ${popupImageSize}px;
                                    object-fit: contain;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
                        />
                      </div>
                    ` : ''}
                    ${information ? `<div class="text-sm leading-relaxed">${information}</div>` : ''}
                  </div>
                `;

                let left = event.clientX + 20;
                let top = event.clientY - tooltipRef.current.offsetHeight / 2;

                if (left + popupImageSize + 32 > window.innerWidth) {
                  left = event.clientX - popupImageSize - 52;
                }

                if (top + tooltipRef.current.offsetHeight > window.innerHeight) {
                  top = window.innerHeight - tooltipRef.current.offsetHeight - 20;
                } else if (top < 20) {
                  top = 20;
                }

                tooltipRef.current.style.left = `${left}px`;
                tooltipRef.current.style.top = `${top}px`;
                tooltipRef.current.style.display = 'block';
              }
            }
          }
          found = true;
          break;
        }
      }

      if (!found && hoveredHexagon.current) {
        hoveredHexagon.current.isHovered = false;
        hoveredHexagon.current = null;
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
      }
    };

    resizeCanvas();
    initHexagons();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initHexagons();
    });
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [imageUrls, info]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full hexagon-background"
        style={{ zIndex: -1 }}
      />
      <div
        ref={tooltipRef}
        className="fixed hidden bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-xl max-w-lg transition-all duration-200 ease-in-out"
        style={{
          zIndex: 1000,
          pointerEvents: 'none',
          width: `${popupImageSize + 32}px`,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        }}
      />
    </>
  );
};

export default HexagonHeroBackground;