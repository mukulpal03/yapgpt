import express, { Express } from 'express'
import chatRoutes from './modules/chat/chat.routes';

const app: Express = express();

app.use(express.json())
app.use("/api/chat", chatRoutes)

export default app;