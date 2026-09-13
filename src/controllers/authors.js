import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorFromDb,
  updateAuthor as updateAuthorFromDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks as authorHasBooksFromDb
} from '../models/authors.js';

const isMissingString = (value) => {
  return typeof value !== 'string' || value.trim().length === 0;
};

const isMissingNumber = (value) => {
  return typeof value !== 'number' || Number.isNaN(value);
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    console.error('GET /authors failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAuthorById = async (req, res) => {
  const { id } = req.params;

  try {
    const author = await getAuthorByIdFromDb(id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('GET /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createAuthor = async (req, res) => {
  const { id, name, birthYear } = req.body;

  const missingFields = [];
  if (isMissingString(id)) missingFields.push('id');
  if (isMissingString(name)) missingFields.push('name');
  if (isMissingNumber(birthYear)) missingFields.push('birthYear');

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required field(s): ${missingFields.join(', ')}` });
  }

  try {
    const existingAuthor = await getAuthorByIdFromDb(id);

    if (existingAuthor) {
      return res.status(400).json({ message: `An author with id "${id}" already exists` });
    }

    const author = await createAuthorFromDb({ id, name, birthYear });
    return res.status(201).json(author);
  } catch (error) {
    console.error('POST /authors failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAuthor = async (req, res) => {
  const { id } = req.params;
  const { id: bodyId, name, birthYear } = req.body;

  if (bodyId !== undefined && bodyId !== id) {
    return res.status(400).json({ message: 'Request body id does not match the id in the URL' });
  }

  const missingFields = [];
  if (isMissingString(name)) missingFields.push('name');
  if (isMissingNumber(birthYear)) missingFields.push('birthYear');

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required field(s): ${missingFields.join(', ')}` });
  }

  try {
    const updatedAuthor = await updateAuthorFromDb(id, { name, birthYear });

    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error('PUT /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAuthor = async (req, res) => {
  const { id } = req.params;

  try {
    const existingAuthor = await getAuthorByIdFromDb(id);

    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const hasBooks = await authorHasBooksFromDb(id);

    if (hasBooks) {
      return res.status(400).json({ message: `Cannot delete author "${id}": still referenced by one or more books` });
    }

    await deleteAuthorFromDb(id);
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };