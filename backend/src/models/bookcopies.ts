export interface BookCopy {
  copy_id: number; // Primary Key
  book_id: number; // Foreign Key referencing Book
  inventory_number: string; // Unique identifier for a book copy
  condition?: string;
  status: "Available" | "Borrowed"; // Constraint
  location?: string;
}
