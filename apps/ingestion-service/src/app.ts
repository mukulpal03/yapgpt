import express, { Express } from 'express'
import cors from 'cors'
import ingestRoutes from './modules/ingest/ingest.routes';
import { ALLOWED_ORIGIN } from './config/constants';

const app: Express = express();

app.use(express.json())

app.use(cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/ingest", ingestRoutes)

export default app;
