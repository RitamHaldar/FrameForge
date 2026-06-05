# 🔄 Sandbox File Sync Agent (`sync-agent`)

The `sync-agent` is a high-performance utility container designed to run inside each isolated Kubernetes sandbox pod. Its main responsibility is to seamlessly synchronize files in the `/workspace` directory with an Amazon S3 bucket, preserving the state of the workspace across pod restarts and deployments.

---

## 🛠️ Tech Stack & Key Libraries

- **Node.js**: Execution environment.
- **`@aws-sdk/client-s3`**: AWS SDK v3 for high-performance S3 object storage communication.
- **`chokidar`**: A premium node file-watching library to listen to JIT filesystem events.
- **`dotenv`**: For loading local environment variables during development.

---

## ⚙️ How it Works

The sync agent operates in two main phases:

### 1. Initialization (Pull Phase)
Upon container boot, the agent checks the S3 bucket under the prefix `${PROJECT_ID}/`:
- **If files exist in S3**: They are downloaded and written to the local `/workspace` directory, reconstructing the user's workspace.
- **If S3 is empty**: The local workspace directory files (e.g. from the template app seed) are preserved and marked for upload.

### 2. File Watching (Push Phase)
Once initialization is complete, `chokidar` is started to monitor the `/workspace` directory:
- It listens for file additions and modifications (`add`, `change` events).
- Files are instantly uploaded to S3 under the `${PROJECT_ID}/${relativePath}` key.
- Sensitive or build-related files like `node_modules` and `.env` are automatically ignored to optimize bandwidth and storage.

---

## 🔑 Environment Variables

The container requires the following environment variables:

| Variable Name | Description | Source in Pod |
| :--- | :--- | :--- |
| `PROJECT_ID` | Unique project identifier used as the S3 prefix. | Service Controller |
| `AWS_REGION` | AWS region where the bucket resides. | `aws` Kubernetes Secret |
| `AWS_ACCESS_KEY_ID` | AWS Access Key ID. | `aws` Kubernetes Secret |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key. | `aws` Kubernetes Secret |

---

## 📁 Ignored Patterns

To prevent unnecessary uploads, the following directories and files are ignored:
- `node_modules`
- `.env`
- Dotfiles (files starting with `.`, e.g., `.git`, `.gitignore`, except when needed)
