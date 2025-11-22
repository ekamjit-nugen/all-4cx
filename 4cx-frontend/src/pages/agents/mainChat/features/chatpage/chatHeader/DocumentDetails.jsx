import { ScrollArea } from "@radix-ui/react-scroll-area";
import { File } from "lucide-react";
import { Button } from "ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "ui/sheet";

export const DocumentDetail = (props) => {
  const staticChatDocuments = [
    { id: 1, name: "Document 1" },
    { id: 2, name: "Document 2" },
    { id: 3, name: "Document 3" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} className="gap-2" aria-label="Current Chat Documents Menu">
          <File size={16} /> {staticChatDocuments.length}
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[480px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Documents</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 -mx-6 flex" type="always">
          <div className="pb-6 px-6 flex gap-2 flex-col flex-1">
            {staticChatDocuments.map((doc) => {
              return (
                <div className="flex gap-2 items-center" key={doc.id}>
                  <File size={16} /> <div>{doc.name}</div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

// export const DocumentDetail = (props) => {
//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant={"outline"} className="gap-2" aria-label="Current Chat Documents Menu">
//           <File size={16} /> {props.chatDocuments.length}
//         </Button>
//       </SheetTrigger>
//       <SheetContent className="min-w-[480px] sm:w-[540px] flex flex-col">
//         <SheetHeader>
//           <SheetTitle>Documents</SheetTitle>
//         </SheetHeader>
//         <ScrollArea className="flex-1 -mx-6 flex" type="always">
//           <div className="pb-6 px-6 flex gap-2 flex-col  flex-1">
//             {props.chatDocuments.map((doc) => {
//               return (
//                 <div className="flex gap-2 items-center" key={doc.id}>
//                   <File size={16} /> <div>{doc.name}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </ScrollArea>
//       </SheetContent>
//     </Sheet>
//   );
// };
