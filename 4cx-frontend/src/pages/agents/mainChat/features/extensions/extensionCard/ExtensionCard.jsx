"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "ui/card";
// import { extensionStore } from "../extension-store";
// import { ExtensionCardContextMenu } from "./extension-context-menu";
// import { StartNewExtensionChat } from "./start-new-extension-chat";
// import { Button } from "ui/button";

const ExtensionCard = (props) => {
  const { extension } = props;

  return (
    <Card key={extension.id} className="flex flex-col">
      <CardHeader className="flex flex-row">
        <CardTitle className="flex-1">{extension.name}</CardTitle>
        {/* {props.showContextMenu && (
          <div>
            <ExtensionCardContextMenu extension={extension} />
          </div>
        )} */}
      </CardHeader>
      <CardContent className="text-muted-foreground flex-1">{extension.description}</CardContent>
      <CardFooter className="gap-1 content-stretch f">
        {/* {props.showContextMenu && (
          <Button
            variant={"outline"}
            title="Show message"
            onClick={() => extensionStore.openAndUpdate(props.extension)}
          >
            <Pencil size={18} />
          </Button>
        )} */}

        {/* <StartNewExtensionChat extension={extension} /> */}
      </CardFooter>
    </Card>
  );
};

export default ExtensionCard;
