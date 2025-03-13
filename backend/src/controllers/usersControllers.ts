import express, { Request, Response } from 'express';
import pool from '../config/db.config';


//get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json(users.rows);
    } catch (error) {
        console.error(error);
    }
};

//get a user
export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        res.json(user.rows[0]);
    } catch (error) {
        console.error(error);
    }
};

//delete a user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
        res.json('User deleted');
    } catch (error) {
        console.error("User successfully deleted",error);
    }
};