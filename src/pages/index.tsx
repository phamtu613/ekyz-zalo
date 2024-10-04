import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Icon, Page } from "zmp-ui";
import api, {
  FacingMode,
  PhotoFormat,
  PhotoFrame,
  PhotoQuality,
  ZMACamera,
} from "zmp-sdk";
import { generateRequestId } from "../helpers";

const HomePage: React.FunctionComponent = () => {
  const [step, setStep] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<ZMACamera | null>(null);
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const requestId = generateRequestId();

  const takePhoto = () => {
    let result: PhotoFrame = cameraRef.current?.takePhoto({
      quality: PhotoQuality.HIGH,
      format: PhotoFormat.JPEG,
      minScreenshotHeight: 1000,
    });
    return result.data;
  };

  const recognizeCard = async (
    type: "frontCard" | "backCard",
    image: string,
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

  useEffect(() => {
    const handleImageRecognition = async () => {
      if (step === 1 && frontImage) {
        const success = await recognizeCard("frontCard", frontImage);
        if (success) setStep(2); // Chuyển sang bước 2 nếu thành công
      } else if (step === 2 && backImage) {
        const success = await recognizeCard("backCard", backImage);
        if (success) setStep(3); // Chuyển sang bước 3 nếu thành công
      }
    };

    handleImageRecognition(); // Gọi hàm xử lý khi trạng thái thay đổi
  }, [frontImage, backImage, step]);

  console.log("frontImage>>", frontImage);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      console.log("Media component not ready");
      return;
    }
    if (!cameraRef.current) {
      cameraRef.current = api.createCameraContext({
        videoElement: videoElement,
        mediaConstraints: {
          width: 640,
          height: 480,
          facingMode: FacingMode.BACK,
          audio: false,
        },
      });
    }
  }, []);

  const handleNextStep = async () => {
    if (step === 1 && !frontImage) {
      const frontCard = await takePhoto();
      setFrontImage(frontCard); // Cập nhật ảnh mặt trước
    } else if (step === 2 && !backImage) {
      const backCard = await takePhoto();
      setBackImage(backCard); // Cập nhật ảnh mặt sau
    }
  };

  return (
    <Page className="page bg-white">
      <p className="text-sm text-blue-800">Bước 1/3</p>
      <h2 className="text-gray-900 font-bold my-4">
        {step === 1 && "Chụp mặt trước giấy tờ tuỳ thân"}
        {step === 2 && "Chụp mặt sau giấy tờ tuỳ thân"}
        {step === 3 && "Xác thực Liveness khuôn mặt"}
        {step === 4 && "Hoàn tất"}
      </h2>
      <p className="mb-4 text-sm">
        Loại giấy tờ tuỳ thân hợp lệ: Căn cước công dân
      </p>

      <Box className="flex items-center gap-x-5 gap-y-3">
        <video
          style={{ width: "50vw", height: "30vh" }}
          ref={videoRef}
          muted
          playsInline
          webkit-playsinline
        />
        {step === 1 && frontImage && (
          <img
            src={frontImage}
            alt="Front Card"
            style={{
              width: "50vw",
              height: "auto",
              maxHeight: "30vh",
              objectFit: "contain",
            }}
          />
        )}
        {step === 2 && backImage && (
          <img
            src={backImage}
            alt="Back Card"
            style={{
              width: "50vw",
              height: "auto",
              maxHeight: "30vh",
              objectFit: "contain",
            }}
          />
        )}
      </Box>

      <div className="flex items-center gap-x-4 mt-5">
        <Box flex alignContent={"center"}>
          <Button
            size={"small"}
            className="mb-2"
            variant="primary"
            onClick={async () => {
              const camera = cameraRef.current;
              await camera?.start();
            }}
          >
            Start Stream
          </Button>
        </Box>
        <Box className="mb-2" flex alignContent={"center"}>
          <Button size="small" variant="primary" onClick={handleNextStep}>
            {step === 1 && "Chụp và gửi mặt trước"}
            {step === 2 && "Chụp và gửi mặt sau"}
            {step === 3 && "Thực hiện Liveness"}
            {step === 4 && "Xác thực"}
          </Button>
        </Box>
      </div>
    </Page>
  );
};

export default HomePage;
