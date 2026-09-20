import Image from 'next/image';
import { X } from 'lucide-react';

type TSingleImagePreviewer = {
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  imagePreview: string;
  setImagePreview: React.Dispatch<React.SetStateAction<string>>;
  currentImage?: { url: string; key: string };
  handleDeleteImage?: (key: string) => void;
  className?: string;
  allowDelete?: boolean;
};

const ImagePreviewer = ({
  setImageFile,
  imagePreview,
  setImagePreview,
  currentImage,
  handleDeleteImage,
  className,
  allowDelete = true,
}: TSingleImagePreviewer) => {
  const handleRemove = () => {
    if (currentImage && handleDeleteImage) {
      handleDeleteImage(currentImage.key);
    }
    setImageFile(null);
    setImagePreview('');
  };

  if (!imagePreview) return null;

  return (
    <div
      className={`relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 ${className}`}
    >
      <Image
        width={500}
        height={500}
        src={imagePreview}
        alt="Profile Preview"
        className="object-cover w-full h-full"
      />

      {/* ❌ Only show if allowed */}
      {allowDelete && (
        <button
          type="button"
          onClick={handleRemove}
          className="bg-[#FF4D4F] cursor-pointer hover:bg-red-400 absolute top-3 right-4 w-6 h-6 rounded-full flex justify-center items-center"
          aria-label="Delete Image"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  );
};

export default ImagePreviewer;
