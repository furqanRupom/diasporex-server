import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./app/routes/routes";

dotenv.config();
const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
 res.status(200).json({
  statusCode: 200,
  success: true,
  message: "DiasporeX is running!",
  data: null,
 });
});

app.use("/api/v1", router);

app.use((req: Request, res: Response, next: NextFunction) => {
 res.status(404).json({
  success: false,
  message: "Not Found",
  errorMessages: [
   {
    path: req.originalUrl,
    message: "API Not Found",
   },
  ],
 });
 next();
});

export default app;
