import axios from 'axios';
import { io } from 'socket.io-client';

async function measureProvisioning() {
    const t0 = performance.now();

    // 1. Trigger Sandbox API
    const res = await axios.post('http://localhost/api/sandbox/create', { projectId: 'projectId' });
    const tApi = performance.now();
    const { sandboxId } = res.data;

    // 2. Poll Ready Check
    let isReady = false;
    while (!isReady && (performance.now() - t0 < 30000)) {
        try {
            const check = await axios.get(`http://${sandboxId}.agent.localhost/api/agent/ready`);
            if (check.status === 200) isReady = true;
        } catch (e) {
            await new Promise(r => setTimeout(r, 200));
        }
    }
    const tReady = performance.now();

    // 3. Connect Terminal WebSocket
    const socket = io(`http://${sandboxId}.agent.localhost`);
    await new Promise((resolve) => socket.on('connect', resolve));
    const tWs = performance.now();

    console.log(`API Latency: ${(tApi - t0).toFixed(2)} ms`);
    console.log(`Container Ready Latency: ${(tReady - tApi).toFixed(2)} ms`);
    console.log(`WebSocket Terminal Connect Latency: ${(tWs - tReady).toFixed(2)} ms`);
    console.log(`Total Provisioning Latency: ${(tWs - t0).toFixed(2)} ms`);
    socket.close();
}
measureProvisioning();
