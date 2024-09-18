import { Router } from 'express';
import {getWeatherHandler} from "../controllers/weatherController";

const router = Router();

router.get('/:location/:date', getWeatherHandler)

export default router;
