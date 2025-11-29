# Notes API

A RESTful API for managing users and notes built with Node.js, Express, and MongoDB.

## Features

- **User Management**: Create, read, update, and delete users
- **Notes Management**: Create, read, update, and delete notes associated with users
- **Auto-incrementing User IDs**: Sequential user IDs using MongoDB counters
- **RESTful Design**: Clean and intuitive API endpoints
- **MongoDB Integration**: Mongoose ODM for database operations

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Development**: Nodemon for hot reload

## Project Structure

```
notes/
├── src/
│   ├── server.js              # Main application entry point
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── Notes.controller.js
│   │   └── User.controller.js
│   ├── models/
│   │   ├── Counter.model.js   # Auto-increment counter
│   │   ├── Notes.model.js
│   │   └── User.model.js
│   ├── routes/
│   │   ├── Notes.routes.js
│   │   └── User.routes.js
│   └── services/
│       ├── Notes.service.js
│       └── User.service.js
├── POST-API-Docs.md           # Complete API documentation
├── postman_collection.json    # Postman collection
├── postman_environment.json   # Postman environment
├── openapi.yaml               # OpenAPI 3.0 specification
└── package.json
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/psk-box/notes.git
   cd notes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/notes
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your machine:
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or using mongod directly
   mongod --dbpath /path/to/data/directory
   ```

5. **Run the application**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| POST | `/users` | Create a new user |
| GET | `/users/:user_id` | Get user by ID |
| PUT | `/users/:user_id` | Update user |
| DELETE | `/users/:user_id` | Delete user |

### Notes Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notes` | Create a new note |
| GET | `/notes/user/:user_id` | Get all notes for a user |
| GET | `/notes/:note_id` | Get note by ID |
| PUT | `/notes/:note_id` | Update note |
| DELETE | `/notes/:note_id` | Delete note |

## Usage Examples

### Create a User

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Create a Note

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "content": "My first note"
  }'
```

### Get All Notes for a User

```bash
curl -X GET http://localhost:3000/notes/user/1
```

For more examples, see [POST-API-Docs.md](./POST-API-Docs.md)

## Testing with Postman

Import the pre-configured Postman collection:

1. Open Postman
2. Click **Import** → Select `postman_collection.json`
3. Import the environment: `postman_environment.json`
4. Select "Notes API Environment" from the environment dropdown
5. Update the `baseUrl` variable if needed

## API Documentation

- **Markdown Documentation**: See [POST-API-Docs.md](./POST-API-Docs.md) for detailed API documentation with examples
- **OpenAPI Spec**: Use `openapi.yaml` with Swagger UI or other OpenAPI tools
- **Interactive Docs**: Paste `openapi.yaml` content into [Swagger Editor](https://editor.swagger.io)

## Data Models

### User Schema

```javascript
{
  user_id: Number,      // Auto-incremented, unique
  user_name: String,    // Required
  age: Number,          // Required
  email: String,        // Required, unique
  password: String,     // Required
  createdAt: Date       // Auto-generated
}
```

### Note Schema

```javascript
{
  _id: ObjectId,        // MongoDB ObjectId
  user_id: Number,      // References User.user_id
  content: String,      // Required
  createdAt: Date       // Auto-generated
}
```

## Development

### Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-reload)

### Project Architecture

This project follows a layered architecture:

- **Routes**: Define API endpoints and HTTP methods
- **Controllers**: Handle request/response logic
- **Services**: Contain business logic and data operations
- **Models**: Define MongoDB schemas and models
- **Config**: Database and application configuration

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/notes` |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**psk-box**
- GitHub: [@psk-box](https://github.com/psk-box)

## Support

For issues, questions, or contributions, please open an issue on GitHub.
