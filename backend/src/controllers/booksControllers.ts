import {Request, Response}  from 'express';
import pool from '../config/db.config';



//add a book
export const addBook = async (req: Request, res: Response) => {
    try {
        const { title, author, price } = req.body;
        const newBook = await pool.query('INSERT INTO books (title, author, price) VALUES ($1, $2, $3) RETURNING *', [title, author, price]);
        res.json(newBook.rows[0]);
    } catch (error) {
        console.error(error);
    }

}

//get all books
export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await pool.query('SELECT * FROM books');
        res.json(books.rows);
    } catch (error) {
        console.error(error);
    }
};

//get a single book
export const getBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const book = await pool.query('SELECT * FROM books WHERE book_id = $1', [id]);
        res.json(book.rows[0]);
    } catch (error) {
        console.error(error);
    }
};

//delete a book
export const deleteBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM books WHERE book_id = $1', [id]);
        res.json('Book deleted');
    } catch (error) {
        console.error("Book successfully deleted",error);
    }
}


//update a book
export const updateBook = async (req: Request, res: Response) => {  
    try {
        const { id } = req.params;
        const { title, author, price } = req.body;
        const updatedBook = await pool.query('UPDATE books SET title = $1, author = $2, price = $3 WHERE book_id = $4 RETURNING *', [title, author, price, id]);
        res.json(updatedBook.rows[0]);
    } catch (error) {
        console.error(error);
    }
}

//get book by title
export const getBookByTitle = async (req: Request, res: Response) => {
    try {
        const { title } = req.params;
        const book = await pool.query('SELECT * FROM books WHERE title = $1', [title]);
        res.json(book.rows[0]);
    } catch (error) {
        console.error(error);
    }
}