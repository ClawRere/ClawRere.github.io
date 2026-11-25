import React, { useEffect, useState, useRef } from 'react';

export const FlyingButterfly: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [position, setPosition] = useState({ top: 120, left: 160, rotate: 25 });
  const [isFlapping, setIsFlapping] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const flyToRandom = () => {
    setIsFlapping(true);
    const padding = 80;
    const maxW = Math.max(window.innerWidth - padding * 2, 300);
    const maxH = Math.max(window.innerHeight - padding * 2, 300);

    const nextLeft = padding + Math.random() * maxW;
    const nextTop = padding + Math.random() * maxH;

    // Calculate angle towards next point
    const dx = nextLeft - position.left;
    const dy = nextTop - position.top;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    setPosition({
      left: nextLeft,
      top: nextTop,
      rotate: angle,
    });

    setTimeout(() => {
      setIsFlapping(false);
    }, 1800);
  };

  useEffect(() => {
    // Check local storage setting
    const saved = localStorage.getItem('show_butterfly');
    if (saved === 'false') {
      setIsEnabled(false);
      return;
    }

    // Auto flutter every 8-15 seconds
    const scheduleNextFlight = () => {
      const delay = 7000 + Math.random() * 8000;
      timerRef.current = setTimeout(() => {
        flyToRandom();
        scheduleNextFlight();
      }, delay);
    };

    scheduleNextFlight();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [position.left, position.top]);

  if (!isEnabled) return null;

  return (
    <div
      onClick={flyToRandom}
      onMouseEnter={flyToRandom}
      title="点击我或悬停，看蝴蝶飞舞！"
      style={{
        position: 'fixed',
        left: `${position.left}px`,
        top: `${position.top}px`,
        transform: `rotate(${position.rotate}deg)`,
        transition: 'left 1.8s cubic-bezier(0.25, 1, 0.5, 1), top 1.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s ease',
        zIndex: 40,
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}
      className="select-none"
    >
      <div className="relative w-12 h-12">
        {/* Left Wing */}
        <div
          style={{
            transformOrigin: 'right center',
            animation: isFlapping ? 'butterflyWing 0.15s ease-in-out infinite alternate' : 'butterflyRest 1.2s ease-in-out infinite alternate',
          }}
          className="absolute left-0 top-1 w-5 h-8 bg-gradient-to-r from-purple-800 via-sky-500 to-cyan-400 rounded-tl-full rounded-bl-3xl shadow-lg opacity-90 border border-black/20"
        />

        {/* Right Wing */}
        <div
          style={{
            transformOrigin: 'left center',
            animation: isFlapping ? 'butterflyWingRight 0.15s ease-in-out infinite alternate' : 'butterflyRestRight 1.2s ease-in-out infinite alternate',
          }}
          className="absolute right-0 top-1 w-5 h-8 bg-gradient-to-l from-purple-800 via-sky-500 to-cyan-400 rounded-tr-full rounded-br-3xl shadow-lg opacity-90 border border-black/20"
        />

        {/* Center Body & Antenna */}
        <div className="absolute left-1/2 top-2 -translate-x-1/2 w-1.5 h-7 bg-charcoal-900 dark:bg-black rounded-full z-10">
          <div className="absolute -top-1.5 -left-1 w-1 h-2 border-l border-t border-black dark:border-white rounded-tl-full" />
          <div className="absolute -top-1.5 -right-1 w-1 h-2 border-r border-t border-black dark:border-white rounded-tr-full" />
        </div>
      </div>

      <style>{`
        @keyframes butterflyWing {
          0% { transform: rotateY(0deg) scaleY(0.9); }
          100% { transform: rotateY(70deg) scaleY(0.9); }
        }
        @keyframes butterflyWingRight {
          0% { transform: rotateY(0deg) scaleY(0.9); }
          100% { transform: rotateY(-70deg) scaleY(0.9); }
        }
        @keyframes butterflyRest {
          0% { transform: rotateY(15deg) scaleY(0.9); }
          100% { transform: rotateY(40deg) scaleY(0.9); }
        }
        @keyframes butterflyRestRight {
          0% { transform: rotateY(-15deg) scaleY(0.9); }
          100% { transform: rotateY(-40deg) scaleY(0.9); }
        }
      `}</style>
    </div>
  );
};
