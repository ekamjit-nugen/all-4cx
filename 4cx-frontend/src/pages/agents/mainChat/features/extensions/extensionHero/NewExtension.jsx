import React from "react";
import { PocketKnife } from "lucide-react";
import { HeroButton } from "ui/hero";
// import { extensionStore } from "../extension-store";

const NewExtension = () => {
  return (
    <HeroButton
      title="New Extension"
      description="Create a new extension with your own internal API"
      icon={<PocketKnife />}
      //   onClick={() => extensionStore.newAndOpenSlider()}
    />
  );
};

export default NewExtension;
