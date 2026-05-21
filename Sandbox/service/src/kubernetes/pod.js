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
            "volumes": [
                {
                    "name": "workspace-volume",
                    "emptyDir": {}
                }
            ],
            "initContainers": [
                {
                    "name": "init-container",
                    "image": "template",
                    "imagePullPolicy": "IfNotPresent",
                    "command": ["sh", "-c", "cp -r /workspace/. /seed/"],
                    "volumeMounts": [
                        {
                            "name": "workspace-volume",
                            "mountPath": "/seed"
                        }
                    ]
                }
            ],
            "containers": [
                {
                    "name": "template",
                    "image": "template:latest",
                    "imagePullPolicy": "IfNotPresent",
                    "ports": [{ "containerPort": 5173 }],
                    "resources": {
                        "limits": { "memory": "1Gi", "cpu": "500m" },
                        "requests": { "memory": "512Mi", "cpu": "250m" }
                    },
                    "volumeMounts": [
                        {
                            "name": "workspace-volume",
                            "mountPath": "/workspace"
                        }
                    ]
                },
                {
                    "name": "agent",
                    "image": "agent:latest",
                    "imagePullPolicy": "IfNotPresent",
                    "ports": [{ "containerPort": 3000 }],
                    "resources": {
                        "limits": { "memory": "1Gi", "cpu": "500m" },
                        "requests": { "memory": "512Mi", "cpu": "250m" }
                    },
                    "volumeMounts": [
                        {
                            "name": "workspace-volume",
                            "mountPath": "/workspace"
                        }
                    ]
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