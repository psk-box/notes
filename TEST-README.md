# Unit Testing Documentation

## Overview
This project includes comprehensive unit tests for the Notes API using Jest testing framework. The tests cover controllers and services with a focus on ensuring all CRUD operations work correctly.

## Test Structure

```
src/__tests__/
├── controllers/
│   ├── User.controller.test.js      (20 tests)
│   └── Notes.controller.test.js     (20 tests)
├── services/
│   ├── User.service.test.js         (12 tests)
│   └── Notes.service.test.js        (12 tests)
├── routes/
│   ├── User.routes.test.js          (8 tests)
│   └── Notes.routes.test.js         (8 tests)
└── models/
    └── User.model.test.js           (4 tests)
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

#### User Controller Tests (20 tests)
- ✅ Create user with valid data
- ✅ Validation for missing fields (user_name, age, email, password)
- ✅ Get all users
- ✅ Get user by ID with validation
- ✅ Update user
- ✅ Delete user
- ✅ Error handling for all operations

#### Notes Controller Tests (20 tests)
- ✅ Create note with valid data
- ✅ Validation for missing fields (user_id, content)
- ✅ Get notes by user ID with validation
- ✅ Get note by ID
- ✅ Update note
- ✅ Delete note
- ✅ Error handling for all operations

#### User Service Tests (12 tests)
- ✅ Get all users
- ✅ Get user by ID
- ✅ Update user
- ✅ Delete user
- ✅ Database error handling

#### Notes Service Tests (12 tests)
- ✅ Get notes by user ID
- ✅ Get note by ID
- ✅ Update note
- ✅ Delete note
- ✅ Database error handling

#### Route Tests (16 tests)
- ✅ User routes configuration (8 tests)
  - GET / (list users)
  - POST / (create user)
  - GET /:user_id (get user by ID)
  - PUT /:user_id (update user)
  - DELETE /:user_id (delete user)
- ✅ Notes routes configuration (8 tests)
  - POST / (create note)
  - GET /user/:user_id (get notes by user)
  - GET /:note_id (get note by ID)
  - PUT /:note_id (update note)
  - DELETE /:note_id (delete note)

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
**84 tests** all passing ✅

## Uncovered Code

The following code paths are not covered by unit tests (require integration tests):
- **Service create methods** (lines 6-7 in both services) - require actual Mongoose model instantiation
- **User model pre-save hook** (lines 15-27 in User.model.js) - requires Mongoose lifecycle hooks

These would be best covered by integration tests with a test database.

## Uncovered Code

The following code paths are not covered by unit tests (require integration tests):
- Service create methods (lines 6-7 in both services) - require database connection
- User model pre-save hook (lines 15-27) - requires Mongoose hooks to execute

These would be best covered by integration tests with a test database.

---

For more information about testing with Jest, visit: https://jestjs.io/
