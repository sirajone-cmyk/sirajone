import { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

export function useCountUp(target, duration = 1800, suffix = '') {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isVisible || hasStarted.current) return;
    hasStarted.current = true;
    const start = performance.now();
    const numTarget = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    const isFloat = String(target).includes('.');
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(isFloat ? parseFloat((eased * numTarget).toFixed(1)) : Math.round(eased * numTarget));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return [ref, `${count}${suffix}`];
}
