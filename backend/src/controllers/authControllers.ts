import express from 'express'
import pool from '../config/db.config'

//register a user

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password } = req.body
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    )
    res.json(newUser.rows[0])
  } catch (error) {
    console.error("Unable to Register User",error)
  }
}

//login a user
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body
        const user = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND password = $2',
        [email, password]
        )
        if (user.rows.length === 0) {
        res.status(401).json('Invalid Credentials')
        return
        }
        res.json(user.rows[0])
    } catch (error) {
        console.error("Unable to Login User",error)
    }
}