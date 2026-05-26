import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = '/api';

/**
 * Start a new sandbox instance
 * POST /api/sandbox/start
 * Returns: { success, message, sandboxId, previewUrl }
 */
export const startSandbox = async () => {
    try {
        const response = await axios.post(`${API_BASE}/sandbox/start`);
        console.log('[API] Sandbox started:', response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Failed to start sandbox:', error);
        throw error;
    }
};

/**
 * Invoke AI agent with a message (SSE streaming)
 * POST /api/ai/invoke
 * Body: { message, projectId }
 * Returns: EventSource for streaming responses
 */
export const invokeAI = async (message, projectId) => {
    try {
        console.log('[API] Invoking AI:', { message, projectId });
        const response = await fetch(`${API_BASE}/ai/invoke`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, projectId }),
        });
        return response;
    } catch (error) {
        console.error('[API] Failed to invoke AI:', error);
        throw error;
    }
};

/**
 * Connect to sandbox agent via socket.io
 * Socket URL: {sandboxId}.agent.localhost
 * Events: terminal-output (receive), terminal-input (send)
 */
export const connectSocket = (sandboxId) => {
    const socketUrl = `http://${sandboxId}.agent.localhost`;
    console.log('[Socket] Connecting to:', socketUrl);

    const socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
        console.log('[Socket] Connected to agent:', sandboxId);
    });

    socket.on('disconnect', (reason) => {
        console.log('[Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
        console.error('[Socket] Connection error:', error.message);
    });

    return socket;
};

export const sendTerminalInput = (socket, input) => {
    if (socket) {
        socket.emit('terminal-input', input);
        console.log('[Terminal] Input sent:', input);
    }
};

/**
 * List files from the active sandbox workspace
 * GET http://{sandboxId}.agent.localhost/api/agent/listFiles
 */
export const fetchFileList = async (sandboxId) => {
    try {
        const response = await axios.get(`http://${sandboxId}.agent.localhost/api/agent/listFiles`);
        console.log('[API] Files list fetched:', response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Failed to fetch file list:', error);
        throw error;
    }
};

/**
 * Read file content from the active sandbox workspace
 * GET http://{sandboxId}.agent.localhost/api/agent/readFile?files={filePath}
 */
export const fetchFileContent = async (sandboxId, filePath) => {
    try {
        const response = await axios.get(`http://${sandboxId}.agent.localhost/api/agent/readFile`, {
            params: { files: filePath }
        });
        console.log('[API] File content fetched:', response.data);
        return response.data;
    } catch (error) {
        console.error('[API] Failed to fetch file content:', error);
        throw error;
    }
};
