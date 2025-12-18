# Paddle OCR Simple Server

A simple HTTP server for running PaddleOCR text recognition with a RESTful API. This project provides an easy-to-use endpoint for extracting text from images using PaddleOCR.

## Features

- 🚀 Simple REST API for text recognition
- 🔒 Optional Bearer token authentication
- 📸 Support for multiple image formats (JPEG, PNG, GIF, WebP)
- 🐳 Docker support
- ⚡ Built with Bun and Hono for high performance

## Installation

### Using Bun

```sh
bun install
```

### Using Docker

```sh
docker pull <your-docker-hub-username>/paddle-ocr-simple-server
docker run -p 3000:3000 <your-docker-hub-username>/paddle-ocr-simple-server
```

## Configuration

Create a `.env` file in the root directory (see `.env.example`):

```env
# Bearer Token for API authentication
# If not specified, authentication is disabled
BEARER_TOKEN=your-secret-token-here
```

## Running

### Development

```sh
bun run dev
```

The server will start on `http://localhost:3000`

### Production

```sh
bun run start
```

## API Documentation

### Base URL

By default, the server runs on `http://localhost:3000`

### Authentication

If `BEARER_TOKEN` is set in the environment variables, all endpoints require Bearer token authentication:

```
Authorization: Bearer <your-token>
```

### Endpoints

#### GET `/`

Health check endpoint.

**Response:**

- **Status:** `200 OK`
- **Body:** `Hello Hono!`

**Example:**

```bash
curl http://localhost:3000/
```

---

#### POST `/recognize`

Recognizes text from an uploaded image.

**Request:**

- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `img` (file, required): Image file to process
    - Supported formats: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`
    - Maximum file size: 10MB

**Success Response:**

- **Status:** `200 OK`
- **Content-Type:** `application/json`
- **Body:** OCR recognition result (format depends on PaddleOCR service)

**Error Responses:**

| Status | Description |
|--------|-------------|
| `400 Bad Request` | Missing `img` field |
| `400 Bad Request` | `img` field is not a file |
| `400 Bad Request` | Unsupported file type |
| `400 Bad Request` | File is empty |
| `401 Unauthorized` | Invalid or missing Bearer token (if authentication is enabled) |

**Example:**

```bash
curl -X POST http://localhost:3000/recognize \
  -F "img=@/path/to/image.jpg"
```

**Example with authentication:**

```bash
curl -X POST http://localhost:3000/recognize \
  -H "Authorization: Bearer your-token-here" \
  -F "img=@/path/to/image.jpg"
```

**Example using JavaScript (fetch):**

```javascript
const formData = new FormData();
formData.append('img', fileInput.files[0]);

const response = await fetch('http://localhost:3000/recognize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-token-here' // if authentication is enabled
  },
  body: formData
});

const result = await response.json();
console.log(result);
```

## Development

### Linting

```sh
bun run lint
```

### Fix linting issues

```sh
bun run lint:fix
```

## Release

To create a new release (using [release-it](https://github.com/release-it/release-it)):

```sh
# Patch release (0.1.0 -> 0.1.1)
bun run release

# Or specify the type explicitly
bun run release:patch   # 0.1.0 -> 0.1.1
bun run release:minor   # 0.1.0 -> 0.2.0
bun run release:major   # 0.1.0 -> 1.0.0
```

This will:

1. Update the version in `package.json`
2. Create a git commit with the version change
3. Create a git tag (e.g., `v0.1.1`)
4. Push the commit and tag to the remote repository
5. Trigger GitHub Actions to build and push the Docker image to Docker Hub

## License

MIT
