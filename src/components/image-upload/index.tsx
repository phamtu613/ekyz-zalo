import React from "react";
import { Icon } from "zmp-ui";

export interface ImageUploadProps {
  onChange: () => void;
  image?: any
}
const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, image }: ImageUploadProps) => {

  return (
    <>
      {image ? (
        <div className="mt-4 w-[70vw] mx-auto bg-[#F4F5F6] h-[150px] rounded-lg text-[#B9BDC1] flex items-center justify-center flex-col" onClick={() => onChange()}>
          <img
            src={image}
            alt="Back Card"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      ) : (
        <div className="mt-4 w-[70vw] mx-auto bg-[#F4F5F6] h-[150px] p-4 rounded-lg text-[#B9BDC1] flex items-center justify-center flex-col" onClick={() => onChange()}>
          <Icon icon="zi-plus" />
        </div>
      )}

      <button className="bg-[#bffbd59c] text-[#20a450] gap-x-1 relative left-1/2 -translate-x-1/2 mt-4 flex items-center rounded-s-md py-1.5 px-5">
        <Icon icon="zi-camera" size={18} /> Chụp ảnh
      </button>
    </>

  );
};

export default ImageUpload;
