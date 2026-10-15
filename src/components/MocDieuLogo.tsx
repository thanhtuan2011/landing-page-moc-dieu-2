import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

export const MocDieuLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  light = false,
}) => {
  const sizeMap = {
    sm: { img: 'h-8 w-auto', text: 'text-base' },
    md: { img: 'h-10 w-auto', text: 'text-xl' },
    lg: { img: 'h-14 w-auto', text: 'text-2xl md:text-3xl' },
  };

  const textColor = light ? 'text-white' : 'text-[#2F5D7E]';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Mộc Điều Brand Logo Image */}
      <img
        src="/logo.png"
        alt="Logo Mộc Điều"
        className={`${sizeMap[size].img} object-contain rounded-md transition-transform hover:scale-105 duration-200 ${
          light ? 'brightness-110 contrast-105 bg-white/95 p-0.5' : ''
        }`}
        referrerPolicy="no-referrer"
      />

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold tracking-wider ${sizeMap[size].text} ${textColor} uppercase font-sans`}>
            Mộc Điều
          </span>
          <span className={`text-[10px] tracking-widest uppercase ${light ? 'text-amber-100/90' : 'text-[#8A5A3B]'} font-semibold mt-0.5`}>
            Mộc vị tự nhiên
          </span>
        </div>
      )}
    </div>
  );
};
