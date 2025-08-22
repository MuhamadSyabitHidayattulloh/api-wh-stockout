# Test Documentation

## Structure Test

```
tests/
├── setup.js                    # Test utilities dan mock helpers
├── basic.test.js               # Basic functionality tests
├── utils.test.js               # Utility functions tests
├── controllers.test.js         # Controller logic tests
├── integration.test.js         # Integration tests
├── routes/                     # Route-specific tests
│   ├── login.test.js          # Login routes tests
│   ├── regis.test.js          # Registration routes tests
│   └── warehouse.test.js      # Warehouse routes tests
├── services/                   # Service-specific tests
│   ├── AuthService.test.js    # Authentication service tests
│   └── WarehouseService.test.js # Warehouse service tests
└── integration/                # Integration tests
    └── api.test.js            # API integration tests
```

## Test Categories

### 1. Basic Tests (`basic.test.js`)
- ✅ Basic JavaScript functionality
- ✅ Mock data creation
- ✅ Environment variable validation

### 2. Utility Tests (`utils.test.js`)
- ✅ Date formatting functions
- ✅ Validation functions  
- ✅ Calculation functions
- ✅ String manipulation functions

### 3. Controller Tests (`controllers.test.js`)
- ✅ Request/Response handling
- ✅ API response formats
- ✅ Authentication logic
- ✅ Business logic validation

### 4. Integration Tests (`integration.test.js`)
- ✅ Environment setup
- ✅ Module integration
- ✅ Data flow processing

### 5. Route Tests (`routes/`)
- ✅ Login routes with mocking
- ✅ Registration routes
- ✅ Warehouse routes

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx jest tests/basic.test.js

# Run with coverage
npm run test:coverage

# Run tests for SonarQube
npm run test:sonar
```

## Coverage Goals

- **Statements**: > 20%
- **Branches**: > 20%  
- **Functions**: > 20%
- **Lines**: > 20%

## Test Philosophy

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test component interactions
3. **Mock Data**: Use consistent mock data across tests
4. **Business Logic**: Focus on testing business rules
5. **Error Handling**: Test error scenarios and edge cases

## Mock Data

All mock data is centralized in `setup.js`:
- `createMockUser()` - User data
- `createMockPartData()` - Part/inventory data  
- `createMockStockoutData()` - Stockout transaction data
- `createMockRequest()` - HTTP request objects
- `createMockResponse()` - HTTP response objects
