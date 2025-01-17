import imageCompression from "browser-image-compression";

export const compressImage = async (file) => {
  const options = {
    maxSizeKB: 256,
    maxWidthOrHeight: 512,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]); // Return base64 data
      };
      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    console.error("Error compressing image:", error);
    return null;
  }
};
