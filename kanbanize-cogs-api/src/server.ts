import express from 'express';
import cors from 'cors';
import { boardsRouter, loginRouter } from './api';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/login", loginRouter);
app.use("/boards", boardsRouter);

const PORT = process.env.PORT || 4549;

app.listen(PORT, () => console.log("🚀 server is running!"));
