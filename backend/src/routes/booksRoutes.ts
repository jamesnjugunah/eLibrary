import { Router } from "express";
import {getBooks, createBook, getBookById, deleteBook, updateBook} from '../controllers/booksControllers';

const router = Router();

router.post('/books', createBook);
router.get('/books', getBooks);
router.get('/books/:id', getBookById);
router.delete('/books/:id', deleteBook);
router.patch('/books/:id', updateBook);
 

export default router;
