import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection('authors');
  const authors = await collection.find({}).toArray();

  return authors;
};

const getAuthorById = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id });

  return author;
};

const createAuthor = async (author) => {
  const db = getDb();
  const collection = db.collection('authors');
  await collection.insertOne(author);

  return author;
};

const updateAuthor = async (id, author) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.findOneAndUpdate(
    { id },
    { $set: author },
    { returnDocument: 'after' }
  );

  return result;
};

const deleteAuthor = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.deleteOne({ id });

  return result.deletedCount > 0;
};

const authorHasBooks = async (id) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ authorId: id });

  return Boolean(book);
};

const authorExists = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id });

  return Boolean(author);
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks,
  authorExists
};