import { Button } from '@/components/button';

/* `site-nav`, `nav-brand` and `nav-cta` carry no styling; they are test hooks.
   See CONTEXT.md's "Test hook" entry for the full list. */

// `leading-[1.55]`, not the `text-sm` pairing: Tailwind's 20px default would
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
        'sticky top-0 z-10 backdrop-blur-[10px]',
        'bg-[color-mix(in_srgb,var(--parchment)_94%,transparent)]',
        // A phone cannot fit brand, links and call to action on one line, and a
        // two-row sticky bar costs more viewport than it is worth.
        // `backdrop-filter: none`, not `backdrop-blur-none`: the latter leaves
        // the property set, which promotes the nav to its own layer and drops
        // its text from subpixel to grayscale antialiasing.
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
      {/* The label has always rendered in ink, not the gilt design-system.css
          intends: `.nav a { color: inherit }` outranks `.btn-primary` there.
          Reproduced deliberately — see ADR 0001. */}
      <Button
        className="nav-cta text-foreground no-underline"
        render={<a href="fundamentals.html#what-is-ml" />}
      >
        Start reading
      </Button>
    </nav>
  );
}
