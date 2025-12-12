import express, { Request, Response } from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import 'dotenv/config';

// Firebase Admin 초기화
const serviceAccount = {
	projectId: process.env.FIREBASE_PROJECT_ID,
	clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
	privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

app.get('/health', (_req: Request, res: Response) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
	console.log(`🚀 Server is running on port ${PORT}`);
});
