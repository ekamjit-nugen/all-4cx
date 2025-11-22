import imageCompression from "browser-image-compression";

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1, // Set maximum size (in MB) for the compressed image
    maxWidthOrHeight: 400, // Max width or height (in pixels), reduced to less than 500x500
    useWebWorker: true, // Use web worker for faster compression
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Error during image compression:", error);
    throw error;
  }
};

export default compressImage;
