# API Documentation

This document covers all API endpoints implemented in the project routes:
- `src/routes/User.routes.js` — User endpoints (GET, POST, PUT, DELETE)
- `src/routes/Notes.routes.js` — Notes endpoints (GET, POST, PUT, DELETE)

Adjust the base path used by your Express app (for example, `/users` or `/notes`) as configured in `server.js`.

---

## User Endpoints

### Get All Users

- **Method:** GET
- **Path:** `/users`
- **Description:** Retrieve all users from the database.

#### Successful Response
- **Status:** `200 OK`

```json
[
  {
    "_id": "6929f28db4bdbd959d7a59b7",
    "user_id": 1,
    "user_name": "testuser",
    "age": 25,
    "email": "testuser@example.com",
    "password": "password123",
    "createdAt": "2025-11-28T19:05:49.888Z"
  }
]
```

#### Curl example

```bash
curl -X GET http://localhost:3000/users
```

---

### Get User By ID

- **Method:** GET
- **Path:** `/users/:user_id`
- **Description:** Retrieve a specific user by their user_id.

#### Successful Response
- **Status:** `200 OK`

```json
{
  "_id": "6929f28db4bdbd959d7a59b7",
  "user_id": 1,
  "user_name": "testuser",
  "age": 25,
  "email": "testuser@example.com",
  "password": "password123",
  "createdAt": "2025-11-28T19:05:49.888Z"
}
```

#### Common Error Responses
- `404 Not Found` — user_id does not exist
- `500 Internal Server Error` — unexpected server error

#### Curl example

```bash
curl -X GET http://localhost:3000/users/1
```

---

## Create User

- **Method:** POST
- **Path:** `/users` (or the mount path used in your app)
- **Headers:** `Content-Type: application/json`
- **Description:** Create a new user record.

### Request Body (example)

```json
{
  "user_name": "Jane Doe",
  "age": 30,
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

> Note: Replace fields with the actual schema used by `User.model.js` if different.

### Successful Response (example)
- **Status:** `201 Created` (common) or `200 OK` depending on implementation

```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "user_name": "Jane Doe",
    "age": 30,
    "email": "jane@example.com",
    "createdAt": "2025-11-29T12:34:56.789Z"
  }
}
```

### Common Error Responses
- `400 Bad Request` — missing/invalid fields
- `409 Conflict` — email already exists (unique constraint)
- `500 Internal Server Error` — unexpected server error

### Curl example

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"securePassword123"}'
```

If your API requires authentication for creating users (e.g., admin-only), add an `Authorization: Bearer <token>` header.

---

### Update User

- **Method:** PUT
- **Path:** `/users/:user_id`
- **Headers:** `Content-Type: application/json`
- **Description:** Update an existing user's information.

#### Request Body (example)

```json
{
  "user_name": "Jane A. Doe",
  "age": 31,
  "email": "jane.updated@example.com"
}
```

> Note: You can update any combination of `user_name`, `age`, `email`, or `password`.

#### Successful Response
- **Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "user_name": "Jane A. Doe",
    "age": 31,
    "email": "jane.updated@example.com",
    "createdAt": "2025-11-29T12:34:56.789Z"
  }
}
```

#### Common Error Responses
- `400 Bad Request` — missing/invalid fields
- `404 Not Found` — user_id does not exist
- `500 Internal Server Error` — unexpected server error

#### Curl example

```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"user_name":"Jane A. Doe","age":31}'
```

---

### Delete User

- **Method:** DELETE
- **Path:** `/users/:user_id`
- **Description:** Delete a user from the database.

#### Successful Response
- **Status:** `200 OK`

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### Common Error Responses
- `404 Not Found` — user_id does not exist
- `500 Internal Server Error` — unexpected server error

#### Curl example

```bash
curl -X DELETE http://localhost:3000/users/1
```

---

## Notes Endpoints

### Get Notes By User ID

- **Method:** GET
- **Path:** `/notes/user/:user_id`
- **Description:** Retrieve all notes associated with a specific user.

#### Successful Response
- **Status:** `200 OK`

```json
[
  {
    "_id": "692a0e573152dbadbc73740e",
    "user_id": 1,
    "content": "Test note from curl - Eggs, milk, bread",
    "createdAt": "2025-11-28T21:04:23.064Z"
  }
]
```

#### Common Error Responses
- `404 Not Found` — user_id does not exist or no notes found
- `500 Internal Server Error` — unexpected server error

#### Curl example

```bash
curl -X GET http://localhost:3000/notes/user/1
```

---

### Get Note By ID

- **Method:** GET
- **Path:** `/notes/:note_id`
- **Description:** Retrieve a specific note by its MongoDB ObjectId.

#### Successful Response
- **Status:** `200 OK`

```json
{
  "_id": "692a0e573152dbadbc73740e",
  "user_id": 1,
  "content": "Test note from curl - Eggs, milk, bread",
  "createdAt": "2025-11-28T21:04:23.064Z"
}
```

#### Common Error Responses
- `404 Not Found` — note_id does not exist
- `500 Internal Server Error` — unexpected server error

#### Curl example

```bash
curl -X GET http://localhost:3000/notes/692a0e573152dbadbc73740e
```

---

## Create Note

- **Method:** POST
- **Path:** `/notes` (or the mount path used in your app)
- **Headers:** `Content-Type: application/json`
- **Description:** Create a new note associated with a user.

### Request Body (example)

```json
{
  "user_id": 1,
  "content": "Eggs, milk, bread"
}
```

> Note: Use the actual fields from `Notes.model.js`. At minimum include `user_id`, `title`, and `content` if that's required by your schema.

### Successful Response (example)
- **Status:** `201 Created` (common) or `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "64b2c3d...",
    "user_id": 1,
    "content": "Eggs, milk, bread",
    "createdAt": "2025-11-29T12:34:56.789Z"
  }
}
```

### Common Error Responses
- `400 Bad Request` — missing/invalid fields
- `404 Not Found` — referenced `user_id` not found (if you validate existence)
- `500 Internal Server Error` — unexpected server error

### Curl example

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"user_id":"643f1a2b...","title":"Shopping list","content":"Eggs, milk, bread"}'
```

If your notes endpoint requires authentication, include `-H "Authorization: Bearer <token>"` in the curl command.

---

### Update Note

- **Method:** PUT
- **Path:** `/notes/:note_id`
- **Headers:** `Content-Type: application/json`
- **Description:** Update an existing note's content.

#### Request Body (example)

```json
{
  "content": "Eggs, milk, bread, and butter"
}
```

#### Successful Response
- **Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "692a0e573152dbadbc73740e",
    "user_id": 1,
    "content": "Eggs, milk, bread, and butter",
    "createdAt": "2025-11-28T21:04:23.064Z"
  }
}
```

#### Common Error Responses
- `400 Bad Request` — missing/invalid content
- `404 Not Found` — note_id does not exist
- `500 Internal Server Error` — unexpected server error

#### Curl example

```bash
curl -X PUT http://localhost:3000/notes/692a0e573152dbadbc73740e \
  -H "Content-Type: application/json" \
  -d '{"content":"Eggs, milk, bread, and butter"}'
```

---

### Delete Note

- **Method:** DELETE
- **Path:** `/notes/:note_id`
- **Description:** Delete a note from the database.

#### Successful Response
- **Status:** `200 OK`

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

#### Common Error Responses
- `404 Not Found` — note_id does not exist
- `500 Internal Server Error` — unexpected server error

#### Curl example

```bash
curl -X DELETE http://localhost:3000/notes/692a0e573152dbadbc73740e
```

---

## Summary

### User Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | Get all users |
| POST | `/users` | Create a new user |
| GET | `/users/:user_id` | Get user by ID |
| PUT | `/users/:user_id` | Update user |
| DELETE | `/users/:user_id` | Delete user |

### Notes Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/notes` | Create a new note |
| GET | `/notes/user/:user_id` | Get all notes for a user |
| GET | `/notes/:note_id` | Get note by ID |
| PUT | `/notes/:note_id` | Update note |
| DELETE | `/notes/:note_id` | Delete note |

---

## Tips & Integration Notes

- Confirm the base mount paths in `server.js` (for example `app.use('/users', userRoutes)`), then use the full path when testing.
- If the controllers return different response shapes (for example `error` vs `success` keys), update the examples above to match your implementation.
- If using validation middleware (e.g., `express-validator`), document the required fields and validation rules here.
- Add sample Postman collection or OpenAPI spec if you want interactive docs or tooling integration.

### Field notes (from models)

- `User` (`src/models/User.model.js`):
  - `user_id`: Number, required, unique — auto-incremented by `Counter.model.js` pre-save hook.
  - `user_name`: String, required.
  - `age`: Number, required.
  - `email`: String, required, unique.
  - `password`: String, required.
  - `createdAt`: Date, defaults to now.

- `Notes` (`src/models/Notes.model.js`):
  - `_id`/`id`: ObjectId (auto-generated).
  - `user_id`: Number, required — should reference `User.user_id` value.
  - `content`: String, required.
  - `createdAt`: Date, defaults to now.

---

## Where these routes live

- Users routes: `src/routes/User.routes.js`
- Notes routes: `src/routes/Notes.routes.js`
- Controllers: `src/controllers/User.controller.js`, `src/controllers/Notes.controller.js`

Update this document to reflect any differences between these examples and your actual models/controllers.
