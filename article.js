// Two small reading aids for the long chapter pages: a progress bar across the
// top, and a contents entry that tracks the section currently on screen.
// Both are progressive enhancements — with this file blocked the bar simply
// stays at zero width and every contents link renders in its resting style.
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.querySelector('.progress-bar');
    var links = Array.prototype.slice.call(document.querySelectorAll('.toc a'));

    if (bar) {
      var ticking = false;

      var draw = function () {
        var doc = document.documentElement;
        var scrollable = doc.scrollHeight - doc.clientHeight;
        var ratio = scrollable > 0 ? doc.scrollTop / scrollable : 0;
        bar.style.transform = 'scaleX(' + Math.min(Math.max(ratio, 0), 1) + ')';
        ticking = false;
      };

      var schedule = function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(draw);
      };

      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      draw();
    }

    if (!links.length || !('IntersectionObserver' in window)) return;

    // A section counts as "current" once its heading passes under the nav, so
    // the marker moves in step with what the reader is actually looking at.
    var sections = links
      .map(function (link) {
        var id = link.getAttribute('href');
        return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    var visible = new Set();

    var mark = function () {
      var current = null;
      sections.forEach(function (section) {
        if (visible.has(section)) current = current || section;
      });
      links.forEach(function (link, i) {
        link.classList.toggle('is-current', sections[i] === current);
      });
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        mark();
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  });
})();
