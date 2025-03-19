import { Request } from "express";
export interface UserRole {
  role_id: number; // Primary Key
  role_name: "Admin" | "Librarian" | "Borrower"; // Unique role names
}



export interface RoleRequest extends Request {
    user?: {
      user_id: string;
      name: string;
      email: string;
      role_id: number;
      role_name: string;
    };
  }
  