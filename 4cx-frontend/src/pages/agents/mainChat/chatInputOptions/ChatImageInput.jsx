import { Image as ImageIcon, X } from "lucide-react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPreviewImage,
  updateBase64Image,
  reset,
  setFileUrl,
} from "store/features/chatImageInputSlide";
import { Button } from "ui/button";
import compressImage from "utils/imageCompressor";
import { fileToBase64 } from "utils/imageUploadHandler";

export const ImageInput = ({ responseLoading }) => {
  const dispatch = useDispatch();

  // Select Redux state for input image
  const { base64Image, previewImage } = useSelector((state) => state.inputImage);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileInputRef.current?.click();
  };

  const resetFileInput = () => {
    dispatch(reset()); // Dispatch reset action from Redux
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress the image
        const compressedFile = await compressImage(file);

        // Convert the compressed file to base64
        const base64 = await fileToBase64(compressedFile);

        // Log the size of the base64 string
        // Generate a preview URL for the compressed image
        const previewUrl = URL.createObjectURL(compressedFile);

        // Dispatch actions to update the Redux store (or any state management)
        dispatch(setPreviewImage(previewUrl));
        dispatch(updateBase64Image(base64));
        dispatch(setFileUrl(file.name));

        // Check if the size is still too large and handle it accordingly
        if ((base64.length * 3) / 4 > MAX_PAYLOAD_SIZE) {
          console.error("Payload size exceeds maximum limit");
          // You may want to notify the user or take other actions
        }
      } catch (error) {
        console.error("Image handling failed:", error);
      }
    }
  };


  return (
    <div className="flex gap-2">
      {previewImage && (
        <div className="relative overflow-hidden rounded-md w-[35px] h-[35px]">
          <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
          <button
            className="absolute right-1 top-1 bg-background/20 rounded-full p-[2px]"
            onClick={resetFileInput}
            aria-label="Remove image from chat input"
          >
            <X size={12} className="stroke-background" />
          </button>
        </div>
      )}
      <input type="hidden" name="image-base64" value={base64Image} />
      <input
        type="file"
        accept="image/*"
        name="image"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange} // Call handleFileChange for file input
        disabled={responseLoading}
      />
      <Button
        size="icon"
        variant={"ghost"}
        disable={responseLoading}
        type="button"
        onClick={handleButtonClick}
        aria-label="Add an image to the chat input"
        className={responseLoading && "cursor-wait"}
      >
        <ImageIcon size={16} className={responseLoading ? "text-slate-300" : "text-slate-700"} />
      </Button>
    </div>
  );
};
