import { default as React, useRef, useState } from "react";
import {
  chooseImage, ZMACamera
} from "zmp-sdk";
import { Box } from "zmp-ui";
import ImageUpload from "../components/image-upload";
import { generateRequestId } from "../helpers";


const EkycPage: React.FunctionComponent = (props) => {
  const [step, setStep] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<ZMACamera | null>(null);
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const [livenessImage, setLivenessImage] = useState("");
  const requestId = generateRequestId();

  const recognizeCard = async (
    type: "frontCard" | "backCard",
    image: string
  ) => {
    const response = await fetch("https://api.tino.vn/ekyc/ocr/recognition", {
      method: "POST",
      body: JSON.stringify({
        request_id: requestId,
        type,
        image: image.replace("data:image/jpeg;base64,", ""),
      }),
    });
    const data = await response.json();
    return data.success;
  };

  const verifyLiveness = async (image: string) => {
    const response = await fetch("https://api.tino.vn/ekyc/liveness", {
      method: "POST",
      body: JSON.stringify({
        request_id: requestId,
        image: image.replace("data:image/jpeg;base64,", ""),
      }),
    });
    const data = await response.json();
    return data.success;
  };

  const verifyFinalStep = async () => {
    const response = await fetch("https://api.tino.vn/ekyc/verify", {
      method: "POST",
      body: JSON.stringify({
        request_id: requestId,
        front_image: frontImage.replace("data:image/jpeg;base64,", ""),
        back_image: backImage.replace("data:image/jpeg;base64,", ""),
        liveness_image: livenessImage.replace("data:image/jpeg;base64,", ""),
      }),
    });
    const data = await response.json();
    return data.success;
  };

  const handleNextStep = async () => {
    if (step === 1 && frontImage) {
      // const success = await recognizeCard("frontCard", frontImage);
      // if (success) setStep(2);
      setStep(2);
    } else if (step === 2 && backImage) {
      // const success = await recognizeCard("backCard", backImage);
      // if (success) setStep(3);
      setStep(3);
    } else if (step === 3) {
      // TODO: Thêm logic để kiểm tra Liveness khuôn mặt
      setStep(4); // Chuyển sang bước 4 nếu thành công
    } else if (step === 4) {
      // TODO: Thêm logic gửi API với 3 tấm hình
    }
  };

  async function fetchImageAsBase64(imageUrl) {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const handleImagesChange = async () => {
    try {
      const { filePaths } = await chooseImage({
        sourceType: ["camera", "album"],
        count: 1,
        cameraType: "front",
      });
      const base64Image = await fetchImageAsBase64(filePaths[0]) as string
      if (step === 1) {
        setFrontImage(base64Image);
      } else if (step === 2) {
        setBackImage(base64Image);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const resolveClassButton = () => {
    if ((step === 1 && !frontImage) || (step === 2 && !backImage)) {
      return "bg-[#0ea54877] pointer-events-none"
    }
    return "bg-[#20a450]"
  }

  return (
    <div className="page bg-white">
      <p className="text-sm text-[#158736]">Bước {step}/3</p>
      <h2 className="text-gray-900 font-bold my-4">
        {step === 1 && "Chụp mặt trước giấy tờ tuỳ thân"}
        {step === 2 && "Chụp mặt sau giấy tờ tuỳ thân"}
        {step === 3 && "Xác thực Liveness khuôn mặt"}
        {step === 4 && "Hoàn tất"}
      </h2>
      {[1, 2].includes(step) && (
        <p className="mb-4 text-sm">
          Loại giấy tờ tuỳ thân hợp lệ: Căn cước công dân
        </p>
      )}

      {[1, 2].includes(step) && (
        <Box>
          <ImageUpload
            onChange={handleImagesChange}
            image={step === 1 ? frontImage : backImage}
          />
        </Box>
      )}

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90vw]">
        <Box className="mb-2" alignContent={"center"}>
          <button className={`w-full rounded-full text-white text-sm py-2 px-3.5 uppercase ${resolveClassButton()}`} onClick={handleNextStep}>
            {[1, 2, 3].includes(step) && "Tiếp tục"}
            {step === 4 && "Xác thực"}
          </button>
        </Box>
      </div>
    </div>
  );
};

export default EkycPage;
