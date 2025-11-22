import React from "react";

import { Home, PocketKnife, VenetianMask } from "lucide-react";
import { MenuTrayToggle } from "./MenuTrayToggle";
import { MenuLink } from "./MenuLink";
import { Menu, MenuBar, MenuItem, MenuItemContainer, menuIconProps } from "ui/menu";
import { useDispatch } from "react-redux";
import { setRoute } from "store/features/azureChatRoutesSlice";
import { setChatRoute } from "store/features/azureChatRoutesSlice";
const MainMenu = () => {
  const dispatch = useDispatch();

  const iconColor = "#262a49";
  const iconSize = 20;

  return (
    <Menu>
      <MenuBar>
        <MenuItemContainer>
          <MenuTrayToggle />
        </MenuItemContainer>
        <MenuItemContainer>
          <MenuItem tooltip="Home" onClick={() => dispatch(setRoute(1))} asChild>
            <MenuLink ariaLabel="Go to the Home page">
              <Home {...menuIconProps} color={iconColor} size={iconSize} />
            </MenuLink>
          </MenuItem>
          <MenuItem onClick={() => {dispatch(setRoute(2)), dispatch(setChatRoute(2))}} tooltip="Persona">
            <MenuLink ariaLabel="Go to the Persona configuration page">
              <VenetianMask {...menuIconProps} color={iconColor} size={iconSize} />
            </MenuLink>
          </MenuItem>
          <MenuItem onClick={() => {dispatch(setRoute(3)), dispatch(setChatRoute(3))}} tooltip="Extensions">
            <MenuLink ariaLabel="Go to the Extensions configuration page">
              <PocketKnife {...menuIconProps} color={iconColor} size={iconSize} />
            </MenuLink>
          </MenuItem>
        </MenuItemContainer>
        <MenuItemContainer>
          {/* <MenuItem tooltip="Profile"><UserProfile /></MenuItem> */}
        </MenuItemContainer>
      </MenuBar>
    </Menu>
  );
};

export { MainMenu };
