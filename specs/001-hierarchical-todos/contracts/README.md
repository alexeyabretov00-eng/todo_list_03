# API Contracts: Hierarchical Todo Management

**Feature**: 001-hierarchical-todos  
**Version**: 1.0.0  
**Date**: 2026-02-16

## Overview

This directory contains the REST API contract specifications for the hierarchical todo management system. The API follows REST conventions with resource-oriented endpoints, standard HTTP methods, and JSON request/response payloads.

## Files

- **[api-spec.yaml](./api-spec.yaml)**: Complete OpenAPI 3.0 specification
  - Endpoint definitions
  - Request/response schemas
  - Validation rules
  - Error responses

## API Design Principles

### Resource Hierarchy

The API mirrors the data model's 3-level hierarchy:

```
/api/lists                          # Top-level lists
/api/lists/:listId/elements         # Elements within a list
/api/elements/:elementId/sub-items  # Sub-items within an element
```

### REST Conventions

-**GET**: Retrieve resources (list, single resource)
- **POST**: Create new resources
- **PUT**: Update existing resources
- **DELETE**: Remove resources

### Response Codes

- **200 OK**: Successful GET/PUT
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Validation error, limit exceeded
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Endpoint Summary

### Lists

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lists` | Get all lists |
| POST | `/api/lists` | Create list (max 20) |
| GET | `/api/lists/:listId` | Get single list |
| PUT | `/api/lists/:listId` | Update list |
| DELETE | `/api/lists/:listId` | Delete list (CASCADE) |
| PUT | `/api/lists/reorder` | Reorder all lists |

### Elements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lists/:listId/elements` | Get elements for list |
| POST | `/api/lists/:listId/elements` | Create element (max 100/list) |
| GET | `/api/elements/:elementId` | Get single element |
| PUT | `/api/elements/:elementId` | Update element |
| DELETE | `/api/elements/:elementId` | Delete element (CASCADE) |
| PUT | `/api/elements/:elementId/complete` | Toggle completion |
| PUT | `/api/elements/:elementId/move` | Move to different list |
| PUT | `/api/lists/:listId/elements/reorder` | Reorder elements in list |

### Sub-Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/elements/:elementId/sub-items` | Get sub-items for element |
| POST | `/api/elements/:elementId/sub-items` | Create sub-item (max 20/element) |
| GET | `/api/sub-items/:subItemId` | Get single sub-item |
| PUT | `/api/sub-items/:subItemId` | Update sub-item |
| DELETE | `/api/sub-items/:subItemId` | Delete sub-item |
| PUT | `/api/sub-items/:subItemId/complete` | Toggle completion |
| PUT | `/api/elements/:elementId/sub-items/reorder` | Reorder sub-items in element |

## Key Behaviors

### Cascading Deletion

Deleting a parent resource automatically deletes all children:

- Deleting a **list** deletes all **elements** and **sub-items**
- Deleting an **element** deletes all **sub-items**

Frontend should confirm with user before cascading deletes.

### Completion Cascading

From spec clarifications (FR-041):

- Marking element **complete** → automatically marks all sub-items **complete**
- Unmarking element (complete → incomplete) → sub-items **retain** their completion state

### Display Ordering

Each entity has a `displayOrder` field (integer, 0-based):

- Lists: ordered globally
- Elements: ordered within parent list
- Sub-items: ordered within parent element

Reorder endpoints accept array of IDs in desired order, update all `displayOrder` values atomically.

### Scale Limits

From spec clarifications:

- **Max 20 lists** per user (FR-037)
- **Max 100 elements** per list (FR-038)
- **Max 20 sub-items** per element (FR-039)

Backend returns `400 Bad Request` with `LIMIT_EXCEEDED` error code when exceeded.

### Query Parameters

**Optional Expansion**:
- `GET /api/lists?includeElements=true` - Include elements in response
- `GET /api/lists/:listId?includeElements=true` - Include elements for single list
- `GET /api/lists/:listId/elements?includeSubItems=true` - Include sub-items with elements
- `GET /api/elements/:elementId?includeSubItems=true` - Include sub-items for single element

Use expansion to reduce round trips when loading full hierarchy.

## Request Examples

### Create List

```http
POST /api/lists
Content-Type: application/json

{
  "name": "Work Projects"
}
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Work Projects",
  "displayOrder": 0,
  "createdAt": "2026-02-16T10:30:00.000Z"
}
```

### Create Element

```http
POST /api/lists/550e8400-e29b-41d4-a716-446655440000/elements
Content-Type: application/json

{
  "text": "Prepare presentation"
}
```

Response:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440111",
  "listId": "550e8400-e29b-41d4-a716-446655440000",
  "text": "Prepare presentation",
  "isCompleted": false,
  "displayOrder": 0,
  "createdAt": "2026-02-16T10:31:00.000Z",
  "subItemCount": 0,
  "completedSubItemCount": 0,
  "progressPercentage": 0
}
```

### Toggle Element Completion

```http
PUT /api/elements/660e8400-e29b-41d4-a716-446655440111/complete
Content-Type: application/json

{
  "isCompleted": true
}
```

Response: All sub-items automatically marked complete (FR-041)

### Reorder Lists

```http
PUT /api/lists/reorder
Content-Type: application/json

{
  "listIds": [
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440000",
    "550e8400-e29b-41d4-a716-446655440001"
  ]
}
```

Response:
```json
{
  "message": "Lists reordered successfully"
}
```

### Move Element to Different List

```http
PUT /api/elements/660e8400-e29b-41d4-a716-446655440111/move
Content-Type: application/json

{
  "targetListId": "550e8400-e29b-41d4-a716-446655440001"
}
```

## Error Responses

### Validation Error

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "name",
    "message": "Name is required"
  }
}
```

### Limit Exceeded

```json
{
  "error": "Maximum 20 lists allowed",
  "code": "LIMIT_EXCEEDED",
  "details": {
    "limit": 20,
    "current": 20
  }
}
```

### Not Found

```json
{
  "error": "List not found",
  "code": "NOT_FOUND"
}
```

## Validation Rules

### TodoList Validation

- **name**: Required, 1-500 characters
- **displayOrder**: Integer ≥ 0 (auto-assigned if not provided)
- **count limit**: Max 20 lists

### TodoElement Validation

- **text**: Required, 1-500 characters
- **isCompleted**: Boolean (default: false)
- **displayOrder**: Integer ≥ 0 (auto-assigned if not provided)
- **listId**: Must reference existing list
- **count limit**: Max 100 elements per list

### SubItem Validation

- **text**: Required, 1-500 characters
- **isCompleted**: Boolean (default: false)
- **displayOrder**: Integer ≥ 0 (auto-assigned if not provided)
- **elementId**: Must reference existing element
- **count limit**: Max 20 sub-items per element

## CORS Configuration

- **Development**: Webpack dev server proxies `/api/*` to backend (port 3001)
- **Production**: Frontend and backend served from same origin (no CORS needed)
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Accept

## API Versioning

Currently v1.0.0. Future changes:
- **Breaking changes**: Increment major version (v2.0.0), require migration
- **Additions**: Increment minor version (v1.1.0), backward compatible
- **Fixes**: Increment patch version (v1.0.1)

## Testing

See [data-model.md](../data-model.md) for TypeScript type definitions matching these contracts.

Contract tests should verify:
- Request/response structure matches OpenAPI spec
- Validation rules enforced (required fields, lengths, limits)
- Error codes and messages correct
- Cascading behaviors (delete, completion)
- displayOrder consistency after reorder operations

## Tools

**OpenAPI Tools**:
- **Swagger UI**: Interactive API documentation (http://localhost:3001/api-docs)
- **openapi-generator**: Generate TypeScript client from spec
- **Postman**: Import OpenAPI spec for manual testing

**Validation**:
- **swagger-cli**: Validate OpenAPI spec (`swagger-cli validate api-spec.yaml`)
- **openapi-validator**: Lint rules for API design best practices

## Next Steps

- Implement backend routes matching this specification
- Generate TypeScript API client from OpenAPI spec (optional)
- Setup contract tests in backend/tests/contract/
- Configure Swagger UI for interactive documentation
