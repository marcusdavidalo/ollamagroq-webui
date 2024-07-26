import React, { useEffect, useCallback } from "react";
import { compressImage } from "../../../utils/imageCompression";

const ImageUpload = ({
  isEnabled,
  onImageSelect,
  selectedImage,
  setSelectedImage,
}) => {
  const handleImageUpload = useCallback(
    async (file) => {
      if (file) {
        const compressedImage = await compressImage(file);
        onImageSelect(compressedImage);
      }
    },
    [onImageSelect]
  );

  const handlePaste = useCallback(
    async (event) => {
      const items = event.clipboardData.items;
      for (let item of items) {
        if (item.type.includes("image")) {
          const file = item.getAsFile();
          await handleImageUpload(file);
          break;
        }
      }
    },
    [handleImageUpload]
  );

  useEffect(() => {
    if (isEnabled) {
      window.addEventListener("paste", handlePaste);
      return () => {
        window.removeEventListener("paste", handlePaste);
      };
    }
  }, [isEnabled, handlePaste]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0])}
        className="hidden"
        id="image-upload"
        disabled={!isEnabled}
      />
      <label
        htmlFor="image-upload"
        className={`p-2 ${
          isEnabled
            ? "bg-zinc-500 dark:bg-zinc-600 hover:bg-zinc-600 dark:hover:bg-zinc-500 cursor-pointer"
            : "bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed"
        } text-white rounded-lg transition duration-200`}
      >
        {isEnabled ? "Upload Image" : "Image Upload Not Supported"}
      </label>
      {selectedImage && isEnabled && (
        <div className="mt-2">
          <img
            src={`data:image/jpeg;base64,${selectedImage}`}
            alt="Selected"
            className="max-h-60 rounded"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="mt-2 p-1 bg-red-500 text-white rounded"
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
