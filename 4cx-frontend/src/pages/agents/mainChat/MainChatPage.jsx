import React from "react";
import Image from "ui/Image";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Hero } from "./ChatHeroSection";

export const AI_NAME = "Azure Chat";
export const AI_DESCRIPTION = "Azure Chat is a friendly AI assistant.";

const MainChatPage = (props) => {
  return (
    <ScrollArea className="flex-1">
      <main className="mx-10 flex flex-1 flex-col gap-6">
        <Hero
          title={
            <>
              <Image src={"/ai-icon.png"} width={50} height={50} quality={100} alt="ai-icon" />{" "}
              <span className="text-lg md:text-xl font-semibold">{AI_NAME}</span>
            </>
          }
          description={<p className="text-sm md:text-base font-bold">{AI_DESCRIPTION}</p>}
        ></Hero>
        <div className="max-w-4xl flex gap-14 flex-col">
          <div>
            <h2 className="text-xl font-bold mb-3 px-5">Extensions</h2>
            {props.extensions && props.extensions.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {/* {props.extensions.map((extension) => {
                  return (
                    <ExtensionCard
                      extension={extension}
                      key={extension.id}
                      showContextMenu={false}
                    />
                  );
                })} */}
              </div>
            ) : (
              <p className="text-muted-foreground max-w-xl px-5 text-[18px]">
                No extensions created
              </p>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3 px-5">Personas</h2>
            <p className="text-muted-foreground max-w-xl px-5 text-[18px]">No personas created</p>
          </div>
        </div>
      </main>
    </ScrollArea>
  );
};

export default MainChatPage;
