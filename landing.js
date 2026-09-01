// Reveals each chapter row as it scrolls into view. Loaded synchronously in
// <head> so the `js-reveal` class lands before first paint — otherwise the rows
// would flash in at full opacity and then be hidden again.
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('js-reveal');

  document.addEventListener('DOMContentLoaded', function () {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );

    document.querySelectorAll('[data-reveal]').forEach(function (node) {
      observer.observe(node);
    });
  });
})();
