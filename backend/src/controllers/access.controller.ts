import { NextFunction, Request, Response } from 'express';

class AccessController {
    signUp = async (req: Request, res: Response, next: NextFunction): Promise<any>  => {
        try {
            console.log('[P]::signUp::', req.body);
            return res.status(201).json({
                code: 20001, 
                metadata: { userId: 1, body: req.body },
                message: "Shop registered successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

const accessController = new AccessController();
export default accessController;
