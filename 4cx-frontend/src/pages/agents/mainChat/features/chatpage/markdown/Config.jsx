import { citation } from "./Citation";
import { fence } from "./CodeBlock";
import { paragraph } from "./Paragraph";

export const citationConfig = {
  nodes: {
    paragraph,
    fence,
  },
  tags: {
    citation,
  },
};
