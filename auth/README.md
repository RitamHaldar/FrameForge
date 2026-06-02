# FrameForge Authentication Service 🔐

The Authentication Service is a secure, lightweight identity management and authorization microservice built on Node.js and Express.js. It manages local email-password registration and login, handles federated Google OAuth 2.0 authentication, signs and validates session JSON Web Tokens (JWT), and manages persistent user data in MongoDB.

---

## 🛠️ Tech Stack & Architecture

- **Runtime**: Node.js v18+ (ES modules enabled)
- **Server Framework**: Express.js (v5.x)
- **Database & ORM**: MongoDB via Mongoose (`mongoose`)
- **Authentication**: Passport.js (`passport`, `passport-google-oauth20` for social federation)
- **Message Broker & Queue**: RabbitMQ via `amqplib` (publishes email OTP requests to `AUTH_NOTIFICATION_QUEUE` on CloudAMQP)
- **Security & Session Management**: 
  - `bcryptjs` for secure password hashing (10-round salt)
  - `jsonwebtoken` for issuing stateless secure JWTs (1-day expiration)
  - `cookie-parser` for reading secure, HTTP-only authentication cookies
- **Logger**: Morgan (`morgan`) for structured HTTP request logging in development


---

## 📂 Codebase Structure

```bash
├── src/
│   ├── config/             # Config loader, database connection & passport strategy setups
│   │   ├── config.js       # Environment variable aggregation
│   │   ├── db.js           # Mongoose MongoDB connection handler
│   │   ├── passport.js     # Google OAuth 2.0 Strategy initialization
│   │   └── queue.js        # RabbitMQ client connection setup & queue message publishing helper
│   ├── controllers/        # REST Route controllers
│   │   └── auth.controller.js # Local Register/Login, Google OAuth, OTP verification & get-profile callbacks
│   ├── models/             # Mongoose Database schemas
│   │   └── user.model.js   # User schema, password hashing middleware & verification checks
│   ├── routes/             # API Router definitions
│   │   └── auth.routes.js  # Mount point for auth REST routes
│   └── app.js              # Express app instantiation and middleware configuration
├── dockerfile              # Microservice Docker container instruction
├── server.js               # Entry point triggering passport, DB connection, and server listener
└── package.json            # Scripts, dependency libraries, and engine constraints
```

---

## 🔌 API Documentation

| HTTP Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/auth/healthz` | Public | Liveness/readiness check returning service status. |
| **POST** | `/api/auth/register` | Public | Registers a new user. Sends OTP via message queue, hashes password, saves to DB, sets a secure JWT cookie. |
| **POST** | `/api/auth/login` | Public | Authenticates credentials. Validates password and sets a secure JWT cookie. |
| **POST** | `/api/auth/verify-otp`| Protected | Verifies the 6-digit OTP code against the database. Sets `isVerified: true` and issues updated secure JWT cookie. |
| **GET** | `/api/auth/get-me` | Protected | Returns the current user profile (username, avatar url). |
| **POST** | `/api/auth/logout` | Public | Logs out the current user by clearing the JWT token cookie. |
| **GET** | `/api/auth/google` | Public | Redirects user to Google's consent screen for OAuth 2.0 login. |
| **GET** | `/api/auth/google/callback`| Public | Google callback handler. Registers/logs in user and redirects to frontend. |

---

## 🔒 Secret Configuration

To run locally, create an `.env` file in the service root (`auth/`). For Kubernetes production environments, these are mapped securely inside [secrets.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/secrets.yml):

```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/frameforge
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
JWT_SECRET=your-jwt-high-entropy-secret
CLOUD_AMQP_URL=amqps://your-rabbitmq-cloudamqp-instance-url
```

---

## 🚀 Execution & Setup

### Running Locally (Without Docker)

#### 1. Install dependencies
```bash
cd auth
npm install
```

#### 2. Run in Development Mode
```bash
npm run dev
```
The server will start listening on port `3000` with hot-reloads enabled via `nodemon`.

*Note: Since both the Authentication and AI-Worker services are hardcoded to container port `3000` in their internal environments, they will clash if run concurrently on the same local network interface outside of Docker/Kubernetes. During standalone local execution, configure one of them to use an alternative port if running them at the same time.*

---

### Running in Kubernetes (via Skaffold)

Skaffold handles rebuilding and hot-syncing changes inside the cluster. Just trigger development mode from the repository root:
```bash
skaffold dev
```
Skaffold listens to file changes inside `auth/src/**` and automatically syncs them into the running container without trigger-rebuilding the full Docker image.

---

## 📖 Code Documentation & JSDoc Standards

All routes, controllers, middleware, and helper functions in this microservice are documented using standard JSDoc blocks to enforce type safety and clarity. When extending the service, ensure JSDoc is present in the following format:

```javascript
/**
 * Short description of function or route.
 * 
 * @route [Method] [Endpoint] (if Express route)
 * @param {Type} paramName - Parameter description.
 * @returns {Type} Return value description.
 */
```

