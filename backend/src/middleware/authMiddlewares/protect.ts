import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../../config/db.config";
import { UserRequest } from "../../models/usersTypes";
import asyncHandler from "../asyncHandler";

// Auth middleware to protect routes 
export const protect = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
    let token;

    console.log("Authorization Header:", req.headers.authorization);
    console.log("Cookies:", req.cookies);

    // Try getting token from Authorization Header 
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Get the token from cookies 
    if (!token && req.cookies?.access_token) {
        token = req.cookies.access_token;
    }

    // If no token found, stop execution and return an error
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        // Ensure JWT secret is defined
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        // Verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { user_id: string; role_id: number };

        // Get the user from the database
        const userQuery = await pool.query(
            `SELECT users.user_id, users.name, users.email, users.role_id, user_role.role_name 
             FROM users 
             JOIN user_role ON users.role_id = user_role.role_id
             WHERE users.user_id = $1`,
            [decoded.user_id]
        );

        // If user is not found, return an error and stop execution
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        // Attach user to request 
        req.user = userQuery.rows[0];

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
});
