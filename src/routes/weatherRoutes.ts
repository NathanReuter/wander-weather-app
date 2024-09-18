import express from 'express';
import {getWeatherHandler} from "../controllers/weatherController";

const router = express.Router();

router.get('/:location/:date', getWeatherHandler)

export default router;
