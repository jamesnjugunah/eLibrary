import { Router } from "express";
import {getBooks, addBook, getBook, deleteBook, updateBook} from '../controllers/booksControllers';

const router = Router();

router.post('/books', addBook);
router.get('/books', getBooks);
router.get('/books/:id', getBook);
router.delete('/books/:id', deleteBook);
router.patch('/books/:id', updateBook);
 

export default router;
