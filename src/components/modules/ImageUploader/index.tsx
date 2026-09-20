import { Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ImageUp } from 'lucide-react';

type TSingleImageUploaderProps = {
  label?: string;
  className?: string;
  setImageFile: Dispatch<SetStateAction<File | null>>;
  setImagePreview: Dispatch<SetStateAction<string>>;
};

const ImageUploader = ({
  label = 'Upload Image',
  className,
  setImageFile,
  setImagePreview,
}: TSingleImageUploaderProps) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // reset input so the same file can be re-uploaded if needed
    event.target.value = '';
  };

  return (
    <div
      className={cn(
        'flex justify-center flex-col items-center w-full gap-4',
        className,
      )}
    >
      <Input
        onChange={handleImageChange}
        type="file"
        accept="image/*"
        className="hidden"
        id="single-image-uploader"
      />
      <label
        htmlFor="single-image-uploader"
        className="w-full h-32 md:size-32 flex flex-col items-center justify-center border-2 border-gray-300 cursor-pointer text-center text-sm text-gray-500 hover:bg-gray-50 transition rounded-full"
      >
        <ImageUp />
        <span className="font-medium text-sm">{label}</span>
      </label>
    </div>
  );
};

export default ImageUploader;
