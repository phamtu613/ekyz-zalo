import React from "react";
import { Link } from "react-router-dom";
import { Box, Icon } from "zmp-ui";
import { features } from "../constants/common";

const HomePage: React.FunctionComponent = () => {

  return (
    <div>
      <img alt="ekyc" className="w-full h-[200px]" src="https://static.vecteezy.com/system/resources/previews/020/176/525/original/ekyc-or-electronic-know-your-customer-or-digital-kyc-for-identification-and-user-registration-of-online-platform-vector.jpg" />
      <div className="pt-5 px-5 bg-white ">
        <h1 className="mb-3 text-lg font-medium">Xác thực tài khoản giúp bạn</h1>
        <div className="text-sm space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-x-2">
              <Icon icon="zi-check" size={20} className="text-[#20a450]" />
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90vw]">
        <Box className="mb-2" alignContent={"center"}>
          <Link to="/ekyc" className="block text-center w-full rounded-full text-white text-sm py-2 px-3.5 bg-[#20a450] uppercase">
            Tiếp tục
          </Link>
        </Box>
      </div>
    </div>
  );
};

export default HomePage;
