import { useState, useEffect, useRef } from 'react';

export function useIntersectionObserver(options = {}, keepObserving = false) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px' } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (!keepObserving) observer.unobserve(el);
      } else if (keepObserving) {
        setIsVisible(false);
      }
    }, { threshold, rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, keepObserving]);

  return [ref, isVisible];
}
