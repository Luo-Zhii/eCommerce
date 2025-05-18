import express, { Request, Response, NextFunction } from "express";
import access from "./access";
import { apiKey, checkPermission } from "../utils/auth/checkAuth";

const router = express.Router();

// middlewere to check if the request is authenticated
router.use(apiKey);   // check api key
router.use(checkPermission('0000'));  //check permission

router.use("/v1/api", access);


router.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Not Found");
    (error as any).status = 404;
    next(error);
});

router.use((error: any, req: Request, res: Response, next: NextFunction): any => {
    const statusCode = (error as any).status || 500;
    return res.status(statusCode).json({
        error: {
            status: 'error',
            code: statusCode,   
            message: error.message || "Internal Server Error",
        }
    });
});


export default router;
