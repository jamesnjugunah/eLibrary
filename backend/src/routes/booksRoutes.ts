import { Router } from "express";
import { protect } from '../middleware/authMiddlewares/protect'
import {getBooks, createBook, getBookById, deleteBook, updateBook} from '../controllers/booksControllers';
import { adminGuard } from "@app/middleware/authMiddlewares/roleMiddleware";
import { organizerGuard } from "@app/middleware/authMiddlewares/roleMiddleware";
import { eventOwnerGuard } from "@app/middleware/eventsMiddlewares/eventsMiddleware";



const router = Router();

router.post('/books', protect, createBook);
router.get('/getbooks', getBooks);
router.get('/getbook/:id', protect, getBookById);
router.delete('/deletebook/:id', protect, adminGuard, deleteBook);
router.patch('/updatebook/:id', protect, eventOwnerGuard, updateBook);
 

export default router;
