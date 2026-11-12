import { getDb } from '../db/connect.js';

const bookProjection = {
    _id: 0,
    id: 1,
    authorId: 1,
    title: 1,
    publicationDate: 1
};

const getAllBooks = async () => {
    const books = await getDb()
        .collection('books')
        .find({}, { projection: bookProjection })
        .toArray();
    return books;
};

const getBookById = async (bookId) => {
    const book = await getDb()
        .collection('books')
        .findOne({ id: bookId }, { projection: bookProjection });
    return book;
};

const authorExists = async (authorId) => {
    const author = await getDb()
        .collection('authors')
        .findOne({ id: authorId }, { projection: { _id: 1 } });
    return Boolean(author);
};

const createBook = async (book) => {
    await getDb().collection('books').insertOne(book);
    return book;
};

const updateBook = async (bookId, changes) => {
    const result = await getDb().collection('books').updateOne(
        { id: bookId },
        { $set: changes }
    );

    if (result.matchedCount === 0) {
        return null;
    }

    return getBookById(bookId);
};

const deleteBook = async (bookId) => {
    const result = await getDb().collection('books').deleteOne({ id: bookId });
    return result.deletedCount > 0;
};

export {
    authorExists,
    createBook,
    deleteBook,
    getAllBooks,
    getBookById,
    updateBook
};
