'use client';

import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  interface Cloudinary {
    createUploadWidget: (
      options: object,
      callback: (error: Error | null, result: UploadResult | null) => void
    ) => void;
  }
  const cloudinary: Cloudinary;
}

interface UploadResult {
  info?:
    | {
        secure_url?: string;
      }
    | string;
}

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value
}) => {
  const handleUpload = useCallback(
    (result: UploadResult) => {
      if (typeof result.info === "string") {
        onChange(result.info);
      } else if (result.info?.secure_url) {
        onChange(result.info.secure_url);
      }
    },
    [onChange]
  );



  return (
    <CldUploadWidget
      onSuccess={(result: CloudinaryUploadWidgetResults) =>
        handleUpload(result)
      }
      uploadPreset="kpqwblag"
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="relative
          cursor-pointer
          hover:opacity-70
          transition
          border-dashed
          border-2
          p-20
          border-neutral-300
          flex
          flex-col
          justify-center
          items-center
          gap-4
          text-neutral-600"
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">Click to upload</div>
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  alt="Upload"
                  fill
                  style={{ objectFit: "cover" }}
                  src={value}
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
}

export default ImageUpload
