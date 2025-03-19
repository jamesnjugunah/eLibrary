import { Response } from 'express';
import pool from '../config/db.config';
import asyncHandler from '../middleware/asyncHandler';
import { UserRequest } from '../models/usersTypes'; // Ensure UserRequest includes user role


// 📌 Borrow a Book
export const borrowBook = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const { book_id, return_date } = req.body;
    const user_id = req.user.user_id;
    const librarian_id = req.user.role_name === "Librarian" ? req.user.user_id : null; // Only assign if the user is a librarian

    if (!book_id || !return_date) {
        return res.status(400).json({ message: "Book ID and return date are required" });
    }

    // Ensure the book is not already borrowed
    const bookCheck = await pool.query(`SELECT * FROM borrowers WHERE book_id = $1`, [book_id]);
    if (bookCheck.rows.length > 0) {
        return res.status(400).json({ message: "Book is already borrowed" });
    }

    // Insert borrow record
    const borrowBookQuery = `INSERT INTO borrowers (book_id, user_id, librarian_id, return_date) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [book_id, user_id, librarian_id, return_date];
    const borrowedBook = await pool.query(borrowBookQuery, values);

    res.status(201).json({ message: "Book borrowed successfully", data: borrowedBook.rows[0] });
});

// 📌 Get Borrowed Books for the Logged-in User
export const getBorrowedBooks = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }

    let borrowedBooks;

    // If the user is a Librarian or Admin, they can see all borrowed books
    if (req.user.role_name === "Librarian" || req.user.role_name === "Admin") {
        borrowedBooks = await pool.query(`SELECT * FROM BorrowedBooks ORDER BY return_date ASC`);
    } else {
        // Regular users can only see books they borrowed
        borrowedBooks = await pool.query(`SELECT * FROM borrowers WHERE user_id = $1 ORDER BY return_date ASC`, [req.user.user_id]);
    }

    res.status(200).json({ message: "borrowers retrieved successfully", data: borrowedBooks.rows });
});

// 📌 Return a Borrowed Book
export const returnBorrowedBook = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const { id } = req.params;

    // Check if the book exists and is borrowed
    const bookQuery = await pool.query(`SELECT * FROM borrowers WHERE id = $1`, [id]);

    if (bookQuery.rows.length === 0) {
        return res.status(404).json({ message: "Book not found or not borrowed" });
    }

    const borrowedBook = bookQuery.rows[0];

    // Only allow return if the user is an **Admin, Librarian**, or **the user who borrowed the book**
    if (borrowedBook.user_id !== req.user.user_id && req.user.role_name !== "Librarian" && req.user.role_name !== "Admin") {
        return res.status(403).json({ message: "Not authorized to return this book" });
    }

    // Start a transaction to ensure consistency
    try {
        await pool.query("BEGIN");

        // Delete borrow record (return book)
        await pool.query(`DELETE FROM borrowers WHERE id = $1`, [id]);

        // Update available books count in the `books` table
        await pool.query(`UPDATE books SET available_copies = available_copies + 1 WHERE book_id = $1`, [borrowedBook.book_id]);

        // Commit the transaction
        await pool.query("COMMIT");

        res.status(200).json({ message: "Book returned successfully and stock updated" });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error returning book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
