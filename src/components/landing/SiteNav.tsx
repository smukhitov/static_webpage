import { Button } from '@/components/ui/button';

/* The nav row keeps its `site-nav` / `nav-brand` / `nav-cta` class names. They
   carry no styling any more — Tailwind does that — but they are the hooks the
   Playwright suite and the two static article pages already address, so the
   port stays invisible from the outside. */

// `leading-[1.55]` rather than the `text-sm` pairing: the links inherit the
// body's line height in the design system, and Tailwind's 20px default would
// shrink the line box and lift the two rows by ~1px once the nav wraps.
const LINK =
  'text-[14px] leading-[1.55] text-inherit no-underline hover:text-primary focus-visible:text-primary';

export function SiteNav() {
  return (
    <nav
      aria-label="Primary"
      className={[
        'site-nav flex flex-wrap items-center gap-4 border-b border-divider',
        'py-3',
        // Keeps the nav row aligned with the content column.
        'px-[max(var(--page-gutter),calc((100%-var(--page-width))/2+var(--page-gutter)))]',
        // The chapters run long; the nav stays reachable the whole way down.
        'sticky top-0 z-10 backdrop-blur-[10px]',
        'bg-[color-mix(in_srgb,var(--parchment)_94%,transparent)]',
        // A phone cannot fit brand, links and call to action on one line, and a
        // two-row sticky bar costs more viewport than it is worth. Below this
        // width it scrolls away with the rest of the page.
        // `backdrop-filter: none`, not `backdrop-blur-none`: the latter zeroes
        // the blur but leaves the property set, which is enough to promote the
        // nav to its own layer and drop the text from subpixel to grayscale
        // antialiasing.
        'max-[760px]:static max-[760px]:[backdrop-filter:none]',
        'max-[760px]:gap-x-3 max-[760px]:gap-y-2 max-[760px]:py-2',
      ].join(' ')}
    >
      <span className="nav-brand mr-auto font-heading text-[18px] font-semibold max-[760px]:text-[16px]">
        Machine Learning Fundamentals
      </span>
      <a className={LINK} href="#part-foundations">
        Foundations
      </a>
      <a className={LINK} href="#part-modern">
        Modern AI
      </a>
      {/* `text-foreground` reproduces what the site actually shipped, not what
          design-system.css meant to say. There, `.btn-primary` sets the label
          to gilt-700, but `.nav a { color: inherit }` outranks it on
          specificity, so the label has always rendered in ink. Keeping the ink
          here holds the port pixel-identical; whether to let the gilt through
          is a design decision, not a migration one. */}
      <Button
        variant="classical"
        size="classical"
        className="nav-cta shrink-0 whitespace-nowrap text-foreground no-underline"
        render={<a href="fundamentals.html#what-is-ml" />}
      >
        Start reading
      </Button>
    </nav>
  );
}
