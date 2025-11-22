import { useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "ui/button";
import { useMarkdownContext } from "./MarkdownContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "ui/sheet";

export const CitationSlider = (props) => {
  const { onCitationClick } = useMarkdownContext();

  if (!onCitationClick) throw new Error("onCitationClick is null");

  const [node, setNode] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const result = onCitationClick(); // Call the citation click handler
    setNode(result); // Set the node to whatever `onCitationClick` returns
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="hidden" name="id" value={props.id} />
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" type="submit">
            {props.index}
          </Button>
        </SheetTrigger>
        <SheetContent className="min-w-[480px] sm:w-[540px] flex flex-col">
          <SheetHeader>
            <SheetTitle>Citation</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 flex -mx-6">
            <div className="px-6 whitespace-pre-wrap">{node}</div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </form>
  );
};
