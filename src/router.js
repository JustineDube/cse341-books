import express from 'express';
import {
    createAuthorHandler,
    deleteAuthorHandler,
    getAllAuthorsHandler,
    getAuthorByIdHandler,
    updateAuthorHandler
} from './controllers/authors.js';
import {
    createBookHandler,
    deleteBookHandler,
    getBookByIdHandler,
    getBooksHandler,
    updateBookHandler
} from './controllers/books.js';

const router = express.Router();

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/books', getBooksHandler);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Retrieve a book by custom ID
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The book's custom ID
 *         schema:
 *           type: string
 *         example: b1
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Book not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/books/:id', getBookByIdHandler);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a book
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *           example:
 *             id: b4
 *             authorId: a1
 *             title: Example Book Title
 *             publicationDate: 2026-01-15
 *     responses:
 *       201:
 *         description: Book created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         $ref: '#/components/responses/InvalidBookData'
 *       409:
 *         description: Book ID already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Book id already exists
 *       415:
 *         $ref: '#/components/responses/UnsupportedMediaType'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/books', createBookHandler);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Replace a book's editable fields
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The book's custom ID
 *         schema:
 *           type: string
 *         example: b1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdate'
 *           example:
 *             authorId: a2
 *             title: Updated Book Title
 *             publicationDate: 2026-02-20
 *     responses:
 *       200:
 *         description: Book updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         $ref: '#/components/responses/InvalidBookData'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Book not found
 *       415:
 *         $ref: '#/components/responses/UnsupportedMediaType'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/books/:id', updateBookHandler);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The book's custom ID
 *         schema:
 *           type: string
 *         example: b1
 *     responses:
 *       204:
 *         description: Book deleted; no response body
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Book not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/books/:id', deleteBookHandler);

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Retrieve all authors
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: Authors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/authors', getAllAuthorsHandler);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Retrieve an author by custom ID
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The author's custom ID
 *         schema:
 *           type: string
 *         example: a1
 *     responses:
 *       200:
 *         description: Author retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Author not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/authors/:id', getAuthorByIdHandler);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create an author
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *           example:
 *             id: a4
 *             name: Example Author
 *             birthYear: 1980
 *     responses:
 *       201:
 *         description: Author created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         $ref: '#/components/responses/InvalidAuthorData'
 *       409:
 *         description: Author ID already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Author id already exists
 *       415:
 *         $ref: '#/components/responses/UnsupportedMediaType'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/authors', createAuthorHandler);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Replace an author's editable fields
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The author's custom ID
 *         schema:
 *           type: string
 *         example: a1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorUpdate'
 *           example:
 *             name: Updated Author
 *             birthYear: 1981
 *     responses:
 *       200:
 *         description: Author updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         $ref: '#/components/responses/InvalidAuthorData'
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Author not found
 *       415:
 *         $ref: '#/components/responses/UnsupportedMediaType'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/authors/:id', updateAuthorHandler);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author with no books
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The author's custom ID
 *         schema:
 *           type: string
 *         example: a1
 *     responses:
 *       204:
 *         description: Author deleted; no response body
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Author not found
 *       409:
 *         description: Author has books and cannot be deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Author has books and cannot be deleted
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/authors/:id', deleteAuthorHandler);

export default router;
