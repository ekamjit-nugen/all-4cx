import React from "react";
import { PocketKnife } from "lucide-react";
import { Hero } from "ui/hero";
import AISearch from "./AISearch";
import NewExtension from "./NewExtension";
import BingSearch from "./BingSearch";

const ExtensionHero = () => {
  const AI_NAME = "Azure Chat";
  return (
    <Hero
      title={
        <>
          <PocketKnife size={36} strokeWidth={1.5} /> Extensions
        </>
      }
      description={`Seamlessly connect ${AI_NAME} with internal APIs or external resources`}
    >
      <NewExtension />
      <BingSearch />
      <AISearch />
    </Hero>
  );
};

export default ExtensionHero;
