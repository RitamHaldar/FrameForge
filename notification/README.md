# FrameForge Notification Service ✉️

The Notification Service is an asynchronous, event-driven worker built on Node.js and Express.js. It acts as a dedicated consumer of authentication events, receiving high-priority tasks such as One-Time Password (OTP) verifications over a secure RabbitMQ message queue, and dispatching premium email communications utilizing Gmail's secure OAuth 2.0 API.

---

## 🛠️ Tech Stack & Architecture

- **Runtime**: Node.js v18+ (ES modules enabled)
- **Server Framework**: Express.js (v5.x)
- **Message Queue Consumer**: RabbitMQ via `amqplib` (listens to and consumes tasks from the `AUTH_NOTIFICATION_QUEUE`)
- **Email Delivery Provider**: Google APIs (`googleapis`) utilizing Gmail OAuth 2.0 for secure access token rotation
- **Logger**: Morgan (`morgan`) for structured HTTP request logging
- **Templates**: Custom high-fidelity, inline-styled HTML/CSS tables tailored to match FrameForge's premium dark-mode aesthetic

---

## 📂 Codebase Structure

```bash
├── src/
│   ├── config/             # Environment configuration & queue connection setup
│   │   ├── config.js       # Aggregation and validation of secret variables
│   │   └── queue.js        # Establishes connection to CloudAMQP and asserts the target queue
│   ├── services/           # Third-party integrations
│   │   └── mail.service.js # Gmail OAuth2 setup & MIME-base64 message builder
│   ├── template/           # Responsive email layouts
│   │   └── emailTemplate.js # High-contrast email OTP design (dark-mode theme)
│   └── app.js              # Express instantiation, healthcheck route & amqplib consumer logic
├── dockerfile              # Microservice container definition
├── server.js               # Entry point initiating local HTTP port listener on Port 3000
└── package.json            # Scripts, dependency lists, and run-time metadata
```

---

## 🔌 API & Consumer Documentation

### HTTP Endpoints
| HTTP Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/notification/health` | Public | Liveness/readiness check returning service status. |

### Message Queue Consumer
- **Queue Subscribed**: `AUTH_NOTIFICATION_QUEUE`
- **Behavior**:
  - Connects to the CloudAMQP broker on start.
  - Automatically listens for stringified payloads.
  - Parses incoming JSON payload structured as:
    ```json
    {
      "to": "user@example.com",
      "otp": "482019"
    }
    ```
  - Delegates the sending task to [mail.service.js](file:///c:/Users/RH/Desktop/FrameForge/notification/src/services/mail.service.js).
  - Explicitly invokes `channel.ack(message)` only after successful Gmail transmission to safely purge the item from the queue without risk of loss.

---

## 🔒 Secret Configuration

Create a `.env` file inside the `notification/` directory for local environment settings. These are mirrored inside [secrets.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/secrets.yml) for Kubernetes environments:

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
GOOGLE_REFRESH_TOKEN=1//your-oauth2-refresh-token-permitting-gmail-scope
EMAIL_USER=your-verified-gmail-account@gmail.com
CLOUD_AMQP_URL=amqps://your-rabbitmq-cloudamqp-instance-url
```

---

## 🚀 Execution & Setup

### Running Locally (Without Docker)

#### 1. Install dependencies
```bash
cd notification
npm install
```

#### 2. Run in Development Mode
```bash
npm run dev
```
The microservice will initiate the RabbitMQ worker loop and begin listening for incoming web health checks on port `3000` via `nodemon`.

*Note: Since both the Authentication and AI-Worker services are hardcoded to container port `3000` in their internal environments, they will clash if run concurrently on the same local network interface outside of Docker/Kubernetes. During standalone local execution, configure one of them to use an alternative port if running them at the same time.*

---

### Running in Kubernetes (via Skaffold)

Skaffold handles automatic syncing of the service. Run this from the repository root:
```bash
skaffold dev
```
Skaffold automatically synchronizes file changes inside `notification/src/**` with active containers, avoiding complete rebuild overheads.
