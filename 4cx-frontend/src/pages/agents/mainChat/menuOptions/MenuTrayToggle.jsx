import React from "react";
import { PanelLeftClose } from "lucide-react";
import { cn } from "utils/utils";
import { MenuItem } from "ui/menu";
import { menuIconProps } from "ui/menu";
import { useAzureMenuState } from "hooks/context/useAzureChatMenu";

const MenuTrayToggle = () => {
  const { isMenuOpen, toggleMenuState } = useAzureMenuState();

  return (
    <MenuItem onClick={toggleMenuState} tooltip="Open and Collapse menu">
      <PanelLeftClose
        {...menuIconProps}
        className={cn("transition-all rotate-180 duration-700", isMenuOpen ? "rotate-0" : "")}
      />
    </MenuItem>
  );
};

export { MenuTrayToggle };
