import { Request, Response, NextFunction } from "express";
import pool from "../config/db.config";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/tokens";
import asyncHandler from "../middleware/asyncHandler";

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role_name } = req.body;

    try {
        // Check if the user already exists
        const userExists = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Get role_id from user_roles table using role_name
        const roleQuery = await pool.query("SELECT role_id FROM user_role WHERE role_name = $1", [role_name]);

        if (roleQuery.rows.length === 0) {
            return res.status(400).json({ message: "Invalid role name" });
        }

        const role_id = roleQuery.rows[0].role_id;

        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into users table
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role_id",
            [name, email, hashedPassword, role_id]
        );

        // Generate JWT token for user access
        generateToken(res, newUser.rows[0].user_id, newUser.rows[0].role_id);

        res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0],
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists and retrieve hashed password & role details
        const userQuery = await pool.query(
            `SELECT users.user_id, users.name, users.email, users.password_hash, users.role_id, user_role.role_name
             FROM users
             JOIN user_role ON users.role_id = user_role.role_id
             WHERE users.email = $1`,
            [email]
        );

        if (userQuery.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" }); // Generic error to prevent enumeration attacks
        }

        const user = userQuery.rows[0];

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" }); // Consistent error message
        }

        // Generate JWT token & set it in HTTP-only cookies
        generateToken(res, user.user_id, user.role_id);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                role_name: user.role_name,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Logout User - Clears the cookies to invalidate authentication
export const logoutUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie("access_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            expires: new Date(0) // Expire immediately
        });

        res.cookie("refresh_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            expires: new Date(0) // Expire immediately
        });

        res.status(200).json({ message: "User logged out successfully" });

    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
