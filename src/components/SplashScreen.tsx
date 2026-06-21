import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading out slightly before the 3 second mark to create a smooth transition
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2500);

    // Complete the splash screen after exactly 3 seconds
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center select-none">
        <h1 className="text-6xl font-extrabold tracking-wider text-white mb-2 animate-pulse-slow">
          BAIVO
        </h1>
        <p className="text-sm font-medium text-gray-400 tracking-wide">
          Your world. Your reels.
        </p>
      </div>
    </div>
  );
};
