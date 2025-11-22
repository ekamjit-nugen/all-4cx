import React from "react";
// import PersonaCardContextMenu from "./persona-card-context-menu";
// import ViewPersona from "./persona-view";
// import StartNewPersonaChat from "./start-new-persona-chat";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "ui/card";

const PersonaCard = ({ persona, showContextMenu }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row">
        <CardTitle className="flex-1">PERSONA CARD TITLE</CardTitle>
        {/* {showContextMenu && (
          <div>
            <PersonaCardContextMenu persona={persona} />
          </div>
        )} */}
      </CardHeader>
      <CardContent className="text-muted-foreground flex-1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. In, ut numquam porro officia ab
        iusto. Excepturi eius mollitia, nihil corrupti sed saepe cumque, praesentium veniam unde
        quia dolorem! Sit, odit?
      </CardContent>
      <CardFooter className="gap-1 content-stretch">
        {/* {showContextMenu && <ViewPersona persona={persona} />} */}
        {/* <StartNewPersonaChat persona={persona} /> */}
      </CardFooter>
    </Card>
  );
};

export default PersonaCard;
