import express from 'express';
import { json } from 'body-parser';
import {errorHandler} from "./middlewares/errorHandling";
import {rateLimiter} from "./middlewares/rateLimiter";

const app = express();
app.use(json());
app.use(rateLimiter);
// TODO add /api/v1/weather endpoint

app.use(errorHandler);

export default app;
