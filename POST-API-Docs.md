# POST API Documentation

This document covers POST endpoints implemented in the project routes:
- `src/routes/User.routes.js` — POST `/` (create user)
- `src/routes/Notes.routes.js` — POST `/` (create note)

Adjust the base path used by your Express app (for example, `/users` or `/notes`) as configured in `server.js`.

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
