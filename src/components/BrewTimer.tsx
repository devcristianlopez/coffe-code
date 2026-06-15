import { useEffect, useRef, useState } from 'react';

interface BrewTimerProps {
  timeLeft: number;
  total: number;
  isRunning: boolean;
  isFinished: boolean;
  size?: 'normal' | 'large';
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function BrewTimer({
  timeLeft,
  total,
  isRunning,
  isFinished,
  size = 'normal',
}: BrewTimerProps) {
  const [animating, setAnimating] = useState(false);
  const prevTimeRef = useRef(timeLeft);

  // Subtle scale animation when the displayed second changes
  useEffect(() => {
    const prevSec = Math.floor(prevTimeRef.current);
    const currSec = Math.floor(timeLeft);
    if (prevSec !== currSec && isRunning) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 150);
      return () => clearTimeout(timer);
    }
    prevTimeRef.current = timeLeft;
  }, [timeLeft, isRunning]);

  // Determine colour
  let colorClass = 'text-coffee-primary';
  if (isFinished) {
    colorClass = 'text-green-600';
  } else if (timeLeft > 0 && timeLeft < 10 && isRunning) {
    colorClass = 'text-red-500';
  }

  const scaleClass = animating ? 'scale-[1.05]' : 'scale-100';
  const textSize =
    size === 'large'
      ? 'text-7xl sm:text-8xl'
      : 'text-5xl sm:text-6xl';

  return (
    <div className="flex flex-col items-center select-none">
      <span
        className={`font-mono font-bold tracking-wider tabular-nums transition-transform duration-150 ${colorClass} ${textSize} ${scaleClass}`}
      >
        {formatTime(timeLeft)}
      </span>
      <span className="text-xs text-coffee-muted mt-1 tabular-nums">
        / {formatTime(total)}
      </span>
    </div>
  );
}
