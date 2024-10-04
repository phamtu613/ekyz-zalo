import React, { useEffect, useRef, useState } from "react";
import { Sheet, Button, Page, Text, useNavigate } from "zmp-ui";

const AboutPage: React.FunctionComponent = (props) => {
  const [actionSheetOpened, setActionSheetOpened] = React.useState(false);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      if (videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          videoRef.current.srcObject = stream;
        } catch (err) {
          console.error("Lỗi khi mở camera:", err);
        }
      }
    };

    startCamera();

    // Dọn dẹp stream khi component unmount
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const takePicture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setImageSrc(canvas.toDataURL("image/png")); // Lưu ảnh thành base64
      }
    }
  };

  return (
    <Page className="page">
      <div>
        <h2>Chụp ảnh CCCD</h2>
        <video
          ref={videoRef}
          autoPlay
          style={{ width: "100%", height: "auto" }}
        />
        <button onClick={takePicture}>Chụp ảnh</button>
        {imageSrc && (
          <div>
            <h3>Ảnh đã chụp:</h3>
            <img src={imageSrc} alt="Chụp từ camera" />
            <button>Gửi lên</button>
          </div>
        )}
      </div>
    </Page>
  );
};

export default AboutPage;
