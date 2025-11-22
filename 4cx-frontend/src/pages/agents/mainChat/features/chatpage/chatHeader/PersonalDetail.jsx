// import { CHAT_DEFAULT_SYSTEM_PROMPT } from "@/features/theme/theme-config";
// import { Button } from "@/features/ui/button";
// import { Label } from "@/features/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "ui/sheet";
import { VenetianMask } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "ui/button";
import { Label } from "@radix-ui/react-label";
import processHtmlMarkdown from "utils/processHTMLMarkdown";
import formatMarkdownParser from "utils/formatMarkdownParser";

export const PersonaDetail = (props) => {
  const { personaDetails } = props;

  const CHAT_DEFAULT_SYSTEM_PROMPT =
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint iure, consequuntur cumque error asperiores dicta ex deleniti.";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"icon"} aria-label="Current Chat Persona Menu">
          <VenetianMask size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[2000] w-[30%] flex flex-col">
        <SheetHeader>
          <SheetTitle>Persona Details</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 -mx-4 px-4 py-6 space-y-6">
          <div className="space-y-4">
            {/* Name Section */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-600">Name</Label>
              <div className="text-lg font-semibold text-gray-900">
                {personaDetails.persona_message_title}
              </div>
            </div>

            {/* Perona Details Section */}
            <div className="space-y-1">
              <Label htmlFor="personaMessage" className="text-sm font-medium text-gray-600">
                Prompt Details
              </Label>
              <div
                className="text-base text-gray-700 whitespace-pre-wrap overflow-y-auto"
                style={{ maxHeight: "700px" }} // Adjust the height as needed
              >
                {formatMarkdownParser(personaDetails.persona_message)}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
