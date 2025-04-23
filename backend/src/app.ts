import express, { Request, Response, NextFunction } from 'express';

import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression'
import instanceMongodb from './databases/init.databases';
import { checkConnect } from './helpers/check.connect';

const app: express.Application = express();

// init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression())


// init cors
// init db
instanceMongodb.connect('mongodb')
checkConnect()

// init routes
app.get('/', (req: any, res: any, next: any) => {
    const str = "Hello world";
  return res.status(200).json({
      message: 'Welcome to the API',
      // metadata: str.repeat(1000)
  });
});

// init error handling 
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
 });
});

export { app };
