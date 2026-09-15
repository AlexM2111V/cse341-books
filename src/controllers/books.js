import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../models/books.js';
import { authorExists } from '../models/authors.js';

const isMissingString = (value) => {
  return typeof value !== 'string' || value.trim().length === 0;
};

const isValidIsoDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
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
  const { id, authorId, title, publicationDate } = req.body;

  const missingFields = [];
  if (isMissingString(id)) missingFields.push('id');
  if (isMissingString(authorId)) missingFields.push('authorId');
  if (isMissingString(title)) missingFields.push('title');
  if (isMissingString(publicationDate) || !isValidIsoDate(publicationDate)) {
    missingFields.push('publicationDate');
  }

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required field(s): ${missingFields.join(', ')}` });
  }

  try {
    const existingBook = await getBookById(id);

    if (existingBook) {
      return res.status(400).json({ message: `A book with id "${id}" already exists` });
    }

    const authorFound = await authorExists(authorId);

    if (!authorFound) {
      return res.status(400).json({ message: `No author exists with id "${authorId}"` });
    }

    const book = await createBook({ id, authorId, title, publicationDate });
    return res.status(201).json(book);
  } catch (error) {
    console.error('POST /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookHandler = async (req, res) => {
  const { id } = req.params;
  const { id: bodyId, authorId, title, publicationDate } = req.body;

  if (bodyId !== undefined && bodyId !== id) {
    return res.status(400).json({ message: 'Request body id does not match the id in the URL' });
  }

  const missingFields = [];
  if (isMissingString(authorId)) missingFields.push('authorId');
  if (isMissingString(title)) missingFields.push('title');
  if (isMissingString(publicationDate) || !isValidIsoDate(publicationDate)) {
    missingFields.push('publicationDate');
  }

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required field(s): ${missingFields.join(', ')}` });
  }

  try {
    const authorFound = await authorExists(authorId);

    if (!authorFound) {
      return res.status(400).json({ message: `No author exists with id "${authorId}"` });
    }

    const updatedBook = await updateBook(id, { authorId, title, publicationDate });

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
  const { id } = req.params;

  try {
    const existingBook = await getBookById(id);

    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await deleteBook(id);
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler
};