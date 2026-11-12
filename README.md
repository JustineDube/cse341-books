# CSE 341 Books API

An Express web service that provides CRUD APIs for books and authors, backed by MongoDB.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI` to your MongoDB connection string and keep it private.
4. Set `MONGODB_DB_NAME` to `cse341-books-db`.
5. Create `authors` and `books` collections. Author documents have `id`, `name`, and integer `birthYear`. Book documents have `id`, `authorId`, `title`, and `publicationDate`; each `authorId` must match an author's custom `id`.
6. Start the server with `npm run dev`.

The app connects to MongoDB before it starts listening and creates unique indexes for custom author and book IDs. The local `.env` file is ignored by Git; do not commit database credentials.

### Migrating Week 1 book data

If your existing books still store the author's name in an `author` field, add matching author records first, then replace each book's `author` value with the matching author's custom ID in an `authorId` field. For example, a book with `"author": "Jane Austen"` should reference an author document such as `{"id":"a2","name":"Jane Austen","birthYear":1775}` by setting `"authorId":"a2"` and removing the old `author` field. Confirm every book references an existing author before using the write routes.

## API

Interactive API documentation is available at `/api-docs` when the server is running. Regenerate the OpenAPI document after changing route comments with `npm run swagger`.

## Week 2 implementation issues

1. [Implement Author Collection and API](https://github.com/JustineDube/cse341-books/issues/9).
2. [Update Book Collection to reference authors and finish Book API](https://github.com/JustineDube/cse341-books/issues/8).

| Method | Path | Success | Not found |
| --- | --- | --- | --- |
| `GET` | `/books` | `200` with an array of books | — |
| `GET` | `/books/:id` | `200` with the matching book | `404` with `{ "message": "Book not found" }` |
| `POST` | `/books` | `201` with the created book | — |
| `PUT` | `/books/:id` | `200` with the updated book | `404` with `{ "message": "Book not found" }` |
| `DELETE` | `/books/:id` | `204` with no body | `404` with `{ "message": "Book not found" }` |
| `GET` | `/authors` | `200` with an array of authors | — |
| `GET` | `/authors/:id` | `200` with the matching author | `404` with `{ "message": "Author not found" }` |
| `POST` | `/authors` | `201` with the created author | — |
| `PUT` | `/authors/:id` | `200` with the updated author | `404` with `{ "message": "Author not found" }` |
| `DELETE` | `/authors/:id` | `204` with no body | `404` with `{ "message": "Author not found" }` |

Create and update requests reject invalid fields or unknown author references with `400`. Duplicate custom IDs return `409`; deleting an author that still has books returns `409`. Non-JSON write requests return `415`. Unexpected database or server errors return `500` with `{ "message": "Internal server error" }`.

## Deployment

Configure `MONGODB_URI` and `MONGODB_DB_NAME` in the hosting provider's environment settings. Render supplies `PORT` automatically. Add the Render service's outbound IP ranges to the MongoDB Atlas IP access list.

Run `npm run swagger` after editing route documentation, `npm test` for validation tests, and `npm run lint` before opening a pull request. Interactive API documentation is available at `/api-docs`.
