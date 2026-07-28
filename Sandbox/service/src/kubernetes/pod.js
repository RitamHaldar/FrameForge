import { k8sApi } from "./config.js"

/**
 * Provisions and launches a Kubernetes Pod for a sandbox.
 * 
 * @param {string} sandboxId - The unique ID of the sandbox.
 * @returns {Promise<object>} The Kubernetes API response for the created Pod.
 */
export async function createPod(sandboxId,projectId) {
    const podManifest = {
        "metadata": {
            "name": `sandbox-pod-${sandboxId}`,
            "labels": {
                sandboxId: sandboxId
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
                },
// {
                //     "name": "sync-agent",
                //     "image": "sync-agent:latest",
                //     "imagePullPolicy": "IfNotPresent",
                //     "ports": [{ "containerPort": 4000 }],
                //     "resources": {
                //         "limits": { "memory": "1Gi", "cpu": "500m" },
                //         "requests": { "memory": "512Mi", "cpu": "250m" }
                //     },
                //     "volumeMounts": [
                //         {
                //             "name": "workspace-volume",
                //             "mountPath": "/workspace"
                //         }
                //     ],
                //     "env":[
                //         {
                //             "name": "PROJECT_ID",
                //             "value": projectId
                //         },
                //         {
                //             "name": "AWS_ACCESS_KEY_ID",
                //             "valueFrom":{
                //                 "secretKeyRef":{
                //                     "name":"aws",
                //                     "key":"AWS_ACCESS_KEY_ID"
                //                 }
                //             }
                //         },
                //         {
                //             "name": "AWS_SECRET_ACCESS_KEY",
                //             "valueFrom":{
                //                 "secretKeyRef":{
                //                     "name":"aws",
                //                     "key":"AWS_SECRET_ACCESS_KEY"
                //                 }
                //             }
                //         },
                //         {
                //             "name": "AWS_REGION",
                //             "valueFrom":{
                //                 "secretKeyRef":{
                //                     "name":"aws",
                //                     "key":"AWS_REGION"
                //                 }
                //             }
                //         }
                //     ]
                // }

            ]
        }
    }

    const response = await k8sApi.createNamespacedPod({
        namespace: "default",
        body: podManifest
    })
    return response
}


/**
 * Deletes a Kubernetes Pod associated with a sandbox.
 * 
 * @param {string} sandboxId - The unique ID of the sandbox.
 * @returns {Promise<object>} The Kubernetes API response for the deleted Pod.
 */
export async function deletePod(sandboxId) {
    const response = await k8sApi.deleteNamespacedPod({
        name: `sandbox-pod-${sandboxId}`,
        namespace: "default"
    }, { gracePeriodSeconds: 0 })
    return response;
}