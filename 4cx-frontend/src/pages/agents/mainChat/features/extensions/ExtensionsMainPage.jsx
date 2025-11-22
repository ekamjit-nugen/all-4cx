import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import ExtensionHero from "./extensionHero/ExtensionHeroSection";
import ExtensionCard from "./extensionCard/ExtensionCard";

const ExtensionsMainPage = (props) => {
  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-1 flex-col">
        <ExtensionHero />
        <div className="container max-w-4xl py-3">
          <div className="grid grid-cols-3 gap-3">
            {/* {props.extensions.map((extension) => (
              <ExtensionCard extension={extension} key={extension.id} showContextMenu />
            ))} */}
          </div>
        </div>
      </main>
    </ScrollArea>
  );
};

export default ExtensionsMainPage;
