import express from "express";
import {
  deposite,
  openAccount,
  withdraw,
} from "../controllers/v1.branch.controller.js";
import isAuthorized from "../middlewares/authorization.middleware.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const branchRoute = express.Router();

branchRoute.post(
  "/open-account",
  isLoggedIn,
  isAuthorized("Manager", "Teller", "Customer Service Representative", "Admin"),
  upload.single("avatar"),
  openAccount
);

branchRoute.post(
  "/deposite",
  isLoggedIn,
  isAuthorized("Manager", "Teller", "Customer Service Representative", "Admin"),
  deposite
);

branchRoute.post(
  "/withdraw",
  isLoggedIn,
  isAuthorized("Manager", "Teller", "Customer Service Representative", "Admin"),
  withdraw
);

export default branchRoute;
