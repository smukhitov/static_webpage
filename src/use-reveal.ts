import { useEffect } from 'react';

/**
 * Reveals each `[data-reveal]` element as it scrolls into view.
 *
 * Whether the effect runs at all is decided before first paint by the inline
 * script in index.html, which puts `js-reveal` on <html> only when the browser
 * has IntersectionObserver and motion is not reduced. Reading that class here
 * keeps the decision in one place: under reduced motion, or in a browser without
 * IntersectionObserver, every row renders at full opacity and this hook is a
 * no-op.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    if (!document.documentElement.classList.contains('js-reveal')) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    for (const node of document.querySelectorAll('[data-reveal]')) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, []);
}
