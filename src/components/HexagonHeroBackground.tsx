'use client'

import React, { useRef, useEffect } from 'react';

interface HexagonHeroBackgroundProps {
  imageUrls?: string[];
  info?: { [key: string]: string };
  productDetails?: { [key: string]: { health_score: number; [key: string]: unknown } }; // Use unknown instead of any
}

// --- Copied URL Transformation Logic ---
const transformImageUrl = (url: string, { width, quality }: { width: number, quality: number }) => {
  if (!url) return url;

  try {
    // Format: https://[project-ref].supabase.co/storage/v1/render/image/public/[bucket]/[file-path]
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Check if this is a storage URL
    if (!pathname.includes('/storage/v1/object/public/')) return url;

    // Convert object path to render path
    const newPathname = pathname
      .replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');

    // Construct transform URL
    const transformUrl = `${urlObj.origin}${newPathname}?width=${width}&quality=${quality}`;
    // console.log('Transform URL:', transformUrl); // Keep commented unless debugging URLs
    return transformUrl;

  } catch (error) {
    console.error('Error transforming URL:', error);
    return url;
  }
};

const getLowQualityImageUrl = (url: string) => {
  return transformImageUrl(url, { width: 100, quality: 60 });
};

const getHighQualityImageUrl = (url: string) => {
  return transformImageUrl(url, { width: 1200, quality: 100 });
};
// --- End Copied Logic ---

class Hexagon {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number;
  radius: number;
  originalImageUrl: string | null = null; // Store original URL
  imageLQ: HTMLImageElement | null = null; // Low Quality Image
  imageHQ: HTMLImageElement | null = null; // High Quality Image
  imageLQLoaded: boolean = false;
  imageHQLoaded: boolean = false;
  imageHQLoading: boolean = false; // Flag to prevent multiple load attempts
  isHovered: boolean = false;
  scale: number = 1;
  score: number | null = null;

  constructor(x: number, y: number, vx: number, vy: number, z: number, radius: number, originalUrl?: string, score?: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.z = z;
    this.radius = radius;
    this.score = score ?? null;
    this.originalImageUrl = originalUrl || null;

    if (originalUrl) {
      const lqUrl = getLowQualityImageUrl(originalUrl);
      const imgLQ = new Image();
      imgLQ.onload = () => {
        this.imageLQ = imgLQ;
        this.imageLQLoaded = true;
        // console.log('LQ Image Loaded:', lqUrl); // Debug log
      };
      imgLQ.onerror = () => {
        console.error('Error loading LQ image:', lqUrl);
      };
      imgLQ.src = lqUrl;
    }
  }

  loadHighQualityImage() {
    if (!this.originalImageUrl || this.imageHQLoaded || this.imageHQLoading) {
      return; // Already loaded, loading, or no URL
    }

    this.imageHQLoading = true;
    const hqUrl = getHighQualityImageUrl(this.originalImageUrl);
    // console.log('Starting HQ Image Load:', hqUrl); // Debug log
    const imgHQ = new Image();
    imgHQ.onload = () => {
      this.imageHQ = imgHQ;
      this.imageHQLoaded = true;
      this.imageHQLoading = false;
      // console.log('HQ Image Loaded:', hqUrl); // Debug log
    };
    imgHQ.onerror = () => {
      console.error('Error loading HQ image:', hqUrl);
      this.imageHQLoading = false; // Allow retry maybe? Or just mark as failed?
    };
    imgHQ.src = hqUrl;
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

    // Determine which image to draw
    let imageToDraw: HTMLImageElement | null = null;
    if (this.isHovered && this.imageHQLoaded && this.imageHQ) {
      imageToDraw = this.imageHQ;
    } else if (this.imageLQLoaded && this.imageLQ) {
      imageToDraw = this.imageLQ;
    }

    if (imageToDraw) {
      context.save();
      context.clip(); // Clip to hexagon shape
      try {
        const aspectRatio = imageToDraw.width / imageToDraw.height;
        let drawWidth = scaledRadius * 2;
        let drawHeight = drawWidth / aspectRatio;

        // Ensure the image covers the hexagon area
        if (drawHeight < scaledRadius * 2) {
          drawHeight = scaledRadius * 2;
          drawWidth = drawHeight * aspectRatio;
        }

        context.drawImage(
          imageToDraw,
          this.x - drawWidth / 2,
          this.y - drawHeight / 2,
          drawWidth,
          drawHeight
        );
      } catch (e) {
        console.error("Error drawing image:", e);
        // Fallback fill if drawing fails
        context.fillStyle = `rgba(0, 180, 180, ${0.2 + this.z * 0.4})`;
        context.fill();
      }
      context.restore(); // Restore context after clipping
    } else {
      // Fallback fill if no image is loaded/available
      context.fillStyle = `rgba(0, 180, 180, ${0.2 + this.z * 0.4})`;
      context.fill();
    }

    // Draw border based on score if hovered
    if (this.isHovered) {
      let borderColor = '#ffffff'; // Default border color
      if (this.score !== null) {
        if (this.score >= 80) {
          borderColor = '#00ff00'; // Green
        } else if (this.score >= 40) {
          borderColor = '#ffff00'; // Yellow
        } else {
          borderColor = '#ff0000'; // Red
        }
      }
      context.strokeStyle = borderColor;
      context.lineWidth = 4; // Set border width to 4px
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

const HexagonHeroBackground: React.FC<HexagonHeroBackgroundProps> = ({ imageUrls = [], info = {}, productDetails = {} }) => { // Accept productDetails prop
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
        const score = imageUrl ? productDetails[imageUrl]?.health_score : undefined; // Get health_score from productDetails
        hexagons.push(new Hexagon(x, y, vx, vy, z, baseRadius * z, imageUrl, score)); // Pass score to constructor
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
            hex.loadHighQualityImage(); // Trigger HQ image load on hover

            // Update Tooltip Logic
            if (tooltipRef.current && hex.originalImageUrl) {
              const information = info[hex.originalImageUrl] || '';
              // Use LQ image for tooltip for consistency and faster display
              const imageToShowInTooltip = hex.imageLQ;
              const imageUrlForTooltip = hex.originalImageUrl ? getLowQualityImageUrl(hex.originalImageUrl) : ''; // Use LQ URL for src

              if (information || imageToShowInTooltip) {
                tooltipRef.current.innerHTML = `
                  <div class="p-4">
                    ${imageToShowInTooltip ? `
                      <div class="mb-2">
                        <div style="width: ${popupImageSize}px;
                                    height: ${popupImageSize}px;
                                    position: relative;
                                    margin: 0 auto;">
                          <div style="width: 100%;
                                     height: 100%;
                                     clip-path: polygon(50% 2%, 98% 26%, 98% 74%, 50% 98%, 2% 74%, 2% 26%);
                                     background: rgba(0, 180, 180, 0.6);">
                          </div>
                          <div style="width: 100%;
                                     height: 100%;
                                     position: absolute;
                                     top: 0;
                                     left: 0;
                                     clip-path: polygon(50% 2%, 98% 26%, 98% 74%, 50% 98%, 2% 74%, 2% 26%);
                                     background-image: url('${imageUrlForTooltip}');
                                     background-size: cover;
                                     background-position: center;">
                          </div>
                        </div>
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
  }, [imageUrls, info, productDetails]); // Update dependency array

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full hexagon-background"
      />
      {/* Tooltip Element */}
      <div
        ref={tooltipRef}
        className="absolute z-50 hidden pointer-events-none"
        style={{
          transition: 'opacity 0.2s ease-in-out',
          // Apply clip-path directly to the container.
          // The background color is set on the inner div via innerHTML,
          // so the clip-path should work correctly.
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          // We might need to adjust padding/size later if content gets cut off.
        }}
      >
        {/* Content is set dynamically via innerHTML */}
      </div>
    </>
  );
};

export default HexagonHeroBackground;
