import { Router } from "express";
import { borrowBook, getBorrowedBooks, returnBorrowedBook } from "../controllers/borrowControllers";


const router = Router();
router.post('/borrow', borrowBook);
router.get('/borrowed', getBorrowedBooks);
router.delete('/borrowed/:id', returnBorrowedBook);




export default router;