import { Request } from "express";
export interface UserRole {
    role_id: number;
    role_name: "Admin" | "Librarian" | "Borrower";
  }
  
  export interface User {
    user_id: number;
    name: string;
    email: string;
    password_hash: string;
    role_id: number;
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface UserRequest extends Request {
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