import express from "express";
import cookieParser from "cookie-parser";
import userRoute from "./routers/v1_user.routes.js";
import cors from "cors";
import branchRoute from "./routers/v1.branch.routes.js";
import systemRoute from "./routers/v1.system.routes.js";
import aadharRoutes from "./Aadhar/aadhar.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"], // Include POST method
    credentials: true, // Include credentials (cookies) in the request
  })
);

app.use("/api/v1/user/", userRoute);
app.use("/api/v1/branch/", branchRoute);
app.use("/api/v1/system/", systemRoute);
app.use("/api/v1/aadhar/", aadharRoutes);

export default app;
