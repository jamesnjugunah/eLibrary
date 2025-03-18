import { Response, Request, NextFunction } from "express";
import asyncHandler from "../asyncHandler";
import pool from "../../config/db.config";
import { BookRequest } from "../../models/booksTypes";

// Ensures user can only modify their own events
export const eventOwnerGuard = asyncHandler<void, BookRequest>(async (req: BookRequest, res: Response, next: NextFunction) => {
    const { id: eventId } = req.params;

    if (!req.user) {
        res.status(401).json({ message: "Not authorized" });
        return;
    }

    // Retrieve full event details
    const eventQuery = await pool.query(
        `SELECT id, user_id, title, location, date, price, created_at, updated_at
         FROM events 
         WHERE id = $1`,
        [eventId]
    );

    if (eventQuery.rows.length === 0) {
        res.status(404).json({ message: "Event not found" });
        return;
    }

    const event = eventQuery.rows[0];

    // Check if the user is the owner of the event
    if (event.user_id !== req.user.id) {
        res.status(403).json({ message: "Not authorized to edit this event" });
        return;
    }

    // Attach event details to request
    req.event = event;

    next();
});
