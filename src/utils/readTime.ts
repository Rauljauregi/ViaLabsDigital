import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

/**
 * Injects `minutesRead` into frontmatter processed by Remark.
 */
export function remarkReadingTime() {
  return function (tree: unknown, { data }: any) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
  
    // Asegurar un tiempo mínimo de lectura
    const minutes = Math.max(1, Math.ceil(readingTime.minutes));
    const modifiedText = `${minutes} min tiempo de lectura`;
    // Assign the modified string to the frontmatter
    data.astro.frontmatter.minutesRead = modifiedText;
  };
}
