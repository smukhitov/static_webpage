import { Hero } from '@/components/landing/Hero';
import { PartSection } from '@/components/landing/PartSection';
import { SiteNav } from '@/components/landing/SiteNav';
import { PARTS } from '@/data/chapters';
import { useRevealOnScroll } from '@/hooks/use-reveal';

export default function App() {
  useRevealOnScroll();

  return (
    <>
      <SiteNav />

      <div className="mx-auto max-w-[var(--page-width)] px-[var(--page-gutter)]">
        <main>
          <Hero />

          <hr className="m-0 h-px border-0 bg-divider" />

          <div id="chapters">
            {PARTS.map((part) => (
              <PartSection key={part.id} part={part} />
            ))}
          </div>
        </main>

        <footer className="site-footer flex flex-wrap justify-between gap-6 py-12 text-[13px] leading-7 text-ink-70">
          <span>Machine Learning Fundamentals</span>
          <span>A learning exercise in the end-to-end software development lifecycle.</span>
        </footer>
      </div>
    </>
  );
}
