import {
    authorHasBooks,
    createAuthor,
    deleteAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor
} from '../models/authors.js';
import {
    hasExactKeys,
    isValidBirthYear,
    isValidCustomId,
    isValidPersonName
} from '../utils/validation.js';

const invalidAuthorResponse = (res) => {
    return res.status(400).json({ message: 'Invalid author data' });
};

const getAllAuthorsHandler = async (req, res) => {
    try {
        const authors = await getAllAuthors();
        return res.status(200).json(authors);
    } catch (error) {
        console.error('GET /authors failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getAuthorByIdHandler = async (req, res) => {
    try {
        const author = await getAuthorById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        return res.status(200).json(author);
    } catch (error) {
        console.error('GET /authors/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const createAuthorHandler = async (req, res) => {
    if (!req.is('application/json')) {
        return res.status(415).json({ message: 'Content-Type must be application/json' });
    }

    const { id, name, birthYear } = req.body ?? {};
    if (
        !hasExactKeys(req.body, ['id', 'name', 'birthYear'])
        || !isValidCustomId(id)
        || !isValidPersonName(name, 200)
        || !isValidBirthYear(birthYear)
    ) {
        return invalidAuthorResponse(res);
    }

    try {
        if (await getAuthorById(id)) {
            return res.status(409).json({ message: 'Author id already exists' });
        }

        const author = { id, name: name.trim(), birthYear };
        const createdAuthor = await createAuthor(author);
        return res.status(201).json(createdAuthor);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Author id already exists' });
        }

        console.error('POST /authors failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateAuthorHandler = async (req, res) => {
    if (!req.is('application/json')) {
        return res.status(415).json({ message: 'Content-Type must be application/json' });
    }

    const { name, birthYear } = req.body ?? {};
    if (
        !hasExactKeys(req.body, ['name', 'birthYear'])
        || !isValidPersonName(name, 200)
        || !isValidBirthYear(birthYear)
    ) {
        return invalidAuthorResponse(res);
    }

    try {
        const updatedAuthor = await updateAuthor(req.params.id, {
            name: name.trim(),
            birthYear
        });

        if (!updatedAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }

        return res.status(200).json(updatedAuthor);
    } catch (error) {
        console.error('PUT /authors/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteAuthorHandler = async (req, res) => {
    try {
        const author = await getAuthorById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        if (await authorHasBooks(req.params.id)) {
            return res.status(409).json({ message: 'Author has books and cannot be deleted' });
        }

        const deleted = await deleteAuthor(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Author not found' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error('DELETE /authors/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    createAuthorHandler,
    deleteAuthorHandler,
    getAllAuthorsHandler,
    getAuthorByIdHandler,
    updateAuthorHandler
};
