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
- `publicationDate`: string, required, ISO 8601 date format (for example, `"2021-08-17"`)

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

Validation rules:
- A required string field is invalid if it is missing, `null`, not a string, or an empty/whitespace-only string.
- The `books` collection must have a unique index on `id` so that two concurrent create requests cannot both succeed with the same `id`.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

An author cannot be deleted while any book still references their `id`. Feature 2's `DELETE /authors/:id` must return `400` in that case (see Feature 2).

### Error Response Format
Every error response body has the shape:

    {
      "message": "<specific, human-readable reason>"
    }

Each distinct error cause below has its own exact `message` text, so a client can tell the causes apart without parsing anything beyond the status code and message string. Route sections list the exact message for each case.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

      [
        {
          "id": "b1",
          "authorId": "a1",
          "title": "Patterns of Light",
          "publicationDate": "2021-08-17"
        }
      ]

Errors:
- `500` if an unexpected server or database error occurs

      {
        "message": "Internal server error"
      }

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

      {
        "id": "b1",
        "authorId": "a1",
        "title": "Patterns of Light",
        "publicationDate": "2021-08-17"
      }

Errors:
- `404` if no book exists with that id

      {
        "message": "Book not found"
      }

- `500` if an unexpected server or database error occurs

      {
        "message": "Internal server error"
      }

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

      {
        "id": "b4",
        "authorId": "a1",
        "title": "Example Book Title",
        "publicationDate": "2026-01-15"
      }

Errors:
- `400` if a required field is missing, `null`, not a string, or an empty/whitespace-only string. The message names every field that failed.

      {
        "message": "Missing required field(s): title, publicationDate"
      }

- `400` if the `id` already exists

      {
        "message": "A book with id \"b4\" already exists"
      }

- `400` if the `authorId` does not match an existing author

      {
        "message": "No author exists with id \"a1\""
      }

- `500` if an unexpected server or database error occurs

      {
        "message": "Internal server error"
      }

#### PUT /books/:id
Purpose: Update an existing book. This is a full replacement: the request body must include every field except `id`, and any field omitted is treated as missing (not left unchanged).

The `id` field must not be sent in the body. If it is sent, it must match the `id` in the URL.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

      {
        "id": "b1",
        "authorId": "a2",
        "title": "Updated Book Title",
        "publicationDate": "2026-02-20"
      }

Errors:
- `400` if a required field is missing, `null`, not a string, or an empty/whitespace-only string. The message names every field that failed.

      {
        "message": "Missing required field(s): authorId"
      }

- `400` if the body includes an `id` that does not match the URL `id`

      {
        "message": "Request body id does not match the id in the URL"
      }

- `400` if the `authorId` does not match an existing author

      {
        "message": "No author exists with id \"a2\""
      }

- `404` if no book exists with that id

      {
        "message": "Book not found"
      }

- `500` if an unexpected server or database error occurs

      {
        "message": "Internal server error"
      }

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none (no `Content-Type` header, no JSON body)

Errors:
- `404` if no book exists with that id

      {
        "message": "Book not found"
      }

- `500` if an unexpected server or database error occurs

      {
        "message": "Internal server error"
      }

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal
Add a complete author API so books can reference real author documents. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required

Authors will use custom string ids instead of MongoDB `_id` values for route parameters, matching the `books` collection.

Validation rules:
- A required string field is invalid if it is missing, `null`, not a string, or an empty/whitespace-only string.
- The `authors` collection must have a unique index on `id` so that two concurrent create requests cannot both succeed with the same `id`.

### Relationship to Books
An author cannot be deleted while any book document still has an `authorId` matching that author's `id`. `DELETE /authors/:id` must return `400` in that case.

### Error Response Format
Every error response body has the shape:

    {
      "message": "<specific, human-readable reason>"
    }

Each distinct error cause below has its own exact `message` text, so a client can tell the causes apart without parsing anything beyond the status code and message string.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

      [
        {
          "id": "a1",
          "name": "Maya Rivera"
        }
      ]

Errors:
- `500` if an unexpected server or database error occurs

      {
        "message": "Internal server error"
      }

#### GET /authors/:id
Purpose: Return one author by its custom id.

Success:
- Status code: `200`
- Response body: the matching author object

      {
        "id": "a1",
        "name": "Maya Rivera"
      }

Errors:
- `404` if no author exists with that id

      {
        "message": "Author not found"
      }

- `500` if an unexpected server or database error occurs

      {
        "message": "Internal server error"
      }

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a3",
      "name": "Example Author Name"
    }

Success:
- Status code: `201`
- Response body: the newly created author object

      {
        "id": "a3",
        "name": "Example Author Name"
      }

Errors:
- `400` if a required field is missing, `null`, not a string, or an empty/whitespace-only string. The message names every field that failed.

      {
        "message": "Missing required field(s): name"
      }

- `400` if the `id` already exists

      {
        "message": "An author with id \"a3\" already exists"
      }

- `500` if an unexpected server or database error occurs

      {
        "message": "Internal server error"
      }

#### PUT /authors/:id
Purpose: Update an existing author. This is a full replacement: the request body must include every field except `id`, and any field omitted is treated as missing (not left unchanged).

The `id` field must not be sent in the body. If it is sent, it must match the `id` in the URL.

Request body:

    {
      "name": "Updated Author Name"
    }

Success:
- Status code: `200`
- Response body: the updated author object

      {
        "id": "a1",
        "name": "Updated Author Name"
      }

Errors:
- `400` if a required field is missing, `null`, not a string, or an empty/whitespace-only string. The message names every field that failed.

      {
        "message": "Missing required field(s): name"
      }

- `400` if the body includes an `id` that does not match the URL `id`

      {
        "message": "Request body id does not match the id in the URL"
      }

- `404` if no author exists with that id

      {
        "message": "Author not found"
      }

- `500` if an unexpected server or database error occurs

      {
        "message": "Internal server error"
      }

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none (no `Content-Type` header, no JSON body)

Errors:
- `400` if one or more books still reference this author's `id`

      {
        "message": "Cannot delete author \"a1\": still referenced by one or more books"
      }

- `404` if no author exists with that id

      {
        "message": "Author not found"
      }

- `500` if an unexpected server or database error occurs

      {
        "message": "Internal server error"
      }

### Swagger Documentation
Swagger must document every author route.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.