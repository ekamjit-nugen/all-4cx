import React from "react";
import { Loader } from "lucide-react";
import { cn } from "utils/utils";

export const LoadingIndicator = (props) => {
  if (!props.isLoading) return null;

  return <Loader className={cn("animate-spin")} size={18} />;
};
