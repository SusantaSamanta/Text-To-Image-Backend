# Text-to-Image Backend

Backend API for **Vision Brush** — generate images from text prompts, store them on Cloudinary, and manage users, credits, and a public gallery.

## Live URL

https://text-to-image-backend-x154.onrender.com

## Technologies

- Node.js (ES Modules)
- Express 5
- MongoDB + Mongoose
- JSON Web Tokens (JWT) + cookie-parser
- Argon2 (password hashing)
- Cloudinary (image hosting)
- Clipdrop API (text-to-image generation)
- Nodemailer (email verification)
- express-rate-limit
- Docker

## Features

- Register / login with email verification
- JWT authentication via httpOnly cookies
- Generate images from prompts (credits-based)
- Save images to Cloudinary
- Public/private image toggle, gallery, and delete
- Rate limiting and input validation

## API Endpoints

Base URL: `https://text-to-image-backend-x154.onrender.com`

## Frontend Live Link

Base URL: `https://text-to-image-frontend-b7ah.onrender.com`

### Auth (`/api/user`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/register` | Register a new user |
| GET | `/api/user/register/verify-email` | Verify email |
| POST | `/api/user/login` | Login |
| GET | `/api/user/check-login` | Get current user |
| GET | `/api/user/logout` | Logout |

### Images (`/api/image`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/image/generate` | Generate an image from a prompt |
| GET | `/api/image/load-user-chats` | Load the user's images |
| POST | `/api/image/image-delete` | Delete an image |
| POST | `/api/image/public-private` | Toggle image visibility |
| GET | `/api/image/count-public-images` | Count public images |
| GET | `/api/image/send-public-images?page=1&limit=10` | List public images |

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (see `.example.env`) and fill in:

```
PORT=8000
MONGO_URL=<mongodb-connection-string>
DB_NAME=<database-name>
JWT_KEY=<secret>
FRONTEND_URL=<frontend-url>
API_BASE_URL=<backend-url>
CLIPDROP_API_KEY=<clipdrop-api-key>
CLOUD_NAME=<cloudinary-cloud-name>
API_KEY=<cloudinary-api-key>
API_SECRET=<cloudinary-api-secret>
```

3. Start the server:

```bash
npm run dev
```

The API runs at `http://localhost:8000`.

## Docker

```bash
docker build -t text-to-image-backend .
docker run --env-file .env -p 8000:8000 text-to-image-backend
```

Tip: avoid spaces and quotes around values in `.env` when using `docker run --env-file`.

## Health Check

- `GET /` — server status
- `GET /ip` — client IP (useful when running behind a proxy)
