import { Request } from "express";
export interface UserRole {
  role_id: number; // Primary Key
  role_name: "Admin" | "Librarian" | "Borrower"; // Unique role names
}



export interface RoleRequest extends Request {
    user?: {
      id: string;
      name: string;
      email: string;
      role_id: number;
      role_name: string;
      created_at?: Date;
      updated_at?: Date;
    };
  }
  