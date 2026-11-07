# CSE 341 Books API

An Express web service that reads book records from MongoDB.

## Week 1 task plan

1. [Create the books collection and connect the app to MongoDB](https://github.com/JustineDube/cse341-books/issues/1).
2. [Implement a route to retrieve all books](https://github.com/JustineDube/cse341-books/issues/2).
3. [Implement a route to retrieve one book by id](https://github.com/JustineDube/cse341-books/issues/3).
4. [Deploy and test the application](https://github.com/JustineDube/cse341-books/issues/4).

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI` to your MongoDB connection string and keep it private.
4. Set `MONGODB_DB_NAME` to `cse341-books-db`.
5. Create a `books` collection in that database and insert at least three documents. Each document should have string fields `id`, `author`, `title`, and `publicationDate` (ISO 8601 date, for example `2021-08-17`).
6. Start the server with `npm run dev`.

The app connects to MongoDB before it starts listening. The local `.env` file is ignored by Git; do not commit database credentials.

## Deployment

Configure `MONGODB_URI` and `MONGODB_DB_NAME` in the hosting provider's environment settings. Render supplies `PORT` automatically. Add the Render service's outbound IP ranges to the MongoDB Atlas IP access list.
