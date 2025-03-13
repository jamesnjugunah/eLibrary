import {Request, Response} from 'express';  
import pool from '../config/db.config';


// Borrow a book
export const borrowBook = async (req: Request, res: Response) => {
    try {
        const { book_id, user_id } = req.body;
        const borrowBookQuery = `INSERT INTO borrowed_books (book_id, user_id) VALUES ($1, $2) RETURNING *`;
        const values = [book_id, user_id];
        const borrowedBook = await pool.query(borrowBookQuery, values);
        res.status(200).json({ message: 'Book borrowed successfully', data: borrowedBook.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
}

// get all borrowed books
export const getBorrowedBooks = async (req: Request, res: Response) => {
    try {
        const getBorrowedBooksQuery = `SELECT * FROM borrowed_books`;
        const borrowedBooks = await pool.query(getBorrowedBooksQuery);
        res.status(200).json({ message: 'All borrowed books', data: borrowedBooks.rows });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
}

//return a borrowed book
export const returnBorrowedBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const returnBorrowedBookQuery = `DELETE FROM borrowed_books WHERE id = $1`;
        const values = [id];
        await pool.query(returnBorrowedBookQuery, values);
        res.status(200).json({ message: 'Book returned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
}