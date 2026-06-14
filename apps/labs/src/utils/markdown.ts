import { marked, Renderer } from 'marked';

export const md = (text: string): { __html: string } => ({
  __html: marked.parse(text) as string,
});

const HEADING_COMMON = 'my-[2rem] font-extrabold text-violet font-heading';
const HEADING_BIG = 'text-[4rem] leading-[4.9rem] md:text-[4.8rem]';
const HEADING_SMALL = 'text-[3rem] leading-[4rem]';

/**
 * Renders column article body text with the same classes the original
 * ColumnArticleSection / ColumnArticleHeader components emitted.
 * headingLevelModifier = 1 when the article already has a top-level header,
 * 0 otherwise — matches the original headerLevelModifier logic.
 */
export const mdColumn = (
  text: string,
  headingLevelModifier: number,
): { __html: string } => {
  const renderer = new Renderer();

  renderer.heading = ({ text: t, depth }) => {
    const level = depth + headingLevelModifier;
    const sizeClass =
      level >= 3
        ? `${HEADING_COMMON} ${HEADING_SMALL}`
        : `${HEADING_COMMON} ${HEADING_BIG}`;
    return `<h${depth} class="${sizeClass}">${t}</h${depth}>`;
  };

  renderer.paragraph = ({ text: t }) =>
    `<p class="my-[3rem] text-[1.6rem] leading-[2.7rem] text-black">${t}</p>`;

  return { __html: marked.parse(text, { renderer }) as string };
};
