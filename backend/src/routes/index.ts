import express, { Request, NextFunction } from 'express';
import access from './access';

const router = express.Router();

router.use('/v1/api', access)
// router.get('', (req: Request, res: any, next: NextFunction) => {
//   return res.status(200).json({
//       message: 'Welcome to the API',
//   });
// });

export default router

