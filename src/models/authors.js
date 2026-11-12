import { getDb } from '../db/connect.js';

const authorProjection = {
    _id: 0,
    id: 1,
    name: 1,
    birthYear: 1
};

const getAllAuthors = async () => {
    const authors = await getDb()
        .collection('authors')
        .find({}, { projection: authorProjection })
        .toArray();
    return authors;
};

const getAuthorById = async (authorId) => {
    const author = await getDb()
        .collection('authors')
        .findOne({ id: authorId }, { projection: authorProjection });
    return author;
};

const createAuthor = async (author) => {
    await getDb().collection('authors').insertOne(author);
    return author;
};

const updateAuthor = async (authorId, changes) => {
    const result = await getDb().collection('authors').updateOne(
        { id: authorId },
        { $set: changes }
    );

    if (result.matchedCount === 0) {
        return null;
    }

    return getAuthorById(authorId);
};

const authorHasBooks = async (authorId) => {
    const book = await getDb().collection('books').findOne({ authorId }, { projection: { _id: 1 } });
    return Boolean(book);
};

const deleteAuthor = async (authorId) => {
    const result = await getDb().collection('authors').deleteOne({ id: authorId });
    return result.deletedCount > 0;
};

export {
    authorHasBooks,
    createAuthor,
    deleteAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor
};
