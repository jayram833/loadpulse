import express from 'express';
import { WebSocketServer } from 'ws';
import bodyParser from 'body-parser';
import http from 'http'; // ⬅ Combine WS + HTTP

const app = express();
const PORT = process.env.PORT || 3000;

// Create an HTTP server and attach both express and websocket to it
const server = http.createServer(app);
const wss = new WebSocketServer({ server }); // ⬅ Attach WebSocket to same server

const clients = new Set();

app.use(bodyParser.json());

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('✅ Client connected');
    clients.add(ws);

    ws.on('close', () => {
        clients.delete(ws);
        console.log('❌ Client disconnected');
    });
});

// HTTP POST endpoint
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

// Start the combined server
server.listen(PORT, () => {
    console.log(`🚀 HTTP + WebSocket server running on http://localhost:${PORT}`);
});
