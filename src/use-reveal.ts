import { useEffect } from 'react';

/**
 * Reveals each `[data-reveal]` element as it scrolls into view.
 *
 * Whether it runs at all is decided before first paint by index.html, which sets
 * `js-reveal` on <html> only when IntersectionObserver exists and motion is not
 * reduced, and index.css keys the initial hidden state on that same class.
 * Reading the class here rather than re-deciding is what keeps that three-file,
 * three-language coupling in one place: without it every row renders at full
 * opacity and this hook is a no-op.
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
