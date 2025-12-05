import express from 'express';
import type { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/index';

dotenv.config();

const app: Express = express();
app.use(cors());
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