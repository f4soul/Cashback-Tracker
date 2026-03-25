import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Bank, LogoShape } from '../types';

interface BankLogoProps {
  bank: Bank;
  customLogo?: string;
  logoShape: LogoShape;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BankLogo: React.FC<BankLogoProps> = ({ 
  bank, 
  customLogo, 
  logoShape, 
  className,
  size = 'md'
}) => {
  const [error, setError] = useState(false);
  const logoUrl = customLogo || bank.logoUrl;

  const sizeClasses = {
    sm: logoShape === 'rectangle' ? 'w-6 h-8 text-[8px]' : 'w-6 h-6 text-[8px]',
    md: logoShape === 'rectangle' ? 'w-9 h-12 text-xs' : 'w-9 h-9 text-xs',
    lg: logoShape === 'rectangle' ? 'w-10 h-14 text-base' : 'w-10 h-10 text-base',
  };

  const shapeClasses = {
    circle: 'rounded-full aspect-square',
    square: 'rounded-[22%] aspect-square',
    rectangle: 'rounded-[15%]',
    octagon: 'clip-octagon aspect-square'
  };

  if (logoUrl && !error) {
    return (
      <img
        src={logoUrl}
        alt={bank.name}
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
        className={clsx(
          "object-contain shadow-sm transition-all duration-500 shrink-0",
          sizeClasses[size],
          shapeClasses[logoShape],
          className
        )}
        style={{ 
          imageRendering: '-webkit-optimize-contrast',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-center text-white font-bold shadow-sm transition-all duration-500 shrink-0",
        sizeClasses[size],
        shapeClasses[logoShape],
        className
      )}
      style={{ backgroundColor: bank.color }}
    >
      {bank.logoText}
    </div>
  );
};
