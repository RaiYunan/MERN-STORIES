import express from 'express';
import type { Express, Request, Response,NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/index';
import authRouter from "./routes/auth.route"
import userRouter from "./routes/user.route"
import { ApiError } from './utils/ApiError';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser())
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(express.static("public"));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

//Routes
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user",userRouter)


//Global Error Middleware
app.use(
  (err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        statusCode: err.statusCode,
        success: false,
        message: err.message,
        data: null,
        errors: err.errors || [],
      });
    }

    const message =
      err instanceof Error ? err.message : "Internal Server Error";

    res.status(500).json({
      statusCode: 500,
      success: false,
      message,
      data: null,
      errors: [],
    });
  }
);

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT || 8000}`);
    });

    server.on('error', (error) => {
      console.error('Server Error : ', error);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.log('MongoDB Connection failed :: ', err);
  });