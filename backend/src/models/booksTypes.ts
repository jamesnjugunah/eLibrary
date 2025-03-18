
import { Request } from 'express';
export interface Book {
  book_id: number;
  title: string;
  author: string;
  genre?: string;
  year?: number;
  pages?: number;
  publisher?: string;
  description?: string;
  price?: number;
  total_copies: number;
  available_copies: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface BookCopy {
  copy_id: number;
  book_id: number; // Foreign key from Books
  inventory_number: string;
  condition?: string;
  status: "Available" | "Borrowed";
  location?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface BookRequest extends Request {
  user?: {
      role_name: string;
      id: string;
  };
  event?: {
      id: string;
      user_id: string;
      title: string;
      location: string;
      date: string;
      price: number;
      created_at: Date;
      updated_at: Date;
  };
}
