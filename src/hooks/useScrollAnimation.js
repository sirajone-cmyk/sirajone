import { useEffect } from 'react';

export function useScrollAnimation(
  selector = '.fade-up, .fade-in',
  visibleClass = 'visible',
  options = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
          observer.unobserve(entry.target);
        }
      });
    }, options);
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, visibleClass]);
}
