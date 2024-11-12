import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import router from './controllers';

const app = express();

// A middleware to compress the body of the response
app.use(compression());

// A middleware to set common headers that can be used to protect against some known attacks
app.use(helmet());

// A middleware to specify which application is allowed to receive the response
var corsOptions = {
  origin: '*', // Allows every domain
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Parses body from the request
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
