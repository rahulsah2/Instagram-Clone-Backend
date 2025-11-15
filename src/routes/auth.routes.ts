import express from "express";
import { register, login } from "../controllers/auth.controller";
import { loginValidator, registerValidator } from "../validators/auth.validator";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();

router.post("/register",registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);

export default router;
