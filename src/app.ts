import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import router from './controllers';

const app = express();
app.use(compression());
app.use(helmet());
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

/**
 * 404 Route
 */
app.use('/', (_: Request, response: Response) => {
  response.status(404).json({
    code: 404,
    message: 'Requested resource does not exist',
  });
});

export default app;
