import { Request, Response, NextFunction } from "express";
import { RoleRequest } from "../../models/rolesTypes"
import asyncHandler from "../asyncHandler";


//ensure user has required roles 
export const roleGuard = (allowedRoles: string[]) =>
    asyncHandler<void, RoleRequest>(async (req:RoleRequest, res:Response, next:NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role_name)) {
            res.status(403).json({ message: "Access denied: Insufficient permissions" });
            return;
        }
        next();
    });



// Specific guards
export const adminGuard = roleGuard(["Admin"]);         // Full app control
export const organizerGuard = roleGuard(["librarian"]); // Event creation & management
export const attendeeGuard = roleGuard(["Borrower"]);   // Attendee-only actions

