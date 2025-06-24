import express from 'express';
import { WebSocketServer } from 'ws';
import bodyParser from 'body-parser';
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import http from 'http';
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const clients = new Set();

const rateLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15) * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX || 1000),
});

app.use(rateLimiter);
app.use(bodyParser.json({ limit: '1mb' }));
app.use(helmet());

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

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
