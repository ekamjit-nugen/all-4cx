import React from "react";
import { Link } from "react-router-dom";
import { cn } from "utils/utils";

// Utility function for class names
const ButtonLinkVariant = "button-link-variant";

// MenuLink component
export const MenuLink = ({ href, ariaLabel, children }) => {
  return (
    <Link
      className={cn(ButtonLinkVariant, href !== "/" ? "text-primary" : "")}
      to={href}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
};
