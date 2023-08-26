import express, { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import databaseServices from './services/database.services';
import router from './routes/index.routes';
import cookie from "cookie-parser"
import cookieParser from 'cookie-parser';



config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser())
databaseServices.connect();
app.listen(PORT, () => {
  console.log(`This is http://localhost:${PORT}`)
})
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  res.status(err.status).json({ error: err.message, status: err.status })
})
app.use('/api', router) 
