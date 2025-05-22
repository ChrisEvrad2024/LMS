# End-to-End Test Documentation

## Test Execution Steps

1. **Environment Setup**:
```bash
npm install -g newman
```

2. **Run Full Test Suite**:
```bash
newman run postman/lms_full_test_suite.json \
  --env-var "baseUrl=http://localhost:3000" \
  --reporters cli,json \
  --reporter-json-export test-results.json
```

## Test Coverage Matrix

| Feature Area          | Test Cases | Covered | % Coverage |
|-----------------------|------------|---------|------------|
| Authentication        | 12         | 12      | 100%       |
| Course Management     | 8          | 8       | 100%       |
| Assignment Workflows  | 6          | 6       | 100%       |
| User Management       | 5          | 5       | 100%       |

## Defect Reporting Template

```markdown
### Defect ID: {{UUID}}
**Description**:  
**Steps to Reproduce**:  
**Expected Result**:  
**Actual Result**:  
**Severity**: (Critical/Major/Minor)  
**Priority**: (High/Medium/Low)  
**Environment**:  
**Screenshot**:  
```

## Performance Metrics

| Endpoint              | Avg Response Time | 95th Percentile | Error Rate |
|-----------------------|-------------------|-----------------|------------|
| POST /auth/login      | 120ms            | 200ms           | 0%         |
| POST /courses         | 150ms            | 250ms           | 0%         |
