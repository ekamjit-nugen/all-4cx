import { marked } from "marked";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

marked.setOptions({
  gfm: true, // GitHub-flavored Markdown
  breaks: true, // Converts single line breaks to <br>
});

/**
 * Converts a Markdown string to a sanitized HTML string.
 *
 * @param {string} markdown - The Markdown string to be converted.
 * @returns {string} - A sanitized HTML string.
 */

const formatMarkdownParser = (markdown) => {
  const cleanedHtml = markdown.replace(/<[^>]+>/g, "\n");
  const markdownToHtml = marked(cleanedHtml);
  const parsedMarkdown = marked(markdownToHtml); // Convert Markdown to HTML
  const cleanMarkdown = DOMPurify.sanitize(parsedMarkdown); // Sanitize HTML

  const parsedContent = parse(cleanMarkdown);

  return parsedContent;
};

export default formatMarkdownParser;
