# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal
Add an authors collection and API that supports all CRUD operations. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required

Authors will use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Books
Books will reference authors by the author's custom `id` in the book's `authorId` field. An author cannot be deleted while any books reference that author. The API will return `409` if a client tries to delete an author that still has books.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by its custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a1",
      "name": "Maya Rivera",
      "birthYear": 1984
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing or invalid
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author. The request body contains the author's complete editable data; the route id is unchanged.

Request body:

    {
      "name": "Maya Rivera",
      "birthYear": 1985
    }

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing or invalid
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author that has no books referencing it.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if one or more books still reference the author
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every author route.

## Specification Evaluation

### 1. Bugs or short-sighted decisions
- Version 1 does not define precise validation rules for strings, ids, dates, or birth years. Different implementations could accept different data.
- It does not say whether PUT is a full replacement or a partial update. Version 1 treats it as a full update of all editable fields and keeps the route id unchanged.
- Returning all records could become inefficient for a large collection. This project is expected to contain a small course dataset, so pagination is deferred.
- A book's author reference is not enforced automatically by MongoDB. Book creation and updates must check that the author exists, and author deletion must check for references.

### 2. Security considerations
- Never use a request body directly as a MongoDB query or update document. Validate expected fields and construct database operations from those fields.
- Reject malformed or unexpected input, avoid exposing database errors or stack traces, and keep MongoDB credentials out of source control.
- Require the relationship checks so clients cannot create a book with an unknown author or delete an author that is still in use.

### 3. Efficiency concerns
- The API returns all records without pagination. This is acceptable for the small assignment dataset, but should be revisited if the collections grow.
- Checking author references on each book create/update and before author deletion adds database reads. This is acceptable for this project and preserves relationship integrity.

### 4. Unclear response examples or error behavior
- Version 1 does not define a consistent JSON shape for errors. Version 2 uses `{"message":"..."}` for every JSON error response and no body for successful `204` deletes.
- Version 1 does not distinguish invalid input from an identifier conflict. Version 2 uses `400` for invalid request data and `409` for duplicate ids or an author that cannot be deleted because it is referenced.
- Version 1 does not specify behavior for unsupported content types, extra fields, or malformed dates. Version 2 defines these validation outcomes.

## Books API Week 02 Spec - Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the Week 01 Books API so each book references an author and the API supports all CRUD operations. Every route must be documented and testable in Swagger.

### Data Model
Book documents are stored in the `books` collection. Each book has exactly these API fields:
- `id`: required custom string id, 1-50 characters; letters, numbers, `_`, and `-` are allowed
- `authorId`: required string matching the custom `id` of an existing author
- `title`: required, non-empty trimmed string, at most 300 characters
- `publicationDate`: required valid ISO 8601 calendar date in `YYYY-MM-DD` form

MongoDB `_id` is internal and is not used for API route parameters or returned as an API field. The API returns `authorId`, not an embedded author object.

### Validation and Relationship Rules
- JSON request bodies must contain the required fields for the operation. Reject missing, incorrectly typed, empty, malformed, or unexpected fields with `400`.
- Create and update must reject a book whose `authorId` does not identify an existing author, using `400`.
- Create must reject an already-used custom `id` with `409`.
- PUT is a full update: all editable fields (`authorId`, `title`, and `publicationDate`) are required. The `id` comes only from the path and cannot be changed.
- Request bodies must use `Content-Type: application/json`; otherwise return `415`.
- Do not pass client-supplied objects directly into MongoDB filters or update operators. Return generic error messages, not database details or stack traces.

### Routes

#### GET /books
Return all books.

- `200`: JSON array of book objects.
- `500`: `{"message":"Internal server error"}` for an unexpected server or database error.

#### GET /books/:id
Return the book matching the custom id.

- `200`: the matching book object.
- `404`: `{"message":"Book not found"}` if no book has that id.
- `500`: `{"message":"Internal server error"}` for an unexpected server or database error.

#### POST /books
Create a book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

- `201`: the created book object.
- `400`: `{"message":"Invalid book data"}` for missing, invalid, or unexpected fields, or an unknown `authorId`.
- `409`: `{"message":"Book id already exists"}` if the custom id is already in use.
- `415`: `{"message":"Content-Type must be application/json"}` if the request is not JSON.
- `500`: `{"message":"Internal server error"}` for an unexpected server or database error.

#### PUT /books/:id
Replace the editable fields of an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

- `200`: the updated book object, including its unchanged custom `id`.
- `400`: `{"message":"Invalid book data"}` for missing, invalid, or unexpected fields, or an unknown `authorId`.
- `404`: `{"message":"Book not found"}` if no book has the route id.
- `415`: `{"message":"Content-Type must be application/json"}` if the request is not JSON.
- `500`: `{"message":"Internal server error"}` for an unexpected server or database error.

#### DELETE /books/:id
Delete the book matching the custom id.

- `204`: no response body when the book is deleted.
- `404`: `{"message":"Book not found"}` if no book has that id.
- `500`: `{"message":"Internal server error"}` for an unexpected server or database error.

### Swagger Documentation
Document all book routes, path parameters, request bodies, response schemas, and the statuses described above. Swagger must allow users to try each route.

### Deployment Expectations
Verify all book operations locally and on Render. The deployed `/api-docs` page must document and allow testing each route.

## Feature 2: Author CRUD Operations

### Goal
Add an authors collection and API that supports all CRUD operations. Every route must be documented and testable in Swagger.

### Data Model
Author documents are stored in the `authors` collection. Each author has exactly these API fields:
- `id`: required custom string id, 1-50 characters; letters, numbers, `_`, and `-` are allowed
- `name`: required, non-empty trimmed string, at most 200 characters
- `birthYear`: required integer from `0` through the current year, inclusive

MongoDB `_id` is internal and is not used as an API route parameter or returned as an API field.

### Validation and Relationship Rules
- JSON request bodies must contain the required fields for the operation. Reject missing, incorrectly typed, invalid, or unexpected fields with `400`.
- Create must reject an already-used custom author id with `409`.
- PUT is a full update: `name` and `birthYear` are required. The author `id` comes only from the path and cannot be changed.
- An author cannot be deleted while any book has a matching `authorId`; return `409` and leave both collections unchanged.
- Request bodies must use `Content-Type: application/json`; otherwise return `415`.
- Do not pass client-supplied objects directly into MongoDB filters or update operators. Return generic error messages, not database details or stack traces.

### Routes

#### GET /authors
Return all authors.

- `200`: JSON array of author objects.
- `500`: `{"message":"Internal server error"}` for an unexpected server or database error.

#### GET /authors/:id
Return the author matching the custom id.

- `200`: the matching author object.
- `404`: `{"message":"Author not found"}` if no author has that id.
- `500`: `{"message":"Internal server error"}` for an unexpected server or database error.

#### POST /authors
Create an author.

Request body:

    {
      "id": "a1",
      "name": "Maya Rivera",
      "birthYear": 1984
    }

- `201`: the created author object.
- `400`: `{"message":"Invalid author data"}` for missing, invalid, or unexpected fields.
- `409`: `{"message":"Author id already exists"}` if the custom id is already in use.
- `415`: `{"message":"Content-Type must be application/json"}` if the request is not JSON.
- `500`: `{"message":"Internal server error"}` for an unexpected server or database error.

#### PUT /authors/:id
Replace the editable fields of an existing author.

Request body:

    {
      "name": "Maya Rivera",
      "birthYear": 1985
    }

- `200`: the updated author object, including its unchanged custom `id`.
- `400`: `{"message":"Invalid author data"}` for missing, invalid, or unexpected fields.
- `404`: `{"message":"Author not found"}` if no author has the route id.
- `415`: `{"message":"Content-Type must be application/json"}` if the request is not JSON.
- `500`: `{"message":"Internal server error"}` for an unexpected server or database error.

#### DELETE /authors/:id
Delete the author matching the custom id only if no books reference it.

- `204`: no response body when the author is deleted.
- `404`: `{"message":"Author not found"}` if no author has that id.
- `409`: `{"message":"Author has books and cannot be deleted"}` if at least one book references the author; do not delete the author or any books.
- `500`: `{"message":"Internal server error"}` for an unexpected server or database error.

### Swagger Documentation
Document all author routes, path parameters, request bodies, response schemas, and the statuses described above. Swagger must allow users to try each route.

### Deployment Expectations
Verify all author operations locally and on Render. The deployed `/api-docs` page must document and allow testing each route.
