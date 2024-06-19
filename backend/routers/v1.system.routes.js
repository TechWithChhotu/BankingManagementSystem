import express from "express";
import { addEmp, login } from "../controllers/v1_system.controller.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import isAuthorized from "../middlewares/authorization.middleware.js";
const systemRoute = express.Router();

systemRoute.post(
  "/add-employee",
  isLoggedIn,
  isAuthorized("Admin", "Founder", "Co-Founder"),
  addEmp
);
systemRoute.post("/login", login);

export default systemRoute;
