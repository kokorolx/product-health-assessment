import React, { useState } from 'react';
import Image from 'next/image';

interface MagnifyingGlassProps {
  src: string;
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
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${width}px`}
      />

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
              src={src}
              alt={`${alt} magnified`}
              fill
              className="object-cover"
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