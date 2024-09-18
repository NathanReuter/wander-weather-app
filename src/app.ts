import express from 'express';
import { json } from 'body-parser';
import {errorHandler} from "./middlewares/errorHandling";
import {rateLimiter} from "./middlewares/rateLimiter";
import weatherRoutes from './routes/weatherRoutes';
import {initializeDatabase} from "./db/initializer";

const app = express();

initializeDatabase();

app.use(json());
app.use(rateLimiter);
app.use('/api/v1/weather', weatherRoutes);
app.use(errorHandler);

export default app;
