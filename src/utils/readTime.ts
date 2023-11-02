import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

/**
 * Injects `minutesRead` into frontmatter processed by Remark.
 */
export function remarkReadingTime() {
  return function (tree: unknown, { data }: any) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    // Change "read" to "lectura" in the output string
    const modifiedText = readingTime.text.replace('read', 'lectura');
    // Assign the modified string to the frontmatter
    data.astro.frontmatter.minutesRead = modifiedText;
  };
}