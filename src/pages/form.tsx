import React from "react";
import { Button, Input, Box, Page, useSnackbar } from "zmp-ui";
import { useRecoilState } from "recoil";
import { displayNameState } from "../state";
import { useNavigate } from "react-router";

const FormPage: React.FunctionComponent = () => {
  const [displayName, setDisplayName] = useRecoilState(displayNameState);
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = () => {
    snackbar.openSnackbar({
      duration: 3000,
      text: "Display name updated!",
      type: "success",
    });
    navigate(-1);
  };

  return (
    <Page className="page">
      <div className="section-container">
        <Box>
          <Input
            label="Display Name"
            type="text"
            placeholder={displayName}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Box mt={4}>
            <Button fullWidth variant="secondary" onClick={handleSubmit}>
              Back
            </Button>
          </Box>
        </Box>
      </div>
      {/* <Box className="flex items-center gap-x-5 gap-y-3">
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
      </Box> */}
    </Page>
  );
};

export default FormPage;
