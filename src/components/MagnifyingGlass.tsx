import React, { useState } from 'react';
import Image from 'next/image';

interface MagnifyingGlassProps {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  magnification?: number;
}

const MagnifyingGlass: React.FC<MagnifyingGlassProps> = ({
  src,
  alt,
  width,
  height,
  magnification = 2,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width: elementWidth, height: elementHeight } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / elementWidth) * 100;
    const y = ((e.clientY - top) / elementHeight) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className="relative overflow-hidden isolate"
      style={{ width, height, contain: 'paint' }}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Original Image */}
      <Image
        src={src || '/something-went-wrong.png'}
        alt={src ? alt : 'Product not available'}
        fill
        className={`object-cover ${!src ? 'opacity-70' : ''}`}
        sizes={`${width}px`}
      />
      {!src && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-600 text-sm font-medium bg-white/80 px-3 py-1 rounded-md">
            Product not available
          </p>
        </div>
      )}

      {/* Magnified View */}
      {showMagnifier && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            width: '150px',
            height: '150px',
            border: '2px solid #ffffff',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            transform: 'translate(-50%, -50%)',
            left: `${position.x}%`,
            top: `${position.y}%`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${width * magnification}px`,
              height: `${height * magnification}px`,
              transform: `translate(${-position.x * (width * magnification / 100)}px, ${-position.y * (height * magnification / 100)}px)`,
            }}
            className="absolute"
          >
            <Image
              src={src || '/something-went-wrong.png'}
              alt={src ? `${alt} magnified` : 'Product not available - magnified'}
              fill
              className={`object-cover ${!src ? 'opacity-70' : ''}`}
              sizes={`${width * magnification}px`}
              quality={90}
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MagnifyingGlass;