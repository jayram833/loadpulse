import express from 'express';
import { WebSocketServer } from 'ws';
import bodyParser from 'body-parser';
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import http from 'http';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// ⬅️ Attach WebSocket server to the same HTTP server
const wss = new WebSocketServer({ server });

// Track connected clients
const clients = new Set();

// Middleware
const rateLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15) * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX || 1000),
});

app.use(rateLimiter);
app.use(bodyParser.json({ limit: '1mb' }));
app.use(helmet());

// Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled error', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Health check
app.get("/health", (req, res) => {
    res.send("OK");
});

// WebSocket logic
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

// POST endpoint to broadcast messages
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

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
