import { Response } from "express";
import pool from "../config/db.config";
import { UserRequest } from "../models/usersTypes";
import asyncHandler from "../middleware/asyncHandler";
import { BookRequest } from "../models/booksTypes";

/**
 * Create a new book (Only Admins can create books)
 */
export const createBook = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const { title, author, genre, year, pages, publisher, description, price } = req.body;

        // Ensure only Admins can create books
        if (req.user.role_name !== "Admin") {
            res.status(403).json({ message: "Access denied: Only Admins can add books" });
            return;
        }

        // Insert book into the database (Fixed SQL Query)
        const bookResult = await pool.query(
            `INSERT INTO books (title, author, genre, year, pages, publisher, description, price) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,  // ✅ Fixed here
            [title, author, genre, year, pages, publisher, description, price]
        );

        res.status(201).json({
            message: "Book created successfully",
            book: bookResult.rows[0],
        });

    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * Get all books
 */
export const getBooks = asyncHandler(async (req: BookRequest, res: Response) => {
    const result = await pool.query("SELECT * FROM books ORDER BY title ASC");
    res.status(200).json(result.rows);
});

/**
 * Get a single book by ID
 */
export const getBookById = asyncHandler(async (req: BookRequest, res: Response) => {
    const { book_id } = req.params;

    const result = await pool.query("SELECT * FROM books WHERE book_id = $1", [book_id]);

    if (result.rows.length === 0) {
        res.status(404).json({ message: "Book not found" });
        return;
    }

    res.status(200).json(result.rows[0]);
});

/**
 * Update a book (Only Admins)
 */
export const updateBook = asyncHandler(async (req: BookRequest, res: Response) => {
    const { book_id } = req.params;
    const { title, author, genre, year, pages, publisher, description, price } = req.body;

    if (!req.user) {
        res.status(401).json({ message: "Not authorized" });
        return;
    }

    // Check if the book exists
    const bookQuery = await pool.query("SELECT * FROM books WHERE book_id = $1", [book_id]);

    if (bookQuery.rows.length === 0) {
        res.status(404).json({ message: "Book not found" });
        return;
    }

    // Only Admins can update books
    if (req.user.role_name !== "Admin") {
        res.status(403).json({ message: "Not authorized to update this book" });
        return;
    }

    // Update book
    const result = await pool.query(
        `UPDATE books 
         SET title=$1, author=$2, genre=$3, year=$4, pages=$5, publisher=$6, description=$7, price=$8, total_copies=$9, available_copies=$9, updated_at=NOW() 
         WHERE book_id=$10 RETURNING *`,
        [title, author, genre, year, pages, publisher, description, price, book_id]
    );

    res.json({ message: "Book updated", book: result.rows[0] });
});

/**
 * Delete a book (Only Admins)
 */
export const deleteBook = asyncHandler(async (req: BookRequest, res: Response) => {
    const { book_id } = req.params;

    if (!req.user) {
        res.status(401).json({ message: "Not authorized" });
        return;
    }

    // Check if the book exists
    const bookQuery = await pool.query("SELECT * FROM books WHERE book_id = $1", [book_id]);

    if (bookQuery.rows.length === 0) {
        res.status(404).json({ message: "Book not found" });
        return;
    }

    // Only Admins can delete books
    if (req.user.role_name !== "Admin") {
        res.status(403).json({ message: "Not authorized to delete this book" });
        return;
    }

    // Delete book
    await pool.query("DELETE FROM books WHERE book_id = $1", [book_id]);
    res.json({ message: "Book deleted successfully" });
});
