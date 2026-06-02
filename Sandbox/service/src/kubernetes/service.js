import { k8sApi } from "./config.js";

/**
 * Creates a Kubernetes Service to expose the sandbox container ports.
 * 
 * @param {string} sandboxId - The unique ID of the sandbox.
 * @returns {Promise<object>} The Kubernetes API response for the created Service.
 */
export async function createService(sandboxId) {
    const serviceManifest = {
        "metadata": {
            "name": `sandbox-service-${sandboxId}`,
            "labels": {
                "app": "sandbox-service",
                "sandboxId": sandboxId
            }
        },
        "spec": {
            "selector": {
                "sandboxId": sandboxId
            },
            "ports": [
                {
                    "name": "http",
                    "port": 80,
                    "targetPort": 5173,
                    "protocol": "TCP"
                },
                {
                    "name": "agent-http",
                    "port": 3000,
                    "targetPort": 3000,
                    "protocol": "TCP"
                }
            ],
            "type": "ClusterIP"
        }
    }

    const response = await k8sApi.createNamespacedService({
        namespace: "default",
        body: serviceManifest
    })
    return response
}

/**
 * Deletes the Kubernetes Service associated with a sandbox.
 * 
 * @param {string} sandboxId - The unique ID of the sandbox.
 * @returns {Promise<object>} The Kubernetes API response for the deleted Service.
 */
export async function deleteService(sandboxId) {
    const response = await k8sApi.deleteNamespacedService({
        name: `sandbox-service-${sandboxId}`,
        namespace: "default"
    })
    return response
}