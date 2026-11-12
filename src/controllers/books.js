import {
    authorExists,
    createBook,
    deleteBook,
    getAllBooks,
    getBookById,
    updateBook
} from '../models/books.js';
import {
    hasExactKeys,
    isValidCustomId,
    isValidPersonName,
    isValidPublicationDate
} from '../utils/validation.js';

const invalidBookResponse = (res) => {
    return res.status(400).json({ message: 'Invalid book data' });
};

const getBookInput = (body, isCreate) => {
    const expectedKeys = isCreate
        ? ['id', 'authorId', 'title', 'publicationDate']
        : ['authorId', 'title', 'publicationDate'];

    if (
        !hasExactKeys(body, expectedKeys)
        || (isCreate && !isValidCustomId(body.id))
        || !isValidCustomId(body.authorId)
        || !isValidPersonName(body.title, 300)
        || !isValidPublicationDate(body.publicationDate)
    ) {
        return null;
    }

    const book = {
        authorId: body.authorId,
        title: body.title.trim(),
        publicationDate: body.publicationDate
    };

    if (isCreate) {
        book.id = body.id;
    }

    return book;
};

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('GET /books failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getBookByIdHandler = async (req, res) => {
    const requestedId = req.params.id;

    try {
        const book = await getBookById(requestedId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('GET /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const createBookHandler = async (req, res) => {
    if (!req.is('application/json')) {
        return res.status(415).json({ message: 'Content-Type must be application/json' });
    }

    const book = getBookInput(req.body, true);
    if (!book) {
        return invalidBookResponse(res);
    }

    try {
        if (!await authorExists(book.authorId)) {
            return invalidBookResponse(res);
        }

        const createdBook = await createBook(book);
        return res.status(201).json(createdBook);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Book id already exists' });
        }

        console.error('POST /books failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateBookHandler = async (req, res) => {
    if (!req.is('application/json')) {
        return res.status(415).json({ message: 'Content-Type must be application/json' });
    }

    const changes = getBookInput(req.body, false);
    if (!changes) {
        return invalidBookResponse(res);
    }

    try {
        const existingBook = await getBookById(req.params.id);
        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!await authorExists(changes.authorId)) {
            return invalidBookResponse(res);
        }

        const updatedBook = await updateBook(req.params.id, changes);
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(updatedBook);
    } catch (error) {
        console.error('PUT /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteBookHandler = async (req, res) => {
    try {
        const deleted = await deleteBook(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error('DELETE /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    createBookHandler,
    deleteBookHandler,
    getBookByIdHandler,
    getBooksHandler,
    updateBookHandler
};
