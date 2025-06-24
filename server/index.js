import express from 'express';
import { WebSocketServer } from 'ws';
import bodyParser from 'body-parser';
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import https from 'https';
import dotenv from "dotenv";
import fs from 'fs';

dotenv.config();

const app = express();

const HTTPS_PORT = process.env.HTTPS_PORT || 443;

const privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
const certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials, app);

const wss = new WebSocketServer({ server });

const clients = new Set();


const rateLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15) * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX || 1000),
});

app.use(rateLimiter);
app.use(bodyParser.json({ limit: '1mb' }));
app.use(helmet());

// ✅ Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled error', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.get("/health", (req, res) => {
    res.send("OK");
});

wss.on('connection', (ws) => {
    console.log('✅ Client connected');
    clients.add(ws);

    ws.on('close', () => {
        clients.delete(ws);
        console.log('❌ Client disconnected');
    });

    ws.on('error', (err) => {
        console.error('WebSocket error', err);
        clients.delete(ws);
    });
});

app.post('/send', (req, res) => {
    const message = { content: req.body };
    console.log("Message body", message);

    clients.forEach(ws => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(message));
        }
    });
    res.json({ success: true });
});

server.listen(HTTPS_PORT, () => {
    console.log(`🚀 HTTPS + WebSocket server running on https://localhost:${HTTPS_PORT}`);
});
