import { k8sApi } from "./config.js"

export async function createPod(sandboxId) {
    const podManifest = {
        "metadata": {
            "name": `sandbox-pod-${sandboxId}`,
            "labels": {
                "app": "sandbox-pod",
                "sandboxId": sandboxId
            }
        },
        "spec": {
            "containers": [
                {
                    "name": "template",
                    "image": "template:latest",
                    "imagePullPolicy": "IfNotPresent",
                    "ports": [{ "containerPort": 5173 }],
                    "resources": {
                        "limits": { "memory": "1Gi", "cpu": "500m" },
                        "requests": { "memory": "512Mi", "cpu": "250m" }
                    }
                }
            ]
        }
    }

    const response = await k8sApi.createNamespacedPod({
        namespace: "default",
        body: podManifest
    })
    return response
}