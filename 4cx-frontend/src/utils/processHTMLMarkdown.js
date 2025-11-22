import parse from "html-react-parser";
import { marked } from "marked";
import DOMPurify from "dompurify";

/**
 * Combines HTML parsing, markdown parsing, and sanitization into a single function.
 * @param {string} htmlString - The input HTML string that contains HTML tags, markdown symbols, etc.
 * @returns {string} - Cleaned, parsed, and sanitized string.
 */

const processHtmlMarkdown = (htmlString) => {
  const cleanedHtml = htmlString.replace(/<[^>]+>/g, "");
  const markdownToHtml = marked(cleanedHtml);
  const sanitizedHtml = DOMPurify.sanitize(markdownToHtml);

  // Step 4: Use html-react-parser to ensure the sanitized HTML is safe and return the result as a string
  const parsedContent = parse(sanitizedHtml);

  // Convert parsedContent to string (can also directly return sanitizedHtml)
  return parsedContent;
};

export default processHtmlMarkdown;
