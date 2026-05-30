import { Router, type Router as ExpressRouter } from "express";
import {
  handleLogin,
  handleLogout,
  handleMe,
  handleRegister,
} from "./auth.controllers";
import { authenticate } from "./auth.middleware";

const router: ExpressRouter = Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.get("/me", authenticate, handleMe);

export default router;
