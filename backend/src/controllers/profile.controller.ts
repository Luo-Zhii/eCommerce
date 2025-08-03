import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";

const dataProfiles = [
  {
    usr_id: 1,
    usr_name: "CR7",
    usr_avt: "image.com/user/1",
  },
  {
    usr_id: 2,
    usr_name: "M10",
    usr_avt: "image.com/user/2",
  },
  {
    usr_id: 3,
    usr_name: "User3",
    usr_avt: "image.com/user/3",
  },
];

class ProfileController {
  // admin
  profiles = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "view all profiles",
      metadata: dataProfiles,
    }).send(res);
  };

  // shop
  profile = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "view all profiles",
      metadata: {
        usr_id: 2,
        usr_name: "M10",
        usr_avt: "image.com/user/2",
      },
    }).send(res);
  };
}

const profileController = new ProfileController();
export default profileController;
