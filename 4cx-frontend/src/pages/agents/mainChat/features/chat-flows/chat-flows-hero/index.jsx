import { PocketKnife } from "lucide-react";
import React from "react";
import { Hero } from "ui/hero";

export default function ChatFlowsHero() {
  return (
    <Hero
      title={
        <>
          <PocketKnife size={36} strokeWidth={1.5} /> Chatflow
        </>
      }
      description={`Seamlessly connect the Chatflows and create a chat instance`}
    />
  );
}
