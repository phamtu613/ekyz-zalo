import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Icon, Page } from "zmp-ui";
import api, {
  FacingMode,
  PhotoFormat,
  PhotoFrame,
  PhotoQuality,
  ZMACamera,
} from "zmp-sdk";

const HomePage: React.FunctionComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<ZMACamera | null>(null);
  const [data, setData] = useState("");
  const [isOpenCamera, setIsOpenCamera] = useState<boolean>(false);

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
          facingMode: FacingMode.FRONT,
          audio: false,
        },
      });
    }
  }, []);

  return (
    <Page className="page bg-white">
      <p className="text-sm text-blue-800">Bước 1/3</p>
      <h2 className="text-gray-900 font-bold my-4">
        Chụp mặt trước giấy tờ tuỳ thân
      </h2>
      <p className="mb-4 text-sm">
        Loại giấy tờ tuỳ thân hợp lệ: Căn cước công dân
      </p>

      {/* <Box
        style={{
          width: "250px",
          height: "160px",
          borderRadius: "8px",
          overflow: "hidden",
          marginInline: "auto",
          marginBottom: "5px",
        }}
      >
        <img
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          role="presentation"
          src="../../public/thumbnail-take-photo.jpg"
          alt="img"
        />
      </Box> */}

      <Box>
        <video
          style={{ width: "50vw", height: "30vh" }}
          ref={videoRef}
          muted
          playsInline
          webkit-playsinline
        />
        <img
          id="image"
          src={data}
          alt={""}
          style={{ width: "50vw", height: "auto", objectFit: "contain" }}
        ></img>
      </Box>

      <div className="flex items-center gap-x-4">
        <Box flex alignContent={"center"}>
          <Button
            size={"small"}
            className="mb-2"
            variant="primary"
            onClick={async () => {
              const camera = cameraRef.current;
              await camera?.start();
              setIsOpenCamera(true);
            }}
          >
            Start Stream
          </Button>
        </Box>
        <Box className="mb-2" flex alignContent={"center"}>
          <Button
            size={"small"}
            variant="primary"
            onClick={() => {
              let result: PhotoFrame = cameraRef.current?.takePhoto({
                quality: PhotoQuality.HIGH,
                format: PhotoFormat.JPEG,
                minScreenshotHeight: 1000,
              });
              if (result) {
                setData(result.data);
                console.log('data>>>', result.data)
              } else {
                console.log("No data");
              }
            }}
          >
            Take Photo
          </Button>
        </Box>
      </div>
    </Page>
  );
};

export default HomePage;
