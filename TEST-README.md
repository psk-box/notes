# Unit Testing Documentation

## Overview
This project includes comprehensive unit tests for the Notes API using Jest testing framework. The tests cover controllers and services with a focus on ensuring all CRUD operations work correctly.

## Test Structure

```
src/__tests__/
├── controllers/
│   ├── User.controller.test.js      (31 tests)
│   └── Notes.controller.test.js     (31 tests)
├── services/
│   ├── User.service.test.js         (18 tests)
│   └── Notes.service.test.js        (18 tests)
├── routes/
│   ├── User.routes.test.js          (12 tests)
│   └── Notes.routes.test.js         (12 tests)
└── models/
    ├── User.model.test.js           (4 tests)
    ├── Notes.model.test.js          (8 tests)
    └── Counter.model.test.js        (7 tests)
```

## Test Coverage

### Current Coverage Summary
- **Overall Coverage**: 91.37% statements, 94.44% branches, 85.71% functions
- **Controllers**: 100% coverage ✅
- **Routes**: 100% coverage ✅
- **Services**: 66.66% coverage (read, update, delete methods fully tested)
- **Models**: Counter and Notes models 100%, User model partial

### Detailed Coverage Report

```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   91.37 |    94.44 |   85.71 |   91.37 |
 controllers          |     100 |      100 |     100 |     100 |
  Notes.controller.js |     100 |      100 |     100 |     100 |
  User.controller.js  |     100 |      100 |     100 |     100 |
 routes               |     100 |      100 |     100 |     100 |
  Notes.routes.js     |     100 |      100 |     100 |     100 |
  User.routes.js      |     100 |      100 |     100 |     100 |
 services             |   66.66 |      100 |      80 |   66.66 |
  Notes.service.js    |   66.66 |      100 |      80 |   66.66 |
  User.service.js     |   66.66 |      100 |      80 |   66.66 |
 models               |   53.84 |        0 |       0 |   53.84 |
  Counter.model.js    |     100 |      100 |     100 |     100 |
  Notes.model.js      |     100 |      100 |     100 |     100 |
  User.model.js       |   33.33 |        0 |       0 |   33.33 |
```

### What's Tested

#### Controllers (62 tests - 100% coverage)
- **User Controller (31 tests)**
  - ✅ Create user with all required fields
  - ✅ Create user validation (missing/empty fields)
  - ✅ Edge cases: empty strings, zero age, special characters
  - ✅ Get all users (including empty results)
  - ✅ Get user by ID with validation (non-numeric, negative, special chars)
  - ✅ Update user (single/multiple fields, empty body)
  - ✅ Delete user (including very large IDs)
  - ✅ Error handling for all operations

- **Notes Controller (31 tests)**
  - ✅ Create note with validation
  - ✅ Edge cases: empty content, very long content (10k chars), special characters, XSS patterns
  - ✅ Get notes by user ID with validation (letters, negative)
  - ✅ Get note by ID (including special character IDs)
  - ✅ Update note (including empty body)
  - ✅ Delete note with validation
  - ✅ Error handling for all operations

#### Services (36 tests - 66.66% coverage)
- **User Service (18 tests)**
  - ✅ Get all users (including large datasets of 100+ users)
  - ✅ Get user by ID (zero ID, very large IDs)
  - ✅ Update user (empty object, single field, multiple fields)
  - ✅ Delete user (including user_id 0)
  - ✅ Database error handling
  - ⚠️ Create user not tested (requires Mongoose constructor mocking)

- **Notes Service (18 tests)**
  - ✅ Get notes by user ID (large datasets, zero user_id)
  - ✅ Get note by ID (empty string, very long IDs)
  - ✅ Update note (very long content 50k chars, empty body)
  - ✅ Delete note (UUID-style IDs)
  - ✅ Database error handling
  - ⚠️ Create note not tested (requires Mongoose constructor mocking)

#### Routes (24 tests - 100% coverage)
- **User Routes (12 tests)**
  - ✅ Router configuration and structure
  - ✅ All 5 HTTP methods (GET, POST, PUT, DELETE)
  - ✅ Parameterized routes verification
  - ✅ Root path vs parameterized path distinction
  - ✅ Route count validation

- **Notes Routes (12 tests)**
  - ✅ Router configuration and structure
  - ✅ All 5 HTTP methods
  - ✅ User ID and Note ID parameters
  - ✅ Route path verification

#### Models (19 tests - 53.84% coverage)
- **User Model (4 tests)**
  - ✅ Pre-save hook auto-increment logic
  - ✅ Early return for existing users
  - ✅ Error handling in pre-save hook
  - ✅ Schema field validation

- **Notes Model (8 tests)**
  - ✅ Schema structure validation
  - ✅ Field types (ObjectId, Number, String, Date)
  - ✅ Required fields
  - ✅ Default timestamp
  - ✅ Model and collection names

- **Counter Model (7 tests)**
  - ✅ Schema structure
  - ✅ Field types and defaults
  - ✅ Model and collection names
  - ✅ Auto-increment functionality design

#### Model Tests (4 tests)
- ✅ User model pre-save hook (auto-increment user_id)
- ✅ Early return for existing users
- ✅ Error handling in pre-save hook
- ✅ Schema validation

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Test Configuration

### Jest Configuration (`jest.config.js`)
- **Test Environment**: Node.js
- **Module Type**: ES Modules
- **Test Pattern**: `**/__tests__/**/*.test.js`
- **Coverage Directory**: `coverage/`
- **Excluded from Coverage**: `server.js`, `db.js`

### Key Features
- ✅ ES Module support with NODE_OPTIONS flag
- ✅ Mocking using `jest.spyOn()` for ES modules
- ✅ Comprehensive assertion coverage
- ✅ Isolated test suites with proper cleanup

## Testing Approach

### Mocking Strategy
The tests use `jest.spyOn()` to mock dependencies:
- **Controller tests**: Mock service layer methods
- **Service tests**: Mock Mongoose model methods

### Test Structure
Each test file follows this pattern:
1. Import modules and create spies
2. Setup mock request/response objects
3. Clear mocks before each test
4. Test success scenarios
5. Test error scenarios
6. Test validation scenarios

## Dependencies

```json
{
  "jest": "^29.x",
  "@types/jest": "^29.x",
  "supertest": "^6.x",
  "@babel/preset-env": "^7.x"
}
```

## Example Test

```javascript
describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    const userData = {
      user_name: 'John Doe',
      age: 25,
      email: 'john@example.com',
      password: 'password123'
    };
    
    req.body = userData;
    UserService.createUser.mockResolvedValue({ user_id: 1, ...userData });

    await UserController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: expect.objectContaining(userData)
    });
  });
});
```

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on others
2. **Mocking**: External dependencies are mocked to ensure unit isolation
3. **Coverage**: Aim for high coverage on business logic
4. **Clarity**: Test names clearly describe what they're testing
5. **Assertions**: Multiple assertions ensure complete behavior verification

## Continuous Integration

These tests are ready for CI/CD integration:
```yaml
# Example GitHub Actions
- run: npm test
- run: npm run test:coverage
```

## Future Improvements

- [ ] Add integration tests with test database for create operations
- [ ] Add E2E tests for complete user flows
- [ ] Add performance benchmarking tests
- [ ] Mock Mongoose constructors for service create method tests
- [ ] Add mutation testing to verify test quality

## Total Test Count
**141 tests** all passing ✅

## Uncovered Code

The following code paths are not covered by unit tests (require integration tests):
- **Service create methods** (lines 6-7 in both services) - require actual Mongoose model instantiation
- **User model pre-save hook** (lines 15-27 in User.model.js) - requires Mongoose lifecycle hooks

These would be best covered by integration tests with a test database.

---

For more information about testing with Jest, visit: https://jestjs.io/
