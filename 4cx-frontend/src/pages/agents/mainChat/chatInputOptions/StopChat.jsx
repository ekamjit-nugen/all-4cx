import { Square } from "lucide-react";
import { Button } from "ui/button";

export const StopChat = (props) => {
  return (
    <Button
      size="icon"
      type="submit"
      variant={"ghost"}
      onClick={() => props.stop()}
      aria-label="Stop speech readout"
    >
      <Square size={16} />
    </Button>
  );
};
