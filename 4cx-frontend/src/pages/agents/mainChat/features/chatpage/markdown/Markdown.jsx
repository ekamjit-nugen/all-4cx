import Markdoc from "@markdoc/markdoc";
import React from "react";
import { MarkdownProvider } from "./MarkdownContext";
import { Citation } from "./Citation";
import { CodeBlock } from "./CodeBlock";
import { citationConfig } from "./Config";
import { Paragraph } from "./Paragraph";

export const Markdown = (props) => {
  const ast = Markdoc.parse(props.content);

  const content = Markdoc.transform(ast, {
    ...citationConfig,
  });

  const WithContext = () => (
    <MarkdownProvider onCitationClick={props.onCitationClick}>
      {Markdoc.renderers.react(content, React, {
        components: { Citation, Paragraph, CodeBlock },
      })}
    </MarkdownProvider>
  );

  return <WithContext />;
};
