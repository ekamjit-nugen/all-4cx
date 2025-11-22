import React from "react";
import { useAzureMenuState } from "hooks/context/useAzureChatMenu";
import { cn } from "utils/utils";
// import { cn } from "./ui/lib";
// import { useMenuState } from "./menu-store"; // Adjust the import path as needed

const MenuTray = React.forwardRef(({ className, ...props }, ref) => {
  const { isMenuOpen } = useAzureMenuState();
  // const isMenuOpen = true;

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col border-r overflow-hidden transition-all duration-700 w-96",
        isMenuOpen ? "translate-x-0" : "-translate-x-full -ml-96",
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
});

MenuTray.displayName = "MenuTray";

export { MenuTray };
