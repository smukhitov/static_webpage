import type { Chapter } from '@/data/chapters';

/**
 * One chapter: number, text block, and the line drawing that stands for it.
 * The whole row is the link — a reader aiming at the title, the summary or the
 * figure all land in the same place.
 */
export function ChapterRow({ chapter }: { chapter: Chapter }) {
  return (
    <a
      className={[
        'chapter grid items-center border-b border-divider text-foreground no-underline',
        'grid-cols-[56px_minmax(0,1fr)_168px] gap-8 py-8 pr-4',
        'transition-[background] duration-200 hover:bg-gilt/7',
        'max-[760px]:grid-cols-[40px_minmax(0,1fr)] max-[760px]:gap-5',
      ].join(' ')}
      href={chapter.href}
      data-reveal
    >
      <span className="self-start font-heading text-[20px] tabular-nums text-primary">
        {chapter.num}
      </span>

      <div>
        <h3 className="chapter-title text-[30px] leading-9 tracking-[-0.005em] max-[760px]:text-[26px] max-[760px]:leading-8">
          {chapter.title}
        </h3>
        <p className="mt-2 max-w-[46ch] text-[15.5px] leading-7 text-ink-78">{chapter.summary}</p>
        <p className="mt-2.5 text-[13px] leading-[22px] text-primary">{chapter.note}</p>
      </div>

      <svg
        className="justify-self-end text-ink-55 max-[760px]:hidden"
        viewBox="0 0 160 64"
        width="168"
        height="67"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
        focusable="false"
      >
        {chapter.figure}
      </svg>
    </a>
  );
}
