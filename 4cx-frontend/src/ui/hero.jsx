import React from "react";
import { Button } from "./button";

const Hero = ({ title, description, children }) => {
  return (
    <div className="w-full pt-10 pb-5">
      <div className="container max-w-4xl h-full flex flex-col gap-16">
        <div className="flex gap-6 flex-col items-start">
          <h1 className="text-4xl font-bold flex gap-2 items-center">{title}</h1>
          <p className="text-muted-foreground max-w-xl">{description}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">{children}</div>
      </div>
    </div>
  );
};

const HeroButton = ({ icon, title, description, onClick }) => {
  return (
    <Button
      variant={"outline"}
      className="flex flex-col gap-4 h-auto p-4 items-start text-start justify-start"
      onClick={onClick}
    >
      <span className="flex gap-2 items-center text-primary">
        <span>{icon}</span>
        <span>{title}</span>
      </span>

      <span className="text-muted-foreground whitespace-break-spaces font-normal">
        {description}
      </span>
    </Button>
  );
};

export { Hero, HeroButton };
