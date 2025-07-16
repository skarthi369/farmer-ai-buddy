import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({ children, className = "", onClick }) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={`ripple-container ${className}`} onClick={createRipple}>
      {children}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </div>
  );
};

interface FloatingCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({ children, delay = 0, className = "" }) => {
  return (
    <Card 
      className={`animate-bounce-in hover:animate-float interactive-card glass-effect ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </Card>
  );
};

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 100, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={`${className} ${currentIndex < text.length ? 'animate-typewriter' : ''}`}>
      {displayText}
    </span>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = "" }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`${sizeClasses[size]} ${className} animate-spin`}>
      <div className="w-full h-full border-2 border-primary border-t-transparent rounded-full animate-pulse-glow"></div>
    </div>
  );
};

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ 
  value, 
  duration = 2000, 
  className = "",
  suffix = "",
  prefix = ""
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCurrentValue(Math.floor(easeOut * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{currentValue}{suffix}
    </span>
  );
};

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  glowColor?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({ 
  children, 
  onClick, 
  className = "", 
  glowColor = "primary" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group px-6 py-3 rounded-lg font-medium
        bg-gradient-primary text-primary-foreground
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-glow
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 rounded-lg bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
    </button>
  );
};

export const ParticleBackground: React.FC<{ particleCount?: number }> = ({ particleCount = 50 }) => {
  return (
    <div className="particles-container">
      {[...Array(particleCount)].map((_, i) => (
        <div
          key={i}
          className={`particle particle-${(i % 3) + 1}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 6}s`
          }}
        />
      ))}
    </div>
  );
};