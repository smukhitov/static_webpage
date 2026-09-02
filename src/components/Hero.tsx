export function Hero() {
  return (
    <section className="hero pt-28 pb-[84px] max-[760px]:pt-[72px] max-[760px]:pb-14">
      {/* The negative margin is optical alignment: it pulls the first glyph
          flush with the left edge of the content column. */}
      <h1 className="-ml-[0.042em] font-heading text-[clamp(44px,6.2vw,84px)] leading-[1.08] font-normal tracking-[-0.01em]">
        <span className="block">Machine learning,</span>
        <span className="block">explained from the beginning.</span>
      </h1>

      <p className="mt-10 max-w-[54ch] text-[17px] leading-7 text-ink-82 max-[760px]:mt-7">
        Fifteen short chapters that start with what a model actually is and end with systems that
        use tools to get work done. No prerequisites beyond curiosity, no equations you have to
        solve — and a diagram for every idea that deserves one.
      </p>

      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2.5 text-[13px] leading-[22px] text-ink-70">
        <span>
          <strong className="font-heading text-sm font-semibold text-foreground">2 parts</strong> ·
          15 chapters
        </span>
        <span>
          <strong className="font-heading text-sm font-semibold text-foreground">18 diagrams</strong>
          , drawn to explain
        </span>
        <span>
          About{' '}
          <strong className="font-heading text-sm font-semibold text-foreground">30 minutes</strong>{' '}
          end to end
        </span>
      </div>
    </section>
  );
}
