import axios from 'axios';

const API_BASE = '/api';

export const startSandbox = async () => {
  const response = await axios.post(`${API_BASE}/sandbox/start`);
  return response.data;
};

export const invokeAi = async (message, projectId, agentNo, onEvent) => {
  try {
    const response = await fetch(`${API_BASE}/ai/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, projectId, agentNo }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (!response.body || typeof response.body.getReader !== 'function') {
      throw new Error('ReadableStream not supported by response body or browser.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // Split on double newline (SSE event boundary)
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';

      for (const part of parts) {
        // Each SSE event may have multiple lines; find the data: line
        for (const line of part.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const raw = trimmed.slice(5).trim(); // strip 'data: '
          if (!raw) continue;
          // The server JSON.stringify-encodes the chunk — unwrap it
          let text = raw;
          try {
            const parsed = JSON.parse(raw);
            text = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
          } catch {
            // not valid JSON, use as-is
          }
          onEvent(text);
        }
      }
    }
  } catch (error) {
    console.error("Error in invokeAi:", error);
    onEvent("Error: AI invocation failed");
  }
};

export const listFiles = async (sandboxId) => {
  const response = await axios.get(`http://${sandboxId}.agent.localhost/api/agent/listFiles`);
  return response.data;
};

export const readFileContent = async (sandboxId, filePath) => {
  const response = await axios.get(`http://${sandboxId}.agent.localhost/api/agent/readFile`, {
    params: { files: filePath }
  });
  return response.data;
};

export const updateFileContent = async (sandboxId, filePath, content) => {
  const response = await axios.patch(`http://${sandboxId}.agent.localhost/api/agent/updateFile`, {
    updates: [
      { file: filePath, content: content }
    ]
  });
  return response.data;
};
