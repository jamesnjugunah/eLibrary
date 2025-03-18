import { Router } from "express";
import { protect } from '../middleware/authMiddlewares/protect'
import {getBooks, createBook, getBookById, deleteBook, updateBook} from '../controllers/booksControllers';
import { adminGuard } from "@app/middleware/authMiddlewares/roleMiddleware";
import { organizerGuard } from "@app/middleware/authMiddlewares/roleMiddleware";
import { eventOwnerGuard } from "@app/middleware/eventsMiddlewares/eventsMiddleware";



const router = Router();

router.post('/books', protect, organizerGuard, createBook);
router.get('/books', protect, getBooks);
router.get('/books/:id', protect, getBookById);
router.delete('/books/:id', protect, adminGuard, deleteBook);
router.patch('/books/:id', protect, eventOwnerGuard, updateBook);
 

export default router;
