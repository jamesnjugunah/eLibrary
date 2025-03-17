import { Response } from "express";
import pool from "../config/db.config";
import { UserRequest } from '../models/usersTypes';
import asyncHandler from "../middleware/asyncHandler";
import { EventRequest } from "../models/booksTypes";

export const createBook = asyncHandler(async (req: UserRequest, res: Response) => {
    //Modify the createEvent function inside eventController.ts so that user_id is dynamically obtained from the logged-in user.
    //     ✅ Now, user_id is automatically set from the token instead of being manually provided.
    // ✅ Ensures only Organizer or Admin roles can create events.
    try {
        // Extract user_id from the authenticated user's token
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const user_id = req.user.id; // User ID from token
        const { title, location, date, price } = req.body;

        // Ensure that only an Organizer or the Adim can create an event
    
        if (req.user.role_name !== "Organizer" && req.user.role_name !== "Admin") {
            res.status(403).json({ message: "Access denied: Only Organizers or Admins can create events" });
            return;
        }

        // Insert event into the database
        const eventResult = await pool.query(
            `INSERT INTO events (title, location, date, price, user_id) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, location, date, price, user_id]
        );

        res.status(201).json({
            message: "Event created successfully",
            event: eventResult.rows[0]
        });

    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all events (Public - Attendees, Organizers, Admins)
export const getBooks = asyncHandler(async (req: EventRequest, res: Response) => {
    const result = await pool.query("SELECT * FROM events ORDER BY date ASC");
    res.status(200).json(result.rows);
});

// Get single event by ID (Public - Attendees, Organizers, Admins)
export const getBookById = asyncHandler(async (req: EventRequest, res: Response) => {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM events WHERE id=$1", [id]);

    if (result.rows.length === 0) {
        res.status(404).json({ message: "Event not found" });
        return;
    }

    res.status(200).json(result.rows[0]);
});

// Update event (Only the event owner or Admin)
export const updateBook = asyncHandler(async (req: EventRequest, res: Response) => {
    const { id } = req.params;
    const { title, location, date, price } = req.body;

    if (!req.user) {
        res.status(401).json({ message: "Not authorized" });
        return;
    }

    // Check if the event exists
    const eventQuery = await pool.query("SELECT user_id FROM events WHERE id=$1", [id]);

    if (eventQuery.rows.length === 0) {
        res.status(404).json({ message: "Event not found" });
        return;
    }

    // Check if the user is the owner or an Admin
    if (eventQuery.rows[0].user_id !== req.user.id && req.user.role_name !== "Admin") {
        res.status(403).json({ message: "Not authorized to update this event" });
        return;
    }

    // Update event
    const result = await pool.query(
        "UPDATE events SET title=$1, location=$2, date=$3, price=$4, updated_at=NOW() WHERE id=$5 RETURNING *",
        [title, location, date, price, id]
    );

    res.json({ message: "Event updated", event: result.rows[0] });
});

// Delete event (Only the event owner or Admin)
export const deleteBook = asyncHandler(async (req: EventRequest, res: Response) => {
    const { id } = req.params;

    if (!req.user) {
        res.status(401).json({ message: "Not authorized" });
        return;
    }

    // Check if the event exists
    const eventQuery = await pool.query("SELECT user_id FROM events WHERE id=$1", [id]);

    if (eventQuery.rows.length === 0) {
        res.status(404).json({ message: "Event not found" });
        return;
    }

    // Check if the user is the owner or an Admin
    if (eventQuery.rows[0].user_id !== req.user.id && req.user.role_name !== "Admin") {
        res.status(403).json({ message: "Not authorized to delete this event" });
        return;
    }

    // Delete event
    await pool.query("DELETE FROM events WHERE id=$1", [id]);
    res.json({ message: "Event deleted successfully" });
});
