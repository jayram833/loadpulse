import express from 'express';
import { WebSocketServer } from 'ws';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;
const WSS_PORT = 8080;

app.use(bodyParser.json());

// Set of connected WebSocket clients
const clients = new Set();

// WebSocket Server
const wss = new WebSocketServer({ port: WSS_PORT });

wss.on('connection', (ws) => {
    console.log('✅ Client connected');
    clients.add(ws);

    ws.on('close', () => {
        clients.delete(ws);
        console.log('❌ Client disconnected');
    });
});

// HTTP Endpoint for Bots to send messages
app.post('/send', (req, res) => {
    const { channel, content } = req.body;
    const message = {
        channel: channel || 'default',
        content,
        timestamp: Date.now()
    };

    // Broadcast to all WebSocket clients
    clients.forEach(ws => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(message));
        }
    });

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 HTTP server running at http://localhost:${PORT}`);
});

console.log(`🌐 WebSocket server running on ws://localhost:${WSS_PORT}`);
