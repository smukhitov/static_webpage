import type { ReactNode } from 'react';

/**
 * The order here is the order the rows appear in, and every `href` has to
 * resolve to a section that exists on the article page it names.
 */
export type Chapter = {
  num: string;
  title: string;
  summary: string;
  note: string;
  href: string;
  figure: ReactNode;
};

export type Part = {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
  chapters: Chapter[];
};

/* The figures are line drawings on a 160×64 grid, inheriting the row's muted
   ink. `stroke-gilt` / `fill-gilt/14` pick out what each diagram is about, as
   utility classes rather than tokens, because `var()` is not resolved inside
   SVG presentation attributes. */

export const PARTS: Part[] = [
  {
    id: 'part-foundations',
    eyebrow: 'Part I',
    title: 'Foundations',
    lede: 'The ideas everything else is built on: what a model is, how learning actually works as a mechanism, and the whole apparatus of not fooling yourself about how good a model is.',
    chapters: [
      {
        num: '01',
        title: 'What Is Machine Learning?',
        summary:
          'Software that improves at a task by learning from examples, rather than following rules a programmer wrote by hand. The result is a model: a function, fitted to data.',
        note: 'A spam filter learns from mail you already sorted — nobody writes the rule for "looks like spam".',
        href: 'fundamentals.html#what-is-ml',
        figure: (
          <>
            <rect x="2" y="20" width="36" height="24" rx="2" />
            <path d="M42 32 H58" />
            <path d="M54 28 L58 32 L54 36" />
            <rect className="stroke-gilt" x="62" y="20" width="36" height="24" rx="2" />
            <path d="M102 32 H118" />
            <path d="M114 28 L118 32 L114 36" />
            <rect x="122" y="20" width="36" height="24" rx="2" />
          </>
        ),
      },
      {
        num: '02',
        title: 'Supervised, Unsupervised, Reinforcement',
        summary:
          'Three ways to learn: from labeled answers, from structure found in unlabeled data, or from reward and penalty inside an environment.',
        note: 'A fourth — self-supervised — is why language models can be trained on the open internet.',
        href: 'fundamentals.html#learning-types',
        figure: (
          <>
            <rect x="4" y="22" width="7" height="7" />
            <rect x="15" y="22" width="7" height="7" />
            <rect x="26" y="22" width="7" height="7" />
            <rect x="4" y="33" width="7" height="7" />
            <rect x="15" y="33" width="7" height="7" />
            <rect x="26" y="33" width="7" height="7" />
            <circle cx="62" cy="26" r="2.5" />
            <circle cx="72" cy="20" r="2.5" />
            <circle cx="68" cy="34" r="2.5" />
            <circle cx="86" cy="40" r="2.5" />
            <circle cx="94" cy="30" r="2.5" />
            <circle cx="82" cy="28" r="2.5" />
            <ellipse className="stroke-gilt" cx="68" cy="27" rx="13" ry="11" strokeDasharray="3 3" />
            <path d="M134 18 A14 14 0 1 1 122 25" />
            <path d="M118 20 L122 25 L127 22" />
          </>
        ),
      },
      {
        num: '03',
        title: 'How a Model Actually Learns',
        summary:
          'Loss, gradients and gradient descent — the three-part mechanism that turns "learning" from a metaphor into arithmetic you could do by hand.',
        note: 'The same loop trains a three-parameter line and a three-hundred-billion-parameter model.',
        href: 'fundamentals.html#how-models-learn',
        figure: (
          <>
            <path d="M8 56 H152" />
            <path d="M14 12 Q80 78 146 12" />
            <circle cx="34" cy="29" r="3" />
            <circle cx="54" cy="40" r="3" />
            <circle className="stroke-gilt" cx="80" cy="45" r="3.5" />
          </>
        ),
      },
      {
        num: '04',
        title: 'The Train/Test Split',
        summary:
          'Most of the data fits the model; a held-out portion is kept back to measure how it does on examples it never saw during training.',
        note: '80/20 is the common split, but the right ratio depends on how much data you have.',
        href: 'fundamentals.html#train-test-split',
        figure: (
          <>
            <rect className="stroke-gilt" x="2" y="20" width="156" height="24" rx="2" />
            <rect
              className="fill-gilt/14"
              x="2"
              y="20"
              width="124.8"
              height="24"
              rx="2"
              stroke="none"
            />
            <path className="stroke-gilt" d="M126.8 20 V44" />
            <path d="M2 52 H126.8" />
            <path d="M130.8 52 H158" />
          </>
        ),
      },
      {
        num: '05',
        title: 'Overfitting',
        summary:
          'A model can learn the training data too well, noise and quirks included, and then fail on anything new. It memorized specifics instead of the pattern underneath.',
        note: 'The tell: training accuracy keeps climbing while test accuracy turns and drops.',
        href: 'fundamentals.html#overfitting',
        figure: (
          <>
            <path d="M8 6 V54 H156" />
            <path d="M12 16 C52 40 92 50 152 53" />
            <path className="stroke-gilt" d="M12 22 C48 46 78 50 152 12" />
          </>
        ),
      },
      {
        num: '06',
        title: 'Measuring a Model Honestly',
        summary:
          'Accuracy hides the difference between a false alarm and a miss. Precision, recall and the confusion matrix put that difference back where you can see it.',
        note: 'A fraud detector that always answers "no" scores 99.9% and is worth nothing.',
        href: 'fundamentals.html#evaluation',
        figure: (
          <>
            <rect className="fill-gilt/14" x="56" y="14" width="24" height="24" stroke="none" />
            <rect className="fill-gilt/14" x="80" y="38" width="24" height="24" stroke="none" />
            <rect x="56" y="14" width="24" height="24" />
            <rect x="80" y="14" width="24" height="24" />
            <rect x="56" y="38" width="24" height="24" />
            <rect x="80" y="38" width="24" height="24" />
            <path d="M40 26 H50 M40 50 H50" />
          </>
        ),
      },
      {
        num: '07',
        title: 'Common Algorithms',
        summary:
          'Linear and logistic regression, decision trees, boosted forests, k-means and neural networks — the handful that show up in every introduction, a paragraph each.',
        note: 'On ordinary tabular data, boosted trees still beat neural networks more often than not.',
        href: 'fundamentals.html#common-algorithms',
        figure: (
          <>
            <path d="M80 14 L50 32 M80 14 L110 32 M50 36 L34 52 M50 36 L66 52 M110 36 L94 52 M110 36 L126 52" />
            <circle className="stroke-gilt" cx="80" cy="10" r="5" />
            <circle cx="50" cy="34" r="5" />
            <circle cx="110" cy="34" r="5" />
            <rect x="30" y="52" width="8" height="8" />
            <rect x="62" y="52" width="8" height="8" />
            <rect x="90" y="52" width="8" height="8" />
            <rect x="122" y="52" width="8" height="8" />
          </>
        ),
      },
    ],
  },
  {
    id: 'part-modern',
    eyebrow: 'Part II',
    title: 'Transformers, LLMs and Agents',
    lede: 'One architecture underlies nearly everything called AI today. These chapters follow the chain end to end: how text becomes numbers, what a transformer does with them, how a language model is trained and run, and what has to be built around it before it can act.',
    chapters: [
      {
        num: '08',
        title: 'Neural Networks and Deep Learning',
        summary:
          'Layers of trivially simple units, separated by a non-linearity, trained by pushing error backwards through the stack. Depth is what lets later layers build on what earlier ones found.',
        note: 'Remove the non-linearity and a hundred layers collapse into the expressive power of one.',
        href: 'modern-ai.html#neural-networks',
        figure: (
          <>
            <path d="M34 18L80 18M34 18L80 32M34 18L80 46M34 32L80 18M34 32L80 32M34 32L80 46M34 46L80 18M34 46L80 32M34 46L80 46M80 18L126 25M80 18L126 39M80 32L126 25M80 32L126 39M80 46L126 25M80 46L126 39" />
            <circle cx="34" cy="18" r="4" />
            <circle cx="34" cy="32" r="4" />
            <circle cx="34" cy="46" r="4" />
            <circle className="stroke-gilt" cx="80" cy="18" r="4" />
            <circle className="stroke-gilt" cx="80" cy="32" r="4" />
            <circle className="stroke-gilt" cx="80" cy="46" r="4" />
            <circle cx="126" cy="25" r="4" />
            <circle cx="126" cy="39" r="4" />
          </>
        ),
      },
      {
        num: '09',
        title: 'Tokens and Embeddings',
        summary:
          'A model never sees text. Words are chopped into sub-word tokens, each token becomes a learned vector, and nearness in that space stands in for similarity of meaning.',
        note: "It's also why models are bad at counting letters — they never saw the letters.",
        href: 'modern-ai.html#tokens-embeddings',
        figure: (
          <>
            <rect x="6" y="25" width="26" height="14" rx="2" />
            <rect x="36" y="25" width="30" height="14" rx="2" />
            <rect x="70" y="25" width="20" height="14" rx="2" />
            <path d="M96 32 H108" />
            <path d="M104 28 L108 32 L104 36" />
            <ellipse
              className="stroke-gilt"
              cx="132"
              cy="30"
              rx="18"
              ry="13"
              strokeDasharray="3 3"
            />
            <circle cx="120" cy="22" r="2.5" />
            <circle cx="132" cy="28" r="2.5" />
            <circle cx="124" cy="40" r="2.5" />
            <circle cx="141" cy="34" r="2.5" />
            <circle cx="145" cy="22" r="2.5" />
          </>
        ),
      },
      {
        num: '10',
        title: 'The Transformer Architecture',
        summary:
          'One block, repeated: let the tokens exchange information, then think about each one on its own. Wrapped in residual connections, stacked a hundred deep.',
        note: 'It won not by being cleverer than recurrent networks, but by running in parallel.',
        href: 'modern-ai.html#transformers',
        figure: (
          <>
            <path d="M34 58 V12" />
            <path d="M30 17 L34 11 L38 17" />
            <rect x="46" y="8" width="66" height="13" rx="2" />
            <rect className="stroke-gilt" x="46" y="26" width="66" height="13" rx="2" />
            <rect x="46" y="44" width="66" height="13" rx="2" />
            <path d="M120 6 h6 v53 h-6" />
          </>
        ),
      },
      {
        num: '11',
        title: 'Attention, Step by Step',
        summary:
          'Query, key and value: every token asks a question, every token advertises what it has, and each one rebuilds itself from a weighted blend of the answers.',
        note: 'Comparing every token with every token is why long context costs what it does.',
        href: 'modern-ai.html#attention',
        figure: (
          <>
            <rect className="fill-gilt/14" x="56" y="8" width="12" height="12" stroke="none" />
            <rect className="fill-gilt/14" x="56" y="20" width="24" height="12" stroke="none" />
            <rect className="fill-gilt/14" x="56" y="32" width="36" height="12" stroke="none" />
            <rect className="fill-gilt/14" x="56" y="44" width="48" height="12" stroke="none" />
            {[8, 20, 32, 44].map((y) =>
              [56, 68, 80, 92].map((x) => (
                <rect key={`${x}-${y}`} x={x} y={y} width="12" height="12" />
              )),
            )}
          </>
        ),
      },
      {
        num: '12',
        title: 'Large Language Models',
        summary:
          'Pretrained on trillions of tokens to predict the next one, then tuned on instructions and human preference until it is worth talking to. At inference it writes one token at a time.',
        note: 'Everything it "knows" mid-conversation is either in the weights or in the context.',
        href: 'modern-ai.html#llms',
        figure: (
          <>
            <path d="M10 20 H46 M10 30 H40 M10 40 H46" />
            <path d="M56 30 H70" />
            <path d="M66 26 L70 30 L66 34" />
            <path d="M80 52 H150" />
            <rect className="stroke-gilt" x="84" y="20" width="12" height="32" />
            <rect x="100" y="32" width="12" height="20" />
            <rect x="116" y="40" width="12" height="12" />
            <rect x="132" y="45" width="12" height="7" />
          </>
        ),
      },
      {
        num: '13',
        title: 'AI Agents',
        summary:
          'A model in a loop with tools: it decides an action, something else executes it, the result returns as new context, and round it goes until the goal is met or the budget runs out.',
        note: 'Text fetched by a tool is data, not instructions — forgetting that is prompt injection.',
        href: 'modern-ai.html#agents',
        figure: (
          <>
            <rect className="stroke-gilt" x="26" y="24" width="18" height="16" rx="2" />
            <path d="M44 32 H84" />
            <path d="M80 28 L84 32 L80 36" />
            <path d="M112 16 A16 16 0 1 1 98 24" />
            <path d="M94 19 L98 24 L103 21" />
          </>
        ),
      },
      {
        num: '14',
        title: 'Retrieval-Augmented Generation',
        summary:
          'Rather than hoping the answer is in the weights, find the relevant passages first and put them in the prompt. Ask for citations so a grounded answer is distinguishable from a fluent guess.',
        note: 'Most RAG systems fail at chunking and retrieval, not at generation.',
        href: 'modern-ai.html#rag',
        figure: (
          <>
            <rect x="10" y="22" width="22" height="28" rx="2" />
            <rect x="15" y="17" width="22" height="28" rx="2" />
            <rect x="20" y="12" width="22" height="28" rx="2" />
            <path d="M48 32 H64" />
            <path d="M60 28 L64 32 L60 36" />
            <circle className="stroke-gilt" cx="80" cy="28" r="10" />
            <path className="stroke-gilt" d="M87 35 L94 42" />
            <path d="M100 32 H114" />
            <path d="M110 28 L114 32 L110 36" />
            <rect x="118" y="20" width="34" height="24" rx="2" />
          </>
        ),
      },
      {
        num: '15',
        title: 'Where These Systems Break',
        summary:
          'Hallucination, lost context, prompt injection, compounding error. Each one follows from the architecture rather than from insufficient training — which is what makes them designable-around.',
        note: 'And the part everyone skips: evaluating any of it on something other than vibes.',
        href: 'modern-ai.html#limits',
        figure: (
          <>
            <path d="M14 16 H70 M14 32 H70 M14 48 H70" />
            <path className="stroke-gilt" d="M88 16 l5 5 l10 -11" />
            <path d="M88 27 L100 39 M100 27 L88 39" />
            <path className="stroke-gilt" d="M88 48 l5 5 l10 -11" />
          </>
        ),
      },
    ],
  },
];
