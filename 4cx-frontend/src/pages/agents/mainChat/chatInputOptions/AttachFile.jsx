import { Paperclip } from "lucide-react";
import { useRef, forwardRef } from "react";
import { Button } from "ui/button";

export const AttachFile = forwardRef((props, ref) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      // Check if onClick is provided and is a function
      // Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log("FORM-DATA", key, value); // This will log key-value pairs of form data
      }
      props.handleFileAttach(formData);
      event.target.value = ""; // Clear the input
    }
  };

  return (
    <>
      <Button
        size="icon"
        variant={"ghost"}
        onClick={handleClick}
        type="button"
        aria-label="Attach file to chat"
        ref={ref}
      >
        <Paperclip size={16} />
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
});
