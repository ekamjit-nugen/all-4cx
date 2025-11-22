import React from "react";
import { Button } from "ui/button";

export const Hero = (props) => {
  return (
    <div className="border-b w-full py-8 sm:py-6">
      <div className="max-w-4xl flex flex-col gap-8">
        <div className="flex gap-4 flex-col items-start px-5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex gap-2 items-center">
            {props.title}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl">
            {props.description}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{props.children}</div>
      </div>
    </div>
  );
};
// Adjust the import path as needed

export const HeroButton = (props) => {
  return (
    <Button
      variant="outline"
      className="flex flex-col gap-4 h-auto p-4 items-start text-start justify-start"
      onClick={props.onClick}
    >
      <span className="flex gap-2 items-center text-primary">
        <span>{props.icon}</span>
        <span>{props.title}</span>
      </span>

      <span className="text-muted-foreground whitespace-break-spaces font-normal">
        {props.description}
      </span>
    </Button>
  );
};
