import express, { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import databaseServices from './services/database.services';
import router from './routes/index.routes';
import cookieParser from 'cookie-parser';
import cors from "cors"
import fs from "fs"
import swaggerUi from "swagger-ui-express"
import YAML from "yaml"
const file = fs.readFileSync('./Ecommerce-swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

config();
const app = express();
const PORT = process.env.PORT;
app.use(cookieParser())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use(cors)
databaseServices.connect();
app.listen(PORT, () => {
  console.log(`This is http://localhost:${PORT}`)
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status).json({ error: err.message, status: err.status, path: err.path })
})

