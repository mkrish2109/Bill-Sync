# Bill-Sync Backend

## Overview

This is the backend for the Bill-Sync application. It is built with Node.js, Express, and MongoDB, and supports both local and Cloudinary image uploads.

---

## Table of Contents

- [Bill-Sync Backend](#bill-sync-backend)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Scripts](#scripts)
  - [Folder Structure](#folder-structure)
  - [API Endpoints (Sample)](#api-endpoints-sample)
  - [Contributing](#contributing)
  - [License](#license)

---

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values.
3. **Start the server:**
   ```bash
   npm run dev
   # or
   node server.js
   ```

---

## Environment Variables

| Variable              | Description                      |
| --------------------- | -------------------------------- |
| MONGODB_URI           | MongoDB connection string        |
| JWT_SECRET            | JWT secret for authentication    |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name (optional) |
| CLOUDINARY_API_KEY    | Cloudinary API key (optional)    |
| CLOUDINARY_API_SECRET | Cloudinary API secret (optional) |
| UPLOAD_TARGET         | 'local' or 'cloudinary'          |

---

## Scripts

- `npm run dev` — Start server with nodemon
- `node server.js` — Start server normally

---

## Folder Structure

```
backend/
├── app.js
├── server.js
├── config/
├── controllers/
├── cron/
├── db/
├── middlewares/
├── models/
├── routes/
├── socket/
├── uploads/
├── utils/
├── package.json
├── package-lock.json
└── .gitignore
```

---

## API Endpoints (Sample)

- `POST /api/auth/login` — User login
- `POST /api/auth/register` — User registration
- `POST /api/upload` — Upload image (local or Cloudinary)
- `DELETE /api/upload/:filename` — Delete image

> See the `routes/` folder for more endpoints and details.

---

## Contributing

- Fork the repo and create a feature branch.
- Open a pull request with a clear description.
- Follow code style and add tests where possible.

---

## License

MIT
