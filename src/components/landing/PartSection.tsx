import { ChapterRow } from '@/components/landing/ChapterRow';
import type { Part } from '@/data/chapters';

export function PartSection({ part }: { part: Part }) {
  const titleId = `${part.id}-title`;

  return (
    <section
      id={part.id}
      aria-labelledby={titleId}
      className="part scroll-mt-[calc(var(--nav-height)+16px)] pt-[72px] max-[760px]:pt-14"
    >
      <header className="max-w-[60ch] pb-2" data-reveal>
        <p className="mb-3 font-heading text-[13px] font-semibold tracking-[0.12em] uppercase text-primary">
          {part.eyebrow}
        </p>
        <h2 id={titleId} className="mb-4 text-[clamp(32px,4.4vw,46px)] leading-[1.1]">
          {part.title}
        </h2>
        <p className="text-base leading-7 text-ink-78">{part.lede}</p>
      </header>

      <div className="pt-10 max-[760px]:pt-6">
        {part.chapters.map((chapter) => (
          <ChapterRow key={chapter.href} chapter={chapter} />
        ))}
      </div>
    </section>
  );
}
