import { cn } from "utils/utils";

export const Paragraph = ({ children, className }) => {
  return <div className={cn(className, "py-3")}>{children}</div>;
};

export const paragraph = {
  render: "Paragraph",
};
