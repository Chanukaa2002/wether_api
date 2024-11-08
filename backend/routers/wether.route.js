import { Router } from "express";
import {getWether} from '../controllers/wether.controller.js';
const router = Router();

router.get('/:city',getWether)

export default router;