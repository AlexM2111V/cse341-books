import express from 'express';
import { getBooksHandler, getBookByIdHandler } from './controllers/books.js';
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from './controllers/authors.js';

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get all books
 *     description: Returns the full list of books
 *     responses:
 *       200:
 *         description: A list of books
 *       500:
 *         description: Unable to retrieve books
 */
router.get('/books', getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get a book by ID
 *     description: Returns a single book matching the given ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The custom book ID, such as b1
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Unable to retrieve the book
 */
router.get('/books/:id', getBookByIdHandler);

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: A list of authors
 *       500:
 *         description: Internal server error
 */
router.get('/authors', getAllAuthors);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     tags:
 *       - Authors
 *     summary: Get an author by ID
 *     description: Returns a single author matching the given ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The custom author ID, such as a1
 *     responses:
 *       200:
 *         description: Author returned successfully
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.get('/authors/:id', getAuthorById);

/**
 * @openapi
 * /authors:
 *   post:
 *     tags:
 *       - Authors
 *     summary: Create a new author
 *     description: Creates a new author document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - birthYear
 *             properties:
 *               id:
 *                 type: string
 *                 example: a3
 *               name:
 *                 type: string
 *                 example: Example Author Name
 *               birthYear:
 *                 type: integer
 *                 example: 1980
 *     responses:
 *       201:
 *         description: Author created successfully
 *       400:
 *         description: Missing or invalid required field(s), or an author with this id already exists
 *       500:
 *         description: Internal server error
 */
router.post('/authors', createAuthor);

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     tags:
 *       - Authors
 *     summary: Update an existing author
 *     description: Replaces name and birthYear for an existing author. The id in the body, if present, must match the URL id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The custom author ID, such as a1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthYear
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Author Name
 *               birthYear:
 *                 type: integer
 *                 example: 1980
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       400:
 *         description: Missing or invalid required field(s), or body id does not match the URL id
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.put('/authors/:id', updateAuthor);

/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     tags:
 *       - Authors
 *     summary: Delete an existing author
 *     description: Deletes an author, unless a book still references their id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The custom author ID, such as a1
 *     responses:
 *       204:
 *         description: Author deleted successfully
 *       400:
 *         description: Cannot delete an author still referenced by one or more books
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.delete('/authors/:id', deleteAuthor);

export default router;